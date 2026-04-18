import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { billing as billingApi } from '../services/api';
import clsx from 'clsx';

export default function BillingPage() {
  const [period, setPeriod] = useState('monthly');

  const { data: revenueData } = useQuery({
    queryKey: ['billingRevenue'],
    queryFn: () => billingApi.revenue({}),
  });

  const { data: billingsData } = useQuery({
    queryKey: ['billings'],
    queryFn: () => billingApi.list(),
  });

  const revenue = revenueData || {
    totalRevenue: 4200000,
    totalConsumption: 35000000,
    billCount: 247,
    averageBill: 17006,
    collectionRate: 94.2,
    technicalLosses: 8.3,
    nonTechnicalLosses: 12.1,
  };

  const monthlyData = [
    { month: 'Jan', revenue: 3.2, collected: 3.0 },
    { month: 'Feb', revenue: 3.4, collected: 3.2 },
    { month: 'Mar', revenue: 3.8, collected: 3.5 },
    { month: 'Apr', revenue: 4.0, collected: 3.7 },
    { month: 'May', revenue: 4.2, collected: 4.0 },
    { month: 'Jun', revenue: 4.5, collected: 4.2 },
  ];

  const billingStats = [
    { label: 'Total Revenue', value: `$${(revenue.totalRevenue / 1000000).toFixed(1)}M`, change: '+8.2%', positive: true },
    { label: 'Collected', value: `$${(revenue.totalRevenue * revenue.collectionRate / 1000000).toFixed(1)}M`, change: '+12.4%', positive: true },
    { label: 'Outstanding', value: '$320K', change: '-5.2%', positive: true },
    { label: 'Collection Rate', value: `${revenue.collectionRate}%`, change: '+1.5%', positive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Revenue</h1>
          <p className="text-slate-500 dark:text-slate-400">Financial performance and customer billing</p>
        </div>
        <div className="flex gap-2">
          {['daily', 'weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx(
                'px-4 py-2 text-sm rounded-lg transition-colors',
                period === p 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              )}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {billingStats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <span className={clsx('flex items-center text-sm', stat.positive ? 'text-emerald-400' : 'text-red-400')}>
                {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-400" />
            Revenue Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar dataKey="revenue" name="Billed" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
              <span className="text-sm text-slate-400">Billed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-sm text-slate-400">Collected</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart size={18} className="text-cyan-400" />
            Revenue by Region
          </h3>
          <div className="space-y-3">
            {[
              { region: 'Harare', percent: 42, amount: '$1.76M' },
              { region: 'Bulawayo', percent: 24, amount: '$1.01M' },
              { region: 'Mutare', percent: 15, amount: '$630K' },
              { region: 'Gweru', percent: 12, amount: '$504K' },
              { region: 'Others', percent: 7, amount: '$294K' },
            ].map((item) => (
              <div key={item.region}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-400">{item.region}</span>
                  <span className="text-sm font-medium text-white">{item.amount}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h3 className="font-semibold text-white">Recent Billings</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Period</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Consumption</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {(billingsData || []).slice(0, 5).map((billing) => (
              <tr key={billing.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 text-sm text-white">{billing.billingPeriod}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{billing.consumption?.toFixed(1)} kWh</td>
                <td className="px-4 py-3 text-sm font-medium text-white">${billing.amount?.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={clsx(
                    'px-2 py-1 text-xs rounded-full',
                    billing.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                    billing.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  )}>
                    {billing.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}