import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, AlertTriangle, MapPin, User, CheckCircle, Clock, FileText } from 'lucide-react';
import { alerts as alertsApi } from '../services/api';
import clsx from 'clsx';

const severityColors = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400',
  investigating: 'bg-purple-500/20 text-purple-400',
  acknowledged: 'bg-amber-500/20 text-amber-400',
  resolved: 'bg-emerald-500/20 text-emerald-400',
};

const typeLabels = {
  theft: 'Theft',
  overload: 'Overload',
  tamper: 'Tamper',
  voltage: 'Voltage',
  fault: 'Fault',
};

export default function TheftPage() {
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const { data: alertsData } = useQuery({
    queryKey: ['alerts', 'theft', filter],
    queryFn: () => alertsApi.list({ type: 'theft', status: filter === 'all' ? undefined : filter }),
    refetchInterval: 15000,
  });

  const theftAlerts = alertsData?.filter(a => ['theft', 'tamper'].includes(a.type)) || [];
  const criticalCount = theftAlerts.filter(a => a.severity === 'critical' && a.status === 'new').length;
  const investigatingCount = theftAlerts.filter(a => a.status === 'investigating').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Theft Detection</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor and investigate energy theft incidents</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <span className="text-sm text-red-400 font-medium">{criticalCount} Critical Alerts</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{criticalCount}</p>
              <p className="text-xs text-slate-500">Critical Cases</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Clock size={20} className="text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{investigatingCount}</p>
              <p className="text-xs text-slate-500">Under Investigation</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <CheckCircle size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">156</p>
              <p className="text-xs text-slate-500">Resolved (MTD)</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <ShieldAlert size={20} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">$420K</p>
              <p className="text-xs text-slate-500">Est. Recovery Value</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {['all', 'new', 'investigating', 'acknowledged'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={clsx(
              'px-4 py-2 text-sm rounded-lg transition-colors',
              filter === s 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
            )}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {theftAlerts.map((alert) => (
                <tr 
                  key={alert.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  onClick={() => setSelectedAlert(alert)}
                >
                  <td className="px-4 py-3 text-sm text-slate-300 capitalize">{typeLabels[alert.type] || alert.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{alert.location}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('px-2 py-1 text-xs rounded-full border', severityColors[alert.severity] || severityColors.medium)}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('px-2 py-1 text-xs rounded-full', statusColors[alert.status] || statusColors.new)}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FileText size={16} className="text-cyan-400" />
            Case Details
          </h3>
          {selectedAlert ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500">Type</p>
                <p className="text-sm font-medium text-white capitalize">{typeLabels[selectedAlert.type] || selectedAlert.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-sm text-white">{selectedAlert.location}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Description</p>
                <p className="text-sm text-white">{selectedAlert.description}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <button className="flex-1 py-2 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
                  Assign Team
                </button>
                <button className="flex-1 py-2 text-sm border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-800">
                  View Evidence
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">Select a case to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}