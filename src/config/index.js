require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'mcp_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'mcp-secret-key-change-in-production',
    expiresIn: '24h',
  },

  mqtt: {
    url: process.env.MQTT_URL || 'mqtt://localhost:1883',
  },

  mcp: {
    gridRefreshInterval: 5000,
    forecastHorizon: 24,
    theftThreshold: 0.15,
    loadShedPriority: ['critical', 'residential', 'commercial', 'industrial'],
  },
};