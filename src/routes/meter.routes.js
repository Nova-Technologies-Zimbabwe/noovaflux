const express = require('express');
const router = express.Router();
const MeterService = require('../services/meter.service');

router.post('/', async (req, res) => {
  try {
    const meter = await MeterService.createMeter(req.body);
    res.status(201).json(meter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { regionId, status, transformerId, meterType, limit = 50, offset = 0 } = req.query;
    const result = await MeterService.getMeters({ regionId, status, transformerId, meterType }, { limit: parseInt(limit), offset: parseInt(offset) });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:meterId', async (req, res) => {
  try {
    const meter = await MeterService.getMeter(req.params.meterId);
    if (!meter) return res.status(404).json({ error: 'Meter not found' });
    res.json(meter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:meterId/readings', async (req, res) => {
  try {
    const reading = await MeterService.processReading(req.params.meterId, req.body);
    res.status(201).json(reading);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:meterId/readings', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const readings = await MeterService.getLiveReadings(req.params.meterId, parseInt(limit));
    res.json(readings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:meterId/consumption', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const consumption = await MeterService.getMeterConsumption(req.params.meterId, new Date(startDate), new Date(endDate));
    res.json(consumption);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:meterId/stats', async (req, res) => {
  try {
    const stats = await MeterService.getMeterStats(req.params.meterId);
    res.json(stats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:meterId/disconnect', async (req, res) => {
  try {
    const meter = await MeterService.remoteDisconnect(req.params.meterId);
    res.json(meter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:meterId/reconnect', async (req, res) => {
  try {
    const meter = await MeterService.remoteReconnect(req.params.meterId);
    res.json(meter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:meterId/tariff', async (req, res) => {
  try {
    const { tariff } = req.body;
    const meter = await MeterService.updateMeterTariff(req.params.meterId, tariff);
    res.json(meter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;