const { v4: uuidv4 } = require('uuid');

const mockOutages = [
  { id: '1', type: 'unscheduled', cause: 'Line Fault', regionId: '5', regionName: 'Masvingo', startTime: new Date(Date.now() - 2 * 3600000), status: 'in_progress', affectedCustomers: 2450, expectedEndTime: new Date(Date.now() + 2 * 3600000), priority: 'critical' },
  { id: '2', type: 'scheduled', cause: 'Maintenance', regionId: '1', regionName: 'Harare South', startTime: new Date(Date.now() - 1 * 3600000), status: 'in_progress', affectedCustomers: 890, expectedEndTime: new Date(Date.now() + 4 * 3600000), priority: 'medium' },
  { id: '3', type: 'unscheduled', cause: 'Transformer Failure', regionId: '2', regionName: 'Bulawayo East', startTime: new Date(Date.now() - 30 * 60000), status: 'reported', affectedCustomers: 1200, expectedEndTime: null, priority: 'high' },
  { id: '4', type: 'emergency', cause: 'Storm Damage', regionId: '3', regionName: 'Mutare West', startTime: new Date(Date.now() - 15 * 60000), status: 'reported', affectedCustomers: 3400, expectedEndTime: null, priority: 'critical' },
  { id: '5', type: 'scheduled', cause: 'Upgrade Work', regionId: '4', regionName: 'Gweru Central', startTime: new Date(Date.now() - 5 * 3600000), status: 'resolved', affectedCustomers: 650, expectedEndTime: new Date(Date.now() - 3 * 3600000), priority: 'low' },
];

class OutageService {
  constructor() {}

  async getOutages(filters = {}) {
    let filtered = [...mockOutages];
    if (filters.status && filters.status !== 'all') filtered = filtered.filter(o => o.status === filters.status);
    if (filters.regionId) filtered = filtered.filter(o => o.regionId === filters.regionId);
    return filtered;
  }

  async getOutageStats(regionId, startDate, endDate) {
    const active = mockOutages.filter(o => o.status !== 'resolved');
    return {
      total: mockOutages.length,
      active: active.length,
      inProgress: active.filter(o => o.status === 'in_progress').length,
      totalAffected: active.reduce((sum, o) => sum + o.affectedCustomers, 0),
      avgDuration: 145,
    };
  }

  async reportOutage(data) {
    const outage = { id: uuidv4(), ...data, status: 'reported', createdAt: new Date() };
    mockOutages.unshift(outage);
    return outage;
  }

  async updateOutage(id, data) {
    const outage = mockOutages.find(o => o.id === id);
    if (outage) Object.assign(outage, data);
    return outage;
  }
}

module.exports = new OutageService();