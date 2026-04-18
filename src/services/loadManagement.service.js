const RedisClient = require('./redis.service');
const { db } = require('../models');

class LoadManagementService {
  constructor() {
    this.cache = RedisClient;
    this.loadShedStages = {
      1: { name: 'Stage 1 - Voluntary', targetReduction: 0.05 },
      2: { name: 'Stage 2 - Rotational', targetReduction: 0.10 },
      3: { name: 'Stage 3 - Scheduled', targetReduction: 0.20 },
      4: { name: 'Stage 4 - Emergency', targetReduction: 0.30 },
      5: { name: 'Stage 5 - Critical', targetReduction: 0.50 },
    };
  }

  async assessGridLoad() {
    const [totalCapacity, currentLoad, renewables] = await Promise.all([
      this.getTotalCapacity(),
      this.getCurrentLoad(),
      this.getRenewableOutput(),
    ]);

    const netLoad = currentLoad - renewables;
    const utilizationPercent = (netLoad / totalCapacity) * 100;

    return {
      totalCapacity,
      currentLoad,
      renewableOutput: renewables,
      netLoad,
      utilizationPercent: Math.round(utilizationPercent * 10) / 10,
      status: this.getLoadStatus(utilizationPercent),
    };
  }

  getLoadStatus(utilization) {
    if (utilization >= 95) return 'critical';
    if (utilization >= 85) return 'high';
    if (utilization >= 70) return 'normal';
    return 'low';
  }

  async getTotalCapacity() {
    const transformers = await db.Transformer.findAll({ where: { status: 'active' } });
    return transformers.reduce((sum, t) => sum + (t.capacity || 0), 0);
  }

  async getCurrentLoad() {
    const recentReadings = await db.Reading.findAll({
      where: { timestamp: { [db.Sequelize.Op.gte]: new Date(Date.now() - 15 * 60 * 1000) } },
      attributes: ['power'],
      limit: 1000,
    });
    return recentReadings.reduce((sum, r) => sum + parseFloat(r.power || 0), 0);
  }

  async getRenewableOutput() {
    const sources = await db.RenewableSource.findAll({ where: { status: 'active' } });
    return sources.reduce((sum, s) => sum + (s.currentOutput || 0), 0);
  }

  async initiateLoadShedding(stage, regionId = null, reason = '') {
    const stageConfig = this.loadShedStages[stage];
    if (!stageConfig) throw new Error('Invalid stage');

    const targetReduction = stageConfig.targetReduction;
    const affectedMeters = await this.getMetersForLoadShedding(regionId, stage);

    const event = await db.LoadShedEvent.create({
      name: stageConfig.name,
      stage,
      regionId,
      startTime: new Date(),
      targetLoadReduction: targetReduction * 100,
      status: 'active',
      reason,
    });

    await this.disconnectMeters(affectedMeters, stage);

    await this.cache.set('loadshedding:current', JSON.stringify({
      stage,
      eventId: event.id,
      startTime: new Date().toISOString(),
    }), 3600);

    return { event, affectedMeters: affectedMeters.length };
  }

  async getMetersForLoadShedding(regionId, stage) {
    const priorityOrder = ['industrial', 'commercial', 'residential', 'critical'];
    const excludePriority = priorityOrder.slice(0, stage);
    
    return db.Meter.findAll({
      where: {
        status: 'active',
        ...(regionId ? { regionId } : {}),
        ...(excludePriority.length ? {} : {}),
      },
      include: [{ model: db.User, as: 'user', attributes: ['role'] }],
      limit: Math.min(1000, stage * 200),
    });
  }

  async disconnectMeters(meters, stage) {
    const results = [];
    for (const meter of meters) {
      try {
        await meter.update({ status: 'disconnected' });
        results.push({ meterId: meter.id, success: true });
      } catch (err) {
        results.push({ meterId: meter.id, success: false, error: err.message });
      }
    }
    return results;
  }

  async endLoadShedding(eventId) {
    const event = await db.LoadShedEvent.findByPk(eventId);
    if (!event) throw new Error('Event not found');

    await event.update({
      endTime: new Date(),
      status: 'completed',
    });

    await this.cache.del('loadshedding:current');
    await this.reconnectDisconnectedMeters();

    return event;
  }

  async reconnectDisconnectedMeters() {
    return db.Meter.update(
      { status: 'active' },
      { where: { status: 'disconnected' } }
    );
  }

  async getLoadShedStatus() {
    const current = await this.cache.get('loadshedding:current');
    if (!current) return { active: false };
    return JSON.parse(current);
  }

  async getPriorityCustomers() {
    return db.User.findAll({
      where: { role: 'consumer' },
      include: [{
        model: db.Meter,
        as: 'meters',
        where: { status: 'active' },
      }],
    }).then(users => users.filter(u => u.meters?.some(m => m.metadata?.priority === 'critical')));
  }

  async reroutePower(fromRegionId, toRegionId, amount) {
    return { fromRegionId, toRegionId, amount, status: 'rerouted' };
  }
}

module.exports = new LoadManagementService();