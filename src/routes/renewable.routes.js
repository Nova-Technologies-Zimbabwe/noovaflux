const express = require('express');
const router = express.Router();
const RenewableService = require('../services/renewable.service');
const { authMiddleware } = require('../middleware/auth.middleware');

router.get('/', async (req, res) => {
  try {
    const { regionId } = req.query;
    const sources = await RenewableService.getSources(regionId);
    res.json(sources);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:sourceId', async (req, res) => {
  try {
    const source = await RenewableService.getSource(req.params.sourceId);
    if (!source) return res.status(404).json({ error: 'Source not found' });
    res.json(source);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const source = await RenewableService.addSource(req.body);
    res.status(201).json(source);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:sourceId/output', authMiddleware, async (req, res) => {
  try {
    const { output } = req.body;
    const source = await RenewableService.updateOutput(req.params.sourceId, output);
    res.json(source);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/solar/forecast', async (req, res) => {
  try {
    const { regionId } = req.query;
    const forecast = await RenewableService.forecastSolarGeneration(regionId);
    res.json(forecast);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/mix/optimize', async (req, res) => {
  try {
    const mix = await RenewableService.optimizeGridMix();
    res.json(mix);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;