const express = require('express');
const router = express.Router();
const RegionService = require('../services/region.service');

router.get('/', async (req, res) => {
  try {
    const regions = RegionService.getRegions();
    res.json(regions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:regionId', async (req, res) => {
  try {
    const region = RegionService.getRegion(req.params.regionId);
    if (!region) return res.status(404).json({ error: 'Region not found' });
    res.json(region);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const region = RegionService.createRegion(req.body);
    res.status(201).json(region);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;