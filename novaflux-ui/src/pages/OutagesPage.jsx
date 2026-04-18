import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Clock, Users, Wrench, ChevronRight } from 'lucide-react';
import { outages as outagesApi } from '../services/api';
import clsx from 'clsx';

const statusColors = {
  reported: 'bg-blue-500/20 text-blue-400',
  confirmed: 'bg-orange-500/20 text-orange-400',
  in_progress: 'bg-purple-500/20 text-purple-400',
  resolved: 'bg-emerald-500/20 text-emerald-400',
};

const typeIcons = {
  scheduled: 'bg-cyan-500/20 text-cyan-400',
  unscheduled: 'bg-orange-500/20 text-orange-400',
  emergency: 'bg-red-500/20 text-red-400',
};

export default function OutagesPage() {
  const [filter, setFilter] = useState('all');

  const { data: outagesData, isLoading } = useQuery({
    queryKey: ['outages', filter],
    queryFn: () => outagesApi.list({ status: filter === 'all' ? undefined : filter }),
    refetchInterval: 30000,
  });

  const { data: statsData } = useQuery({
    queryKey: ['outagesStats'],
    queryFn: () => outagesApi.stats({}),
  });

  const outages = outagesData || [];
  const stats = statsData || { active: 4, inProgress: 2, totalAffected: 7890, avgDuration: 145 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Outage Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and resolve power outages</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600">
          <AlertTriangle size={16} />
          Report Outage
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-xs text-slate-500">Active Outages</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Wrench size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.inProgress}</p>
              <p className="text-xs text-slate-500">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Users size={20} className="text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalAffected.toLocaleString()}</p>
              <p className="text-xs text-slate-500">Customers Affected</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Clock size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.avgDuration}min</p>
              <p className="text-xs text-slate-500">Avg Response</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {['all', 'reported', 'in_progress', 'resolved'].map((s) => (
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
            {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Loading outages...</div>
        ) : outages.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No outages found</div>
        ) : (
          outages.map((outage) => (
            <div key={outage.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={clsx('p-2 rounded-lg', typeIcons[outage.type])}>
                    <AlertTriangle size={20} className={outage.type === 'emergency' ? 'text-red-400' : ''} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white">{outage.cause}</h3>
                      <span className={clsx('px-2 py-0.5 text-xs rounded-full', statusColors[outage.status])}>
                        {outage.status?.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{outage.regionName} • {outage.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-white">{outage.affectedCustomers?.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Affected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">
                      {outage.expectedEndTime ? new Date(outage.expectedEndTime).toLocaleTimeString() : 'TBD'}
                    </p>
                    <p className="text-xs text-slate-500">ETA</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-400" />
                </div>
              </div>
              
              <div className="flex gap-4 mt-4 pt-4 border-t border-slate-800">
                <button className="text-sm text-cyan-400 hover:text-cyan-300">View on Map</button>
                <button className="text-sm text-cyan-400 hover:text-cyan-300">Assign Crew</button>
                <button className="text-sm text-cyan-400 hover:text-cyan-300">Update Status</button>
                <button className="text-sm text-cyan-400 hover:text-cyan-300">Notify Customers</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}