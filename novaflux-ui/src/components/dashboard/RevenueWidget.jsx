import { DollarSign, TrendingDown, Wallet, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const revenueData = [
  { label: 'Total Revenue (MTD)', value: '$4.2M', change: '+8.2%', positive: true },
  { label: 'Collection Rate', value: '94.2%', change: '+1.5%', positive: true },
  { label: 'Technical Losses', value: '8.3%', change: '-0.5%', positive: true },
  { label: 'Non-Technical Losses', value: '12.1%', change: '+2.1%', positive: false },
];

const topLossAreas = [
  { region: 'Harare North', loss: '15.2%', meters: 234 },
  { region: 'Bulawayo East', loss: '12.8%', meters: 156 },
  { region: 'Mutare West', loss: '11.4%', meters: 89 },
];

export default function RevenueWidget() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <DollarSign size={18} className="text-emerald-400" />
          Revenue & Losses
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {revenueData.map((item) => (
          <div key={item.label} className="p-3 rounded-lg bg-slate-800/50">
            <p className="text-xs text-slate-500">{item.label}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-lg font-bold text-white">{item.value}</p>
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded',
                item.positive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              )}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
          <AlertTriangle size={12} className="text-orange-400" />
          High Loss Areas
        </p>
        <div className="space-y-2">
          {topLossAreas.map((area) => (
            <div key={area.region} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
              <div>
                <p className="text-sm text-white">{area.region}</p>
                <p className="text-xs text-slate-500">{area.meters} meters monitored</p>
              </div>
              <span className="text-sm font-medium text-orange-400">{area.loss}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}