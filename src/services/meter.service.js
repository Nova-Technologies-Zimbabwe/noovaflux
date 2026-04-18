const { v4: uuidv4 } = require('uuid');

const mockMeters = [
  { id: uuidv4(), serialNumber: 'MTR-001', meterNumber: 'HM001', regionId: '1', userId: '1', meterType: 'smart', manufacturer: 'Kamstrup', model: 'OMNIPOWER', status: 'active', balance: 45.20, tariff: 'standard', latitude: -17.825, longitude: 31.033 },
  { id: uuidv4(), serialNumber: 'MTR-002', meterNumber: 'BM002', regionId: '2', userId: '2', meterType: 'prepaid', manufacturer: 'Landis+Gyr', model: 'E650', status: 'active', balance: 12.50, tariff: 'standard', latitude: -20.17, longitude: 28.58 },
  { id: uuidv4(), serialNumber: 'MTR-003', meterNumber: 'HM003', regionId: '1', userId: '3', meterType: 'smart', manufacturer: 'Itron', model: 'ACE6000', status: 'disconnected', balance: 0, tariff: 'standard', latitude: -17.86, longitude: 31.02 },
  { id: uuidv4(), serialNumber: 'MTR-004', meterNumber: 'GM004', regionId: '4', userId: '4', meterType: 'postpaid', manufacturer: 'Elster', model: 'A1800', status: 'active', balance: -45.30, tariff: 'standard', latitude: -19.45, longitude: 29.82 },
  { id: uuidv4(), serialNumber: 'MTR-005', meterNumber: 'MM005', regionId: '3', userId: '5', meterType: 'prepaid', manufacturer: 'Kamstrup', model: 'OMNIPOWER', status: 'active', balance: 8.90, tariff: 'standard', latitude: -18.97, longitude: 32.67 },
  { id: uuidv4(), serialNumber: 'MTR-006', meterNumber: 'KM006', regionId: '6', userId: '6', meterType: 'smart', manufacturer: 'Itron', model: 'ACE6000', status: 'tampered', balance: 23.40, tariff: 'standard', latitude: -18.93, longitude: 29.82 },
  { id: uuidv4(), serialNumber: 'MTR-007', meterNumber: 'CM007', regionId: '5', userId: '7', meterType: 'prepaid', manufacturer: 'Landis+Gyr', model: 'E650', status: 'active', balance: 15.00, tariff: 'standard', latitude: -17.15, longitude: 30.45 },
  { id: uuidv4(), serialNumber: 'MTR-008', meterNumber: 'BM008', regionId: '2', userId: '8', meterType: 'postpaid', manufacturer: 'Elster', model: 'A1800', status: 'active', balance: 120.50, tariff: 'standard', latitude: -20.25, longitude: 28.65 },
];

const mockUsers = [
  { id: '1', email: 'admin@novaflux.com', firstName: 'Demo', lastName: 'Admin', role: 'admin', regionId: '1' },
  { id: '2', email: 'operator@novaflux.com', firstName: 'John', lastName: 'Moyo', role: 'operator', regionId: '1' },
  { id: '3', email: 'engineer@novaflux.com', firstName: 'Sarah', lastName: 'Ndlovu', role: 'engineer', regionId: '2' },
];

class MeterService {
  constructor() {}

  async createMeter(data) {
    const meter = { id: uuidv4(), ...data, serialNumber: data.serialNumber || `MTR-${uuidv4().slice(0, 8).toUpperCase()}` };
    mockMeters.push(meter);
    return meter;
  }

  async getMeter(meterId) {
    return mockMeters.find(m => m.id === meterId) || null;
  }

  async getMeters(filters = {}, pagination = { limit: 50, offset: 0 }) {
    let filtered = [...mockMeters];
    if (filters.regionId) filtered = filtered.filter(m => m.regionId === filters.regionId);
    if (filters.status) filtered = filtered.filter(m => m.status === filters.status);
    if (filters.meterType) filtered = filtered.filter(m => m.meterType === filters.meterType);
    
    const total = filtered.length;
    const paginated = filtered.slice(pagination.offset, pagination.offset + pagination.limit);
    
    return { rows: paginated, count: total };
  }

  async processReading(meterId, readingData) {
    return { id: uuidv4(), meterId, ...readingData, timestamp: new Date() };
  }

  async getLiveReadings(meterId, limit = 10) {
    return Array.from({ length: limit }, (_, i) => ({
      id: uuidv4(),
      meterId,
      activeEnergy: 100 + Math.random() * 50,
      voltage: 220 + Math.random() * 20,
      current: 5 + Math.random() * 10,
      powerFactor: 0.85 + Math.random() * 0.1,
      timestamp: new Date(Date.now() - i * 3600000),
    }));
  }

  async getMeterConsumption(meterId, startDate, endDate) {
    return this.getLiveReadings(meterId, 20);
  }

  async getMeterStats(meterId) {
    return {
      meterId,
      avgPower: 125.5,
      maxPower: 245.2,
      avgVoltage: 228.5,
      avgCurrent: 12.3,
      totalReadings: 100,
      lastReading: new Date(),
    };
  }

  async remoteDisconnect(meterId) {
    const meter = mockMeters.find(m => m.id === meterId);
    if (meter) meter.status = 'disconnected';
    return meter;
  }

  async remoteReconnect(meterId) {
    const meter = mockMeters.find(m => m.id === meterId);
    if (meter) meter.status = 'active';
    return meter;
  }

  async updateMeterTariff(meterId, tariff) {
    const meter = mockMeters.find(m => m.id === meterId);
    if (meter) meter.tariff = tariff;
    return meter;
  }

  getMockUsers() {
    return mockUsers;
  }
}

module.exports = new MeterService();