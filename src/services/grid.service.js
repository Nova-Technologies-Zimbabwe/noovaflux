const { v4: uuidv4 } = require('uuid');

const mockSubstations = [
  { id: 's1', name: 'Harare North', code: 'HRN', regionId: '1', voltageLevel: '110kV', capacity: 150, latitude: -17.79, lng: 31.05, status: 'active' },
  { id: 's2', name: 'Harare South', code: 'HRS', regionId: '1', voltageLevel: '66kV', capacity: 100, latitude: -17.86, lng: 31.02, status: 'warning' },
  { id: 's3', name: 'Bulawayo Central', code: 'BYC', regionId: '2', voltageLevel: '110kV', capacity: 200, latitude: -20.15, lng: 28.58, status: 'critical' },
  { id: 's4', name: 'Mutare', code: 'MUT', regionId: '3', voltageLevel: '33kV', capacity: 60, latitude: -18.97, lng: 32.67, status: 'active' },
  { id: 's5', name: 'Gweru', code: 'GWE', regionId: '4', voltageLevel: '66kV', capacity: 80, latitude: -19.45, lng: 29.82, status: 'active' },
  { id: 's6', name: 'Masvingo', code: 'MAS', regionId: '5', voltageLevel: '33kV', capacity: 40, latitude: -20.07, lng: 30.97, status: 'fault' },
];

const mockTransformers = [
  { id: 't1', serialNumber: 'TRF-001', substationId: 's1', regionId: '1', type: 'distribution', capacity: 25, status: 'active' },
  { id: 't2', serialNumber: 'TRF-002', substationId: 's1', regionId: '1', type: 'distribution', capacity: 25, status: 'active' },
  { id: 't3', serialNumber: 'TRF-003', substationId: 's2', regionId: '1', type: 'distribution', capacity: 15, status: 'active' },
  { id: 't4', serialNumber: 'TRF-004', substationId: 's3', regionId: '2', type: 'distribution', capacity: 40, status: 'active' },
  { id: 't5', serialNumber: 'TRF-005', substationId: 's3', regionId: '2', type: 'distribution', capacity: 40, status: 'warning' },
  { id: 't6', serialNumber: 'TRF-006', substationId: 's4', regionId: '3', type: 'distribution', capacity: 15, status: 'active' },
];

class GridService {
  constructor() {}

  async getGridStatus() {
    return {
      totalRegions: 6,
      totalSubstations: 6,
      totalTransformers: 6,
      totalMeters: 247,
      activeAlerts: 8,
      systemLoad: 1450,
      timestamp: new Date().toISOString(),
    };
  }

  async getRegionStatus(regionId) {
    return mockSubstations.filter(s => s.regionId === regionId);
  }

  async getSubstationStatus(substationId) {
    return mockSubstations.find(s => s.id === substationId) || null;
  }

  async getTransformerStatus(transformerId) {
    return mockTransformers.find(t => t.id === transformerId) || null;
  }

  async getMeterStatus(meterId) {
    return { id: meterId, status: 'active', lastReading: { power: 125, voltage: 230 } };
  }

  async getAggregatedReadings(regionId, interval, startDate, endDate) {
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        period: `${i}:00`,
        avgPower: 1000 + Math.random() * 400,
        avgVoltage: 225 + Math.random() * 10,
        totalEnergy: 5000 + Math.random() * 2000,
      });
    }
    return data;
  }

  async updateGridState(entityType, entityId, state) {
    return { entityType, entityId, ...state, updatedAt: new Date() };
  }
}

module.exports = new GridService();