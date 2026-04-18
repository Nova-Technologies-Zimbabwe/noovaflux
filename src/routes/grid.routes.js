const express = require('express');
const router = express.Router();
const GridService = require('../services/grid.service');

router.get('/status', async (req, res) => {
  try {
    const status = await GridService.getGridStatus();
    res.json(status);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/region/:regionId', async (req, res) => {
  try {
    const status = await GridService.getRegionStatus(req.params.regionId);
    res.json(status);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/substation/:substationId', async (req, res) => {
  try {
    const status = await GridService.getSubstationStatus(req.params.substationId);
    if (!status) return res.status(404).json({ error: 'Substation not found' });
    res.json(status);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/transformer/:transformerId', async (req, res) => {
  try {
    const status = await GridService.getTransformerStatus(req.params.transformerId);
    if (!status) return res.status(404).json({ error: 'Transformer not found' });
    res.json(status);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/meter/:meterId', async (req, res) => {
  try {
    const status = await GridService.getMeterStatus(req.params.meterId);
    res.json(status);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/aggregated', async (req, res) => {
  try {
    const { regionId, interval = 'hour', startDate, endDate } = req.query;
    const readings = await GridService.getAggregatedReadings(regionId, interval, new Date(startDate), new Date(endDate));
    res.json(readings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;