import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brain, TrendingUp, MapPin, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { forecast as forecastApi, regions } from '../services/api';
import clsx from 'clsx';

export default function ForecastPage() {
  const [selectedRegion, setSelectedRegion] = useState('1');
  const [horizon, setHorizon] = useState(24);

  const { data: regionsData } = useQuery({
    queryKey: ['regions'],
    queryFn: regions.list,
  });

  const { data: forecastData, isLoading } = useQuery({
    queryKey: ['forecast', selectedRegion, horizon],
    queryFn: () => forecastApi.demand(selectedRegion, horizon),
  });

  const { data: peakData } = useQuery({
    queryKey: ['peak', selectedRegion],
    queryFn: () => forecastApi.peak(selectedRegion),
  });

  const chartData = forecastData?.forecasts?.map(f => ({
    hour: new Date(f.timestamp).getHours() + ':00',
    predicted: f.predicted,
    confidence: f.confidence,
  })) || [];

  const regionList = regionsData || [];
  const accuracyMetrics = { hourly: '94.2%', daily: '91.8%', weekly: '88.5%' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Demand Forecast</h1>
          <p className="text-slate-500 dark:text-slate-400">Predictive analytics and demand planning</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
          <Settings size={16} />
          Configure
        </button>
      </div>

      {peakData && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-sm text-slate-500">Predicted Peak</p>
            <p className="text-2xl font-bold text-white">{peakData.predictedPeak} MW</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-sm text-slate-500">Grid Capacity</p>
            <p className="text-2xl font-bold text-white">{peakData.gridCapacity} MW</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-sm text-slate-500">Utilization</p>
            <p className="text-2xl font-bold text-cyan-400">{peakData.utilizationPercent}%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-sm text-slate-500">Risk Status</p>
            <p className={clsx('text-2xl font-bold', peakData.atRisk ? 'text-red-400' : 'text-green-400')}>
              {peakData.atRisk ? 'High' : 'Normal'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-cyan-400" />
                Demand Forecast
              </h3>
              <div className="flex items-center gap-4">
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white"
                >
                  {regionList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <div className="flex gap-2">
                  {['12h', '24h', '72h'].map(h => (
                    <button
                      key={h}
                      onClick={() => setHorizon(parseInt(h))}
                      className={clsx('px-3 py-1 text-xs rounded-full', horizon === parseInt(h) ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400')}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="h-72">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-500">Loading...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} width={50} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="predicted" stroke="#06b6d4" fill="url(#demandGrad)" strokeWidth={2} name="Predicted Load (MW)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Brain size={16} className="text-cyan-400" />
              Model Accuracy
            </h3>
            <div className="space-y-4">
              {Object.entries(accuracyMetrics).map(([horizon, accuracy]) => (
                <div key={horizon} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400 capitalize">{horizon}</span>
                  <span className="text-lg font-bold text-cyan-400">{accuracy}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10">
              Retrain Model
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}