const { v4: uuidv4 } = require('uuid');

const mockBillings = [
  { id: '1', meterId: '1', billingPeriod: '2026-04', startDate: '2026-04-01', endDate: '2026-04-30', consumption: 245.6, tariff: 0.12, amount: 29.47, status: 'paid', paidAt: '2026-04-15' },
  { id: '2', meterId: '2', billingPeriod: '2026-04', startDate: '2026-04-01', endDate: '2026-04-30', consumption: 128.3, tariff: 0.12, amount: 15.40, status: 'pending' },
  { id: '3', meterId: '3', billingPeriod: '2026-04', startDate: '2026-04-01', endDate: '2026-04-30', consumption: 412.8, tariff: 0.12, amount: 49.54, status: 'overdue' },
  { id: '4', meterId: '4', billingPeriod: '2026-04', startDate: '2026-04-01', endDate: '2026-04-30', consumption: 892.1, tariff: 0.12, amount: 107.05, status: 'paid', paidAt: '2026-04-10' },
];

class BillingService {
  constructor() {}

  async generateBilling(meterId, billingPeriod) {
    const billing = { id: uuidv4(), meterId, billingPeriod, consumption: Math.random() * 500, tariff: 0.12, amount: Math.random() * 60, status: 'pending' };
    mockBillings.push(billing);
    return billing;
  }

  async getBillings(meterId, status) {
    let filtered = [...mockBillings];
    if (meterId) filtered = filtered.filter(b => b.meterId === meterId);
    if (status) filtered = filtered.filter(b => b.status === status);
    return filtered;
  }

  async processPayment(billingId, amount) {
    const billing = mockBillings.find(b => b.id === billingId);
    if (billing) { billing.status = 'paid'; billing.paidAt = new Date(); }
    return billing;
  }

  async getRevenueReport(regionId, startDate, endDate) {
    return {
      totalRevenue: 4200000,
      totalConsumption: 35000000,
      billCount: 247,
      averageBill: 17006,
      collectionRate: 94.2,
      technicalLosses: 8.3,
      nonTechnicalLosses: 12.1,
    };
  }

  async calculateTimeOfUseBilling(meterId, startDate, endDate) {
    return {
      peakConsumption: 125.5,
      offPeakConsumption: 285.2,
      totalConsumption: 410.7,
      peakAmount: 22.59,
      offPeakAmount: 22.82,
      totalAmount: 45.41,
    };
  }
}

module.exports = new BillingService();