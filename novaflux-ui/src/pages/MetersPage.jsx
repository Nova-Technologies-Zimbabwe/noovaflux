import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Search, Plus, Zap, ZapOff, AlertTriangle, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { meters as metersApi } from '../services/api';
import clsx from 'clsx';

const statusColors = {
  active: 'bg-emerald-500/20 text-emerald-400',
  disconnected: 'bg-red-500/20 text-red-400',
  tampered: 'bg-orange-500/20 text-orange-400',
  fault: 'bg-red-500/20 text-red-400',
};

export default function MetersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: metersData, isLoading, refetch } = useQuery({
    queryKey: ['meters', { status: statusFilter !== 'all' ? statusFilter : undefined, limit, offset: (page - 1) * limit }],
    queryFn: () => metersApi.list({ status: statusFilter !== 'all' ? statusFilter : undefined, limit, offset: (page - 1) * limit }),
  });

  const disconnectMutation = useMutation({
    mutationFn: (id) => metersApi.disconnect(id),
    onSuccess: () => refetch(),
  });

  const reconnectMutation = useMutation({
    mutationFn: (id) => metersApi.reconnect(id),
    onSuccess: () => refetch(),
  });

  const meters = metersData?.rows || [];
  const totalPages = Math.ceil((metersData?.count || 0) / limit) || 1;

  const filteredMeters = search
    ? meters.filter(m => m.serialNumber?.toLowerCase().includes(search.toLowerCase()))
    : meters;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Meters</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and monitor all connected meters</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600">
          <Plus size={16} />
          Add Meter
        </button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by meter ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          />
        </div>
        
        <div className="flex gap-2">
          {['all', 'active', 'disconnected', 'tampered'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={clsx(
                'px-3 py-2 text-sm rounded-lg border transition-colors',
                statusFilter === s 
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              )}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-500 mt-2">Loading meters...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Meter ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tariff</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredMeters.map((meter) => (
                <tr key={meter.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-sm font-medium text-cyan-600 dark:text-cyan-400">{meter.serialNumber || meter.meterNumber}</td>
                  <td className="px-4 py-3 text-sm text-slate-500 capitalize">{meter.meterType}</td>
                  <td className="px-4 py-3">
                    <span className={clsx('px-2 py-1 text-xs rounded-full', statusColors[meter.status])}>
                      {meter.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx('text-sm font-medium', meter.balance < 0 ? 'text-red-400' : 'text-slate-700 dark:text-slate-300')}>
                      ${meter.balance?.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 capitalize">{meter.tariff}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {meter.status === 'active' ? (
                        <button 
                          onClick={() => disconnectMutation.mutate(meter.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-400"
                          title="Disconnect"
                        >
                          <ZapOff size={16} />
                        </button>
                      ) : meter.status === 'disconnected' ? (
                        <button 
                          onClick={() => reconnectMutation.mutate(meter.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-green-400"
                          title="Reconnect"
                        >
                          <Zap size={16} />
                        </button>
                      ) : null}
                      {meter.status === 'tampered' && (
                        <AlertTriangle size={16} className="text-orange-400" />
                      )}
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Showing {filteredMeters.length} of {metersData?.count || 0} meters</p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={clsx(
                'w-8 h-8 rounded-lg text-sm',
                page === i + 1 ? 'bg-cyan-500 text-white' : 'border border-slate-200 dark:border-slate-700'
              )}
            >
              {i + 1}
            </button>
          ))}
          <button 
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}