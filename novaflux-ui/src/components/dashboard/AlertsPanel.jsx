import { useState } from 'react';
import { AlertTriangle, ShieldAlert, Zap, Check, Clock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { alerts as alertsApi } from '../../services/api';
import clsx from 'clsx';

const severityIcons = {
  critical: ShieldAlert,
  high: AlertTriangle,
  medium: Zap,
  low: AlertTriangle,
};

const severityColors = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const typeLabels = {
  theft: 'Theft',
  overload: 'Overload',
  tamper: 'Tamper',
  voltage: 'Voltage',
  fault: 'Fault',
  outage: 'Outage',
};

function formatTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

export default function AlertsPanel({ alerts = [], loading = false }) {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const acknowledgeMutation = useMutation({
    mutationFn: (id) => alertsApi.acknowledge(id),
    onSuccess: () => queryClient.invalidateQueries(['alerts']),
  });

  const displayAlerts = alerts.length > 0 ? alerts : [];
  const filteredAlerts = filter === 'all' ? displayAlerts : displayAlerts.filter(a => a.status === filter);

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-400" />
          Active Alerts
        </h3>
        <div className="flex gap-2">
          {['all', 'new', 'acknowledged'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-2 py-1 text-xs rounded-full transition-colors',
                filter === f 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-slate-500">Loading alerts...</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-4 text-center text-slate-500">No alerts</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filteredAlerts.map((alert) => {
              const Icon = severityIcons[alert.severity] || AlertTriangle;
              return (
                <div key={alert.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={clsx(
                      'p-2 rounded-lg border flex-shrink-0',
                      severityColors[alert.severity] || severityColors.low
                    )}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {typeLabels[alert.type] || alert.type}
                        </span>
                        <span className="text-xs text-slate-500">{formatTime(alert.createdAt)}</span>
                      </div>
                      <h4 className="text-sm font-medium text-white truncate">{alert.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{alert.location}</p>
                    </div>
                    {alert.status === 'new' && (
                      <button
                        onClick={() => acknowledgeMutation.mutate(alert.id)}
                        className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                        title="Acknowledge"
                      >
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-800 flex-shrink-0 text-center">
        <button className="text-sm text-cyan-400 hover:text-cyan-300">View All Alerts →</button>
      </div>
    </div>
  );
}