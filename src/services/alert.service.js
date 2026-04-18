const { v4: uuidv4 } = require('uuid');

const mockAlerts = [
  { id: '1', type: 'theft', severity: 'critical', entityType: 'transformer', entityId: 't4', title: 'Energy Theft Detected', description: '42% power loss detected at transformer TRF-004', location: 'Bulawayo East', status: 'new', createdAt: new Date(Date.now() - 2 * 60000) },
  { id: '2', type: 'overload', severity: 'high', entityType: 'transformer', entityId: 't5', title: 'Transformer Overload', description: 'Load exceeded 85% capacity', location: 'Bulawayo Central', status: 'new', createdAt: new Date(Date.now() - 5 * 60000) },
  { id: '3', type: 'tamper', severity: 'medium', entityType: 'meter', entityId: '6', title: 'Meter Tamper Alert', description: 'Tamper detection sensor triggered', location: 'Kwekwe Zone 4', status: 'acknowledged', createdAt: new Date(Date.now() - 12 * 60000) },
  { id: '4', type: 'voltage', severity: 'low', entityType: 'substation', entityId: 's2', title: 'Voltage Fluctuation', description: 'Voltage variance > 5% detected', location: 'Harare South', status: 'investigating', createdAt: new Date(Date.now() - 25 * 60000) },
  { id: '5', type: 'fault', severity: 'critical', entityType: 'substation', entityId: 's6', title: 'Line Fault Detected', description: 'Feeder 3 fault detected', location: 'Masvingo', status: 'new', createdAt: new Date(Date.now() - 60 * 60000) },
  { id: '6', type: 'outage', severity: 'high', entityType: 'substation', entityId: 's6', title: 'Power Outage', description: 'Scheduled outage in progress', location: 'Masvingo', status: 'resolved', createdAt: new Date(Date.now() - 180 * 60000) },
];

class AlertService {
  constructor() {}

  async getAlerts(filters = {}) {
    let filtered = [...mockAlerts];
    if (filters.status && filters.status !== 'all') filtered = filtered.filter(a => a.status === filters.status);
    if (filters.type) filtered = filtered.filter(a => a.type === filters.type);
    if (filters.severity) filtered = filtered.filter(a => a.severity === filters.severity);
    return filtered;
  }

  async acknowledgeAlert(id) {
    const alert = mockAlerts.find(a => a.id === id);
    if (alert) alert.status = 'acknowledged';
    return alert;
  }

  async resolveAlert(id) {
    const alert = mockAlerts.find(a => a.id === id);
    if (alert) { alert.status = 'resolved'; alert.resolvedAt = new Date(); }
    return alert;
  }

  async createAlert(data) {
    const alert = { id: uuidv4(), ...data, createdAt: new Date() };
    mockAlerts.unshift(alert);
    return alert;
  }
}

module.exports = new AlertService();