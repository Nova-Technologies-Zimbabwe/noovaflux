const express = require('express');
const router = express.Router();
const OutageService = require('../services/outage.service');

router.get('/', async (req, res) => {
  try {
    const { status, regionId, priority } = req.query;
    const outages = await OutageService.getOutages({ status, regionId, priority });
    res.json(outages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { regionId, startDate, endDate } = req.query;
    const stats = await OutageService.getOutageStats(regionId, startDate, endDate);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const outage = await OutageService.reportOutage(req.body);
    res.status(201).json(outage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:outageId/restore', async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const outage = await OutageService.updateOutage(req.params.outageId, { status: 'in_progress', assignedTo });
    if (!outage) return res.status(404).json({ error: 'Outage not found' });
    res.json(outage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:outageId/complete', async (req, res) => {
  try {
    const { resolution } = req.body;
    const outage = await OutageService.updateOutage(req.params.outageId, { status: 'resolved', resolution, endTime: new Date() });
    if (!outage) return res.status(404).json({ error: 'Outage not found' });
    res.json(outage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;