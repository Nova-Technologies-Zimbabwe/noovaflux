const express = require('express');
const router = express.Router();
const ForecastingService = require('../services/forecasting.service');

router.get('/demand/:regionId', async (req, res) => {
  try {
    const { horizon = 24 } = req.query;
    const forecast = await ForecastingService.forecastDemand(req.params.regionId, parseInt(horizon));
    res.json(forecast);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/peak/:regionId', async (req, res) => {
  try {
    const prediction = await ForecastingService.predictPeakLoad(req.params.regionId);
    res.json(prediction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/distribution', async (req, res) => {
  try {
    const distribution = await ForecastingService.suggestLoadDistribution();
    res.json(distribution);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;