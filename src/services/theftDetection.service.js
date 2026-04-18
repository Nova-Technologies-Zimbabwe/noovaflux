const { db } = require('../models');
const config = require('../config');

class TheftDetectionService {
  constructor() {
    this.threshold = config.mcp.theftThreshold;
  }

  async analyzeTransformerLoss(transformerId) {
    const transformer = await db.Transformer.findByPk(transformerId, {
      include: [{ model: db.Meter, as: 'meters' }],
    });

    if (!transformer || !transformer.meters?.length) {
      return { error: 'No meters found for transformer' };
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const meterReadings = await Promise.all(
      transformer.meters.map(async (meter) => {
        const readings = await db.Reading.findAll({
          where: {
            meterId: meter.id,
            timestamp: { [db.Sequelize.Op.gte]: oneHourAgo },
          },
          order: [['timestamp', 'DESC']],
          limit: 1,
        });
        return { meterId: meter.id, readings: readings[0] };
      })
    );

    const totalDistributed = meterReadings.reduce((sum, m) => sum + (parseFloat(m.readings?.activeEnergy) || 0), 0);
    const estimatedOutput = transformer.capacity || 1000;

    const lossPercent = Math.abs((estimatedOutput - totalDistributed) / estimatedOutput);

    if (lossPercent > this.threshold) {
      await this.createTheftAlert(transformerId, totalDistributed, estimatedOutput, lossPercent);
    }

    return {
      transformerId,
      totalDistributed: Math.round(totalDistributed * 100) / 100,
      estimatedOutput,
      lossPercent: Math.round(lossPercent * 100) / 100,
      suspicious: lossPercent > this.threshold,
    };
  }

  async analyzeAllTransformers() {
    const transformers = await db.Transformer.findAll({ where: { status: 'active' } });
    const results = [];

    for (const transformer of transformers) {
      const analysis = await this.analyzeTransformerLoss(transformer.id);
      if (analysis.suspicious) {
        results.push(analysis);
      }
    }

    return results;
  }

  async createTheftAlert(entityId, distributed, expected, lossPercent) {
    const existingAlert = await db.Alert.findOne({
      where: {
        entityType: 'transformer',
        entityId,
        status: { [db.Sequelize.Op.ne]: 'resolved' },
      },
    });

    if (existingAlert) {
      existingAlert.metadata = {
        ...existingAlert.metadata,
        updates: [...(existingAlert.metadata?.updates || []), { distributed, expected, lossPercent, time: new Date() }],
      };
      await existingAlert.save();
      return existingAlert;
    }

    return db.Alert.create({
      type: 'theft',
      severity: lossPercent > 0.3 ? 'critical' : 'high',
      entityType: 'transformer',
      entityId,
      title: `Possible Energy Theft Detected - Loss ${Math.round(lossPercent * 100)}%`,
      description: `Transformer output differs from meter readings by ${Math.round(lossPercent * 100)}%. Expected: ${expected}, Distributed: ${distributed}`,
      metadata: { distributed, expected, lossPercent },
    });
  }

  async detectConsumptionAnomaly(meterId) {
    const meter = await db.Meter.findByPk(meterId);
    if (!meter) throw new Error('Meter not found');

    const readings = await db.Reading.findAll({
      where: { meterId },
      order: [['timestamp', 'DESC']],
      limit: 100,
    });

    if (readings.length < 10) return null;

    const recent = readings.slice(0, 10);
    const historical = readings.slice(10);

    const recentAvg = recent.reduce((sum, r) => sum + parseFloat(r.power || 0), 0) / recent.length;
    const historicalAvg = historical.reduce((sum, r) => sum + parseFloat(r.power || 0), 0) / historical.length;

    if (historicalAvg === 0) return null;

    const changePercent = (recentAvg - historicalAvg) / historicalAvg;

    if (Math.abs(changePercent) > 0.5) {
      await db.Alert.create({
        type: 'fraud',
        severity: Math.abs(changePercent) > 0.8 ? 'high' : 'medium',
        entityType: 'meter',
        entityId: meterId,
        title: `Abnormal Consumption Pattern - ${Math.round(Math.abs(changePercent) * 100)}% change`,
        description: `Average power changed from ${historicalAvg.toFixed(2)} to ${recentAvg.toFixed(2)} kW`,
        metadata: { recentAvg, historicalAvg, changePercent },
      });
    }

    return { changePercent: Math.round(changePercent * 100) / 100, suspicious: Math.abs(changePercent) > 0.5 };
  }

  async detectIllegalConnections(regionId) {
    const meters = await db.Meter.findAll({
      where: { regionId, status: 'active' },
      include: [{ model: db.Transformer, as: 'transformer' }],
    });

    const suspicious = [];

    for (const meter of meters) {
      const readings = await db.Reading.findAll({
        where: {
          meterId: meter.id,
          timestamp: { [db.Sequelize.Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      });

      if (readings.length === 0 && meter.status === 'active') {
        suspicious.push({ meterId: meter.id, issue: 'no_readings_24h' });
      }

      const zeroReadings = readings.filter(r => parseFloat(r.activeEnergy) === 0).length;
      if (zeroReadings > 20) {
        suspicious.push({ meterId: meter.id, issue: 'excessive_zero_readings', count: zeroReadings });
      }
    }

    if (suspicious.length > 0) {
      await db.Alert.create({
        type: 'theft',
        severity: 'medium',
        entityType: 'region',
        entityId: regionId,
        title: 'Possible Illegal Connections Detected',
        description: `Found ${suspicious.length} meters with suspicious patterns`,
        metadata: { suspiciousMeters: suspicious },
      });
    }

    return suspicious;
  }

  async getTheftAlerts(status, severity) {
    return db.Alert.findAll({
      where: {
        type: 'theft',
        ...(status && { status }),
        ...(severity && { severity }),
      },
      order: [['createdAt', 'DESC']],
    });
  }
}

module.exports = new TheftDetectionService();