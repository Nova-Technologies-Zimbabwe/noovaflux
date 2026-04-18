import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Factory, Zap, Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import { grid as gridApi } from '../services/api';
import clsx from 'clsx';

const statusColors = {
  active: 'text-emerald-400',
  warning: 'text-orange-400',
  critical: 'text-red-400',
  fault: 'text-red-500',
};

export default function SubstationsPage() {
  const [selectedSubstation, setSelectedSubstation] = useState(null);

  const { data: gridStatus } = useQuery({
    queryKey: ['gridStatus'],
    queryFn: gridApi.status,
  });

  const { data: substations } = useQuery({
    queryKey: ['substations', '1'],
    queryFn: () => gridApi.region('1'),
  });

  const mockSubstations = substations || [
    { id: 's1', name: 'Harare North', regionId: '1', voltageLevel: '110kV', status: 'active', transformers: 3, feeders: 8 },
    { id: 's2', name: 'Harare South', regionId: '1', voltageLevel: '66kV', status: 'warning', transformers: 2, feeders: 6 },
    { id: 's3', name: 'Bulawayo Central', regionId: '2', voltageLevel: '110kV', status: 'critical', transformers: 4, feeders: 12 },
    { id: 's4', name: 'Mutare', regionId: '3', voltageLevel: '33kV', status: 'active', transformers: 2, feeders: 4 },
    { id: 's5', name: 'Gweru', regionId: '4', voltageLevel: '66kV', status: 'active', transformers: 2, feeders: 5 },
    { id: 's6', name: 'Masvingo', regionId: '5', voltageLevel: '33kV', status: 'fault', transformers: 1, feeders: 3 },
  ];

  const activeCount = mockSubstations.filter(s => s.status === 'active').length;
  const warningCount = mockSubstations.filter(s => s.status === 'warning').length;
  const faultCount = mockSubstations.filter(s => s.status === 'fault').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Substations & Feeders</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor and control substation infrastructure</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20">
              <Factory size={20} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{gridStatus?.totalSubstations || 6}</p>
              <p className="text-xs text-slate-500">Total Substations</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Activity size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeCount}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <AlertTriangle size={20} className="text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{warningCount}</p>
              <p className="text-xs text-slate-500">Warnings</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <Zap size={20} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{faultCount}</p>
              <p className="text-xs text-slate-500">Faults</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {mockSubstations.map((sub) => (
            <div 
              key={sub.id}
              onClick={() => setSelectedSubstation(sub)}
              className={clsx(
                'bg-white dark:bg-slate-900 rounded-xl border p-4 cursor-pointer transition-all hover:border-cyan-500/50',
                selectedSubstation?.id === sub.id ? 'border-cyan-500' : 'border-slate-200 dark:border-slate-800'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={clsx('w-3 h-3 rounded-full', sub.status === 'active' ? 'bg-emerald-400' : sub.status === 'warning' ? 'bg-orange-400' : 'bg-red-400')}></div>
                  <div>
                    <h3 className="font-medium text-white">{sub.name}</h3>
                    <p className="text-sm text-slate-500">{sub.voltageLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{(Math.random() * 40 + 50).toFixed(0)}%</p>
                    <p className="text-xs text-slate-500">Load</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-400" />
                </div>
              </div>
              <div className="flex gap-6 mt-4 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-xs text-slate-500">Transformers</p>
                  <p className="text-sm text-white">{sub.transformers}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Feeders</p>
                  <p className="text-sm text-white">{sub.feeders}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className={clsx('text-sm capitalize', statusColors[sub.status])}>{sub.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <h3 className="font-semibold text-white mb-4">Substation Details</h3>
          {selectedSubstation ? (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Load</span>
                  <span className="text-lg font-bold text-white">72%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-cyan-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                  <Zap size={20} className="mx-auto text-cyan-400 mb-1" />
                  <p className="text-sm text-white">Voltage</p>
                  <p className="text-xs text-slate-400">{selectedSubstation.voltageLevel}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 text-center">
                  <Activity size={20} className="mx-auto text-cyan-400 mb-1" />
                  <p className="text-sm text-white">Frequency</p>
                  <p className="text-xs text-slate-400">50.02 Hz</p>
                </div>
              </div>

              <button className="w-full py-2 text-sm bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
                Open Single-Line Diagram
              </button>
              <button className="w-full py-2 text-sm border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-800">
                View Feeders
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">Select a substation to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}