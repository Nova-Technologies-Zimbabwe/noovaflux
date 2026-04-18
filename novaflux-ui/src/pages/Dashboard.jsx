import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw, Zap, Activity, TrendingUp, ZapOff, Sun, Battery, AlertTriangle, MapPin } from 'lucide-react';
import GridMap from '../components/dashboard/GridMap';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import PredictionsWidget from '../components/dashboard/PredictionsWidget';
import RevenueWidget from '../components/dashboard/RevenueWidget';
import { grid, alerts as alertsApi, forecast } from '../services/api';
import clsx from 'clsx';

const metrics = [
  { label: 'Current Load', key: 'systemLoad', unit: 'MW', icon: Zap, color: 'cyan' },
  { label: 'Total Meters', key: 'totalMeters', unit: '', icon: Activity, color: 'green' },
  { label: 'Active Alerts', key: 'activeAlerts', unit: '', icon: AlertTriangle, color: 'orange' },
  { label: 'Substations', key: 'totalSubstations', unit: '', icon: Activity, color: 'blue' },
  { label: 'Regions', key: 'totalRegions', unit: '', icon: Map, color: 'purple' },
];

const colorClasses = {
  cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
  green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
  orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
  purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
};

export default function Dashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const { data: gridStatus, isLoading: gridLoading, refetch: refetchGrid } = useQuery({
    queryKey: ['gridStatus'],
    queryFn: grid.status,
    refetchInterval: 30000,
  });

  const { data: alertsList, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts', 'new'],
    queryFn: () => alertsApi.list({ status: 'new' }),
    refetchInterval: 15000,
  });

  const { data: forecastData } = useQuery({
    queryKey: ['forecast', '1', 24],
    queryFn: () => forecast.demand('1', 24),
    refetchInterval: 60000,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchGrid();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const status = gridStatus || { systemLoad: 1450, totalMeters: 247, activeAlerts: 8, totalSubstations: 6, totalRegions: 6 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Grid Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Real-time monitoring of the national power grid</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {gridLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800/50 animate-pulse">
              <div className="h-8 w-8 bg-slate-700 rounded-lg mb-2"></div>
              <div className="h-6 bg-slate-700 rounded w-16 mb-1"></div>
              <div className="h-3 bg-slate-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {metrics.map((metric) => (
            <div
              key={metric.key}
              className={clsx(
                'p-4 rounded-xl border backdrop-blur-sm bg-gradient-to-br',
                colorClasses[metric.color]
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <metric.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-white">
                {metric.key === 'systemLoad' ? status[metric.key]?.toLocaleString() : status[metric.key]}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {metric.label} {metric.unit && <span className="text-slate-500">{metric.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 h-full p-4">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Live Grid Map
            </h3>
            <GridMap />
          </div>
        </div>
        
        <div className="h-96">
          <AlertsPanel alerts={alertsList} loading={alertsLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictionsWidget data={forecastData} />
        <RevenueWidget />
      </div>
    </div>
  );
}