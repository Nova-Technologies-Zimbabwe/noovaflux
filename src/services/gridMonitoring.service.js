const RedisClient = require('./redis.service');
const { db } = require('../models');

class GridMonitoringService {
  constructor() {
    this.cache = RedisClient;
    this.gridState = new Map();
  }

  async getGridStatus() {
    const cached = await this.cache.get('grid:status');
    if (cached) return JSON.parse(cached);

    const [regions, substations, transformers, meters, alerts] = await Promise.all([
      db.Region.findAll({ where: { status: 'active' } }),
      db.Substation.findAll({ where: { status: 'active' } }),
      db.Transformer.findAll({ where: { status: 'active' } }),
      db.Meter.findAll({ where: { status: 'active' } }),
      db.Alert.findAll({ where: { status: { [db.Sequelize.Op.ne]: 'resolved' } } }),
    ]);

    const status = {
      totalRegions: regions.length,
      totalSubstations: substations.length,
      totalTransformers: transformers.length,
      totalMeters: meters.length,
      activeAlerts: alerts.length,
      systemLoad: await this.calculateSystemLoad(),
      timestamp: new Date().toISOString(),
    };

    await this.cache.set('grid:status', JSON.stringify(status), 60);
    return status;
  }

  async calculateSystemLoad() {
    const recentReadings = await db.Reading.findAll({
      where: {
        timestamp: { [db.Sequelize.Op.gte]: new Date(Date.now() - 15 * 60 * 1000) },
      },
      attributes: ['power'],
      limit: 1000,
    });

    if (!recentReadings.length) return 0;
    const avgPower = recentReadings.reduce((sum, r) => sum + parseFloat(r.power || 0), 0) / recentReadings.length;
    return Math.round(avgPower);
  }

  async getRegionStatus(regionId) {
    const region = await db.Region.findByPk(regionId, {
      include: [
        { model: db.Substation, as: 'substations' },
        { model: db.Transformer, as: 'transformers' },
        { model: db.Meter, as: 'meters' },
      ],
    });
    return region;
  }

  async getSubstationStatus(substationId) {
    const substation = await db.Substation.findByPk(substationId, {
      include: [
        { model: db.Transformer, as: 'transformers' },
        { model: db.Region, as: 'region' },
      ],
    });
    return substation;
  }

  async getTransformerStatus(transformerId) {
    const transformer = await db.Transformer.findByPk(transformerId, {
      include: [
        { model: db.Meter, as: 'meters' },
        { model: db.Region, as: 'region' },
      ],
    });
    return transformer;
  }

  async getMeterStatus(meterId) {
    const meter = await db.Meter.findByPk(meterId, {
      include: [
        { model: db.Reading, as: 'readings', limit: 10, order: [['timestamp', 'DESC']] },
        { model: db.Region, as: 'region' },
        { model: db.Transformer, as: 'transformer' },
      ],
    });
    return meter;
  }

  async getLiveReadings(meterId, limit = 10) {
    return db.Reading.findAll({
      where: { meterId },
      order: [['timestamp', 'DESC']],
      limit,
    });
  }

  async getAggregatedReadings(regionId, interval = 'hour', startDate, endDate) {
    const { Op } = db.Sequelize;
    const regionFilter = regionId ? { regionId } : {};

    const readings = await db.Reading.findAll({
      where: {
        timestamp: { [Op.between]: [startDate, endDate] },
      },
      include: [{
        model: db.Meter,
        as: 'meter',
        where: regionFilter,
        attributes: ['regionId'],
      }],
      attributes: [
        [db.Sequelize.fn('date_trunc', interval, db.Sequelize.col('timestamp')), 'period'],
        [db.Sequelize.fn('avg', db.Sequelize.col('power')), 'avgPower'],
        [db.Sequelize.fn('avg', db.Sequelize.col('voltage')), 'avgVoltage'],
        [db.Sequelize.fn('avg', db.Sequelize.col('current')), 'avgCurrent'],
        [db.Sequelize.fn('sum', db.Sequelize.col('activeEnergy')), 'totalEnergy'],
      ],
      group: ['period'],
      order: [['period', 'ASC']],
      raw: true,
    });

    return readings;
  }

  async updateGridState(entityType, entityId, state) {
    const key = `${entityType}:${entityId}`;
    this.gridState.set(key, { ...state, updatedAt: new Date() });
    await this.cache.publish('grid:state:update', { entityType, entityId, state });
    return this.gridState.get(key);
  }

  subscribeToGridUpdates(callback) {
    return this.cache.subscribe('grid:state:update', callback);
  }
}

module.exports = new GridMonitoringService();