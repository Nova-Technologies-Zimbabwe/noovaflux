import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function PredictionsWidget({ data }) {
  const [view, setView] = useState('24h');

  const chartData = data?.forecasts?.map(f => ({
    hour: new Date(f.timestamp).getHours() + ':00',
    predicted: f.predicted,
    confidence: f.confidence,
  })) || [];

  const peakTimes = [
    { time: '07:00 - 09:00', load: 'High', risk: 'Medium' },
    { time: '12:00 - 14:00', load: 'Medium', risk: 'Low' },
    { time: '18:00 - 21:00', load: 'High', risk: 'High' },
  ];

  const summary = data?.summary || { peakDemand: 1680, minDemand: 850, avgDemand: 1200 };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <TrendingUp size={18} className="text-cyan-400" />
          AI Demand Forecast
        </h3>
        <div className="flex gap-2">
          {['6h', '12h', '24h'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={clsx(
                'px-3 py-1 text-xs rounded-full transition-colors',
                view === v ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip 
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="predicted" stroke="#06b6d4" fill="url(#predGradient)" strokeWidth={2} name="Predicted Load" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            Loading forecast data...
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800">
        <div className="text-center">
          <p className="text-xs text-slate-500">Peak Expected</p>
          <p className="text-lg font-bold text-white">{summary.peakDemand} MW</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Min Demand</p>
          <p className="text-lg font-bold text-white">{summary.minDemand} MW</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500">Avg Demand</p>
          <p className="text-lg font-bold text-white">{summary.avgDemand} MW</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
          <Clock size={12} /> Peak Times Today
        </p>
        <div className="flex gap-2">
          {peakTimes.map((peak) => (
            <div key={peak.time} className="flex-1 p-2 rounded-lg bg-slate-800/50 text-center">
              <p className="text-xs text-slate-400">{peak.time}</p>
              <p className={clsx('text-xs font-medium', peak.risk === 'High' ? 'text-orange-400' : 'text-green-400')}>
                {peak.risk} Risk
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}