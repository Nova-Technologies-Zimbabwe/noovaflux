const RedisClient = require('./redis.service');

class WebSocketService {
  constructor() {
    this.io = null;
    this.redis = RedisClient;
  }

  init(io) {
    this.io = io;
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    this.redis.subscribe('grid:state:update', (data) => {
      this.emit('grid:update', data);
    });

    this.redis.subscribe('alerts:new', (data) => {
      this.emit('alert:new', data);
    });

    this.redis.subscribe('meter:reading', (data) => {
      this.emit('meter:reading', data);
    });

    this.redis.subscribe('outage:update', (data) => {
      this.emit('outage:update', data);
    });
  }

  emit(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  emitToUser(userId, event, data) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(event, data);
    }
  }

  emitToRegion(regionId, event, data) {
    if (this.io) {
      this.io.to(`region:${regionId}`).emit(event, data);
    }
  }

  joinRoom(socket, room) {
    socket.join(room);
  }

  leaveRoom(socket, room) {
    socket.leave(room);
  }

  setupSocketHandlers(socket) {
    socket.on('subscribe:region', (regionId) => {
      this.joinRoom(socket, `region:${regionId}`);
      socket.emit('subscribed', { region: regionId });
    });

    socket.on('unsubscribe:region', (regionId) => {
      this.leaveRoom(socket, `region:${regionId}`);
    });

    socket.on('subscribe:meter', (meterId) => {
      this.joinRoom(socket, `meter:${meterId}`);
      socket.emit('subscribed', { meter: meterId });
    });

    socket.on('authenticate', (token) => {
      try {
        const AuthService = require('./auth.service');
        const auth = require('./auth.service');
        const decoded = auth.verifyToken(token);
        socket.userId = decoded.id;
        socket.role = decoded.role;
        socket.join(`user:${decoded.id}`);
        socket.emit('authenticated', { userId: decoded.id });
      } catch (err) {
        socket.emit('auth_error', { message: 'Invalid token' });
      }
    });
  }
}

module.exports = new WebSocketService();

function setupWebSocket(io) {
  const wsService = new WebSocketService();
  wsService.init(io);
  
  io.on('connection', (socket) => {
    wsService.setupSocketHandlers(socket);
    socket.emit('connected', { timestamp: new Date() });
  });
}

module.exports = { ...module.exports, setupWebSocket };