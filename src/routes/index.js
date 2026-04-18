const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const meterRoutes = require('./meter.routes');
const regionRoutes = require('./region.routes');
const gridRoutes = require('./grid.routes');
const billingRoutes = require('./billing.routes');
const alertRoutes = require('./alert.routes');
const outageRoutes = require('./outage.routes');
const forecastRoutes = require('./forecast.routes');
const renewableRoutes = require('./renewable.routes');

router.use('/auth', authRoutes);
router.use('/meters', meterRoutes);
router.use('/regions', regionRoutes);
router.use('/grid', gridRoutes);
router.use('/billing', billingRoutes);
router.use('/alerts', alertRoutes);
router.use('/outages', outageRoutes);
router.use('/forecast', forecastRoutes);
router.use('/renewables', renewableRoutes);

module.exports = router;