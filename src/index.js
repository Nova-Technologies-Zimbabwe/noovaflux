const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const db = require('./models');
const { setupWebSocket } = require('./services/websocket.service');
const { startWorkers } = require('./workers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.get('/', (req, res) => {
  res.json({ 
    name: 'NOVAFLUX MCP API', 
    version: '1.0.0',
    docs: 'Use /api/* endpoints',
    endpoints: [
      '/api/auth', '/api/meters', '/api/grid', '/api/forecast',
      '/api/billing', '/api/alerts', '/api/outages', '/api/renewables'
    ]
  });
});

const routes = require('./routes');
app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

async function start() {
  try {
    console.log('Starting MCP...');
    setupWebSocket(io);
    startWorkers();

    server.listen(config.port, () => {
      console.log(`MCP running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();

module.exports = { app, server, io };