const mockUsers = [
  { id: '1', email: 'admin@novaflux.com', password: 'admin123', firstName: 'Demo', lastName: 'Admin', role: 'admin', regionId: '1' },
  { id: '2', email: 'operator@novaflux.com', password: 'operator123', firstName: 'John', lastName: 'Moyo', role: 'operator', regionId: '1' },
  { id: '3', email: 'engineer@novaflux.com', password: 'engineer123', firstName: 'Sarah', lastName: 'Ndlovu', role: 'engineer', regionId: '2' },
];

const jwt = require('jsonwebtoken');
const config = require('../config');

class AuthService {
  constructor() {}

  async register(data) {
    const existing = mockUsers.find(u => u.email === data.email);
    if (existing) throw new Error('Email already exists');
    
    const user = { id: Date.now().toString(), ...data };
    mockUsers.push(user);
    return this.generateToken(user);
  }

  async login(email, password) {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    return this.generateToken(user);
  }

  generateToken(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    return { token: jwt.sign(payload, config.jwt.secret, { expiresIn: '24h' }) };
  }

  verifyToken(token) {
    return jwt.verify(token, config.jwt.secret);
  }

  async getUser(userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return null;
    const { password, ...userData } = user;
    return userData;
  }

  async getUserByEmail(email) {
    return mockUsers.find(u => u.email === email);
  }
}

module.exports = new AuthService();