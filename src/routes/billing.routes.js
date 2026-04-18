const express = require('express');
const router = express.Router();
const BillingService = require('../services/billing.service');

router.post('/generate', async (req, res) => {
  try {
    const { meterId, billingPeriod } = req.body;
    const billing = await BillingService.generateBilling(meterId, billingPeriod);
    res.json(billing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/meter/:meterId', async (req, res) => {
  try {
    const { status } = req.query;
    const billings = await BillingService.getBillings(req.params.meterId, status);
    res.json(billings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:billingId/pay', async (req, res) => {
  try {
    const { amount } = req.body;
    const billing = await BillingService.processPayment(req.params.billingId, amount);
    if (!billing) return res.status(404).json({ error: 'Billing not found' });
    res.json(billing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/usage/:meterId', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const billing = await BillingService.calculateTimeOfUseBilling(req.params.meterId, startDate, endDate);
    res.json(billing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/revenue', async (req, res) => {
  try {
    const { regionId, startDate, endDate } = req.query;
    const report = await BillingService.getRevenueReport(regionId, startDate, endDate);
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;