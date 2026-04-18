const regions = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Masvingo', 'Kwekwe'];

class ForecastingService {
  constructor() {}

  async forecastDemand(regionId, horizon = 24) {
    const hourlyData = [];
    const now = new Date();
    
    for (let i = 0; i < horizon; i++) {
      const time = new Date(now.getTime() + i * 3600000);
      const hour = time.getHours();
      const baseLoad = 1200;
      const peakFactor = (hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 21) ? 1.4 : 1;
      const variation = Math.random() * 200 - 100;
      
      hourlyData.push({
        timestamp: time.toISOString(),
        predicted: Math.round(baseLoad * peakFactor + variation),
        confidence: 95 - (i * 2),
        hourlyPattern: baseLoad * peakFactor,
        seasonal: 1.1,
        weather: 1.0,
        weekend: false,
      });
    }

    return {
      regionId: regionId || 'all',
      horizon,
      generatedAt: new Date().toISOString(),
      forecasts: hourlyData,
      summary: {
        peakDemand: Math.max(...hourlyData.map(h => h.predicted)),
        minDemand: Math.min(...hourlyData.map(h => h.predicted)),
        avgDemand: Math.round(hourlyData.reduce((sum, h) => sum + h.predicted, 0) / horizon),
      },
    };
  }

  async predictPeakLoad(regionId) {
    const forecast = await this.forecastDemand(regionId, 24);
    const peak = forecast.summary.peakDemand;
    const capacity = 2100;
    
    return {
      predictedPeak: peak,
      gridCapacity: capacity,
      utilizationPercent: Math.round((peak / capacity) * 100),
      atRisk: peak > capacity * 0.9,
    };
  }

  async suggestLoadDistribution() {
    return regions.map((region, i) => ({
      regionId: (i + 1).toString(),
      regionName: region,
      currentLoad: 800 + Math.floor(Math.random() * 600),
      capacity: 400,
      availableCapacity: Math.floor(Math.random() * 200),
      recommendedLoad: 350 + Math.floor(Math.random() * 50),
    }));
  }
}

module.exports = new ForecastingService();