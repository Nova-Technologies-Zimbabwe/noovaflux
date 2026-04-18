import { Zap, Activity, TrendingUp, ZapOff, Sun, Battery } from 'lucide-react';
import clsx from 'clsx';

const metrics = [
  { label: 'Current Load', value: '1,450', unit: 'MW', change: '+5.2%', icon: Zap, color: 'cyan' },
  { label: 'Available Capacity', value: '2,100', unit: 'MW', change: '-2.1%', icon: Activity, color: 'green' },
  { label: 'Peak Demand', value: '1,680', unit: 'MW', change: '+8.4%', icon: TrendingUp, color: 'orange' },
  { label: 'Load Shedding', value: '0', unit: 'Stages', change: 'None', icon: ZapOff, color: 'green' },
  { label: 'Renewable Output', value: '320', unit: 'MW', change: '+12%', icon: Sun, color: 'blue' },
  { label: 'Grid Frequency', value: '50.02', unit: 'Hz', change: 'Stable', icon: Activity, color: 'green' },
];

const colorClasses = {
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
  orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
};

export default function MetricsPanel() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={clsx(
            'p-4 rounded-xl border backdrop-blur-sm bg-gradient-to-br',
            colorClasses[metric.color]
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <metric.icon size={20} />
            <span className={clsx(
              'text-xs px-2 py-0.5 rounded-full',
              metric.change.includes('+') ? 'bg-green-500/20 text-green-400' : 
              metric.change.includes('-') ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'
            )}>
              {metric.change}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{metric.value}</p>
          <p className="text-xs text-slate-400 mt-1">
            {metric.label} <span className="text-slate-500">{metric.unit}</span>
          </p>
        </div>
      ))}
    </div>
  );
}