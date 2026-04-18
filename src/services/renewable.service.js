const { db } = require('../models');

class RenewableService {
  constructor() {}

  async getSources(regionId) {
    return db.RenewableSource.findAll({
      where: regionId ? { regionId } : {},
    });
  }

  async getSource(sourceId) {
    return db.RenewableSource.findByPk(sourceId);
  }

  async addSource(data) {
    return db.RenewableSource.create(data);
  }

  async updateOutput(sourceId, output) {
    const source = await db.RenewableSource.findByPk(sourceId);
    if (!source) throw new Error('Source not found');

    await source.update({ currentOutput: output });
    return source;
  }

  async getTotalRenewableOutput() {
    const sources = await db.RenewableSource.findAll({ where: { status: 'active' } });
    return sources.reduce((sum, s) => sum + (s.currentOutput || 0), 0);
  }

  async forecastSolarGeneration(regionId) {
    const sources = await db.RenewableSource.findAll({
      where: { sourceType: 'solar', status: 'active', ...(regionId && { regionId }) },
    });

    const hourly = [];
    const now = new Date();

    for (let i = 0; i < 24; i++) {
      const forecastTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = forecastTime.getHours();
      const isSunny = hour >= 6 && hour <= 18;
      const capacity = sources.reduce((sum, s) => sum + (s.capacity || 0), 0);
      const expectedOutput = isSunny ? capacity * 0.8 : 0;

      hourly.push({ hour, expectedOutput: Math.round(expectedOutput), isSunny });
    }

    return { sources: sources.length, capacity, hourly };
  }

  async optimizeGridMix() {
    const [renewable, thermal, imports] = await Promise.all([
      this.getTotalRenewableOutput(),
      500,
      200,
    ]);

    const total = renewable + thermal + imports;
    return {
      renewable: { output: renewable, percent: Math.round((renewable / total) * 100) },
      thermal: { output: thermal, percent: Math.round((thermal / total) * 100) },
      imports: { output: imports, percent: Math.round((imports / total) * 100) },
    };
  }
}

module.exports = new RenewableService();