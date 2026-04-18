const express = require('express');
const router = express.Router();
const AlertService = require('../services/alert.service');

router.get('/', async (req, res) => {
  try {
    const { type, severity, status } = req.query;
    const alerts = await AlertService.getAlerts({ type, severity, status });
    res.json(alerts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:alertId/acknowledge', async (req, res) => {
  try {
    const alert = await AlertService.acknowledgeAlert(req.params.alertId);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:alertId/resolve', async (req, res) => {
  try {
    const alert = await AlertService.resolveAlert(req.params.alertId);
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;