import React, { useMemo } from 'react';
import { SchedulerResult, Process } from '../types';

interface VisualizationProps {
  results: SchedulerResult | null;
  processes: Process[];
}

const Visualization: React.FC<VisualizationProps> = ({ results, processes }) => {
  if (!results) return null;

  const totalTime = results.ganttChart.length > 0 ? results.ganttChart[results.ganttChart.length - 1].endTime : 0;

  const getProcessColor = (id: string | null) => {
    if (!id) return '#e2e8f0'; // slate-200 for idle
    const p = processes.find(proc => proc.id === id);
    return p ? p.color : '#cbd5e1';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Gantt Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-600 rounded-full"></span>
            Gantt Chart
        </h3>
        
        <div className="relative w-full h-16 bg-slate-50 rounded-lg flex overflow-hidden border border-slate-200">
            {results.ganttChart.map((block, idx) => {
                const widthPercent = ((block.endTime - block.startTime) / totalTime) * 100;
                return (
                    <div 
                        key={idx}
                        style={{ width: `${widthPercent}%`, backgroundColor: getProcessColor(block.processId) }}
                        className="h-full flex items-center justify-center relative group transition-all hover:brightness-110"
                        title={`${block.processId || 'Idle'} (${block.startTime} - ${block.endTime})`}
                    >
                        <span className="text-xs font-bold text-white drop-shadow-md truncate px-1">
                            {block.processId || 'Idle'}
                        </span>
                        {/* Tooltip on hover */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            Time: {block.startTime} - {block.endTime}
                        </div>
                    </div>
                );
            })}
        </div>
        
        {/* Time Markers */}
        <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono">
             <span>0</span>
             <span>{totalTime}</span>
        </div>
      </div>

      {/* Stats Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
            Performance Metrics
        </h3>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3">Process</th>
                        <th className="px-4 py-3">AT</th>
                        <th className="px-4 py-3">BT</th>
                        <th className="px-4 py-3">Prio</th>
                        <th className="px-4 py-3 text-emerald-600">CT</th>
                        <th className="px-4 py-3 text-blue-600">TAT</th>
                        <th className="px-4 py-3 text-orange-600">WT</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {results.stats.map((stat) => {
                        const original = processes.find(p => p.id === stat.id);
                        return (
                            <tr key={stat.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-medium text-slate-700 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: original?.color }}></div>
                                    {stat.id}
                                </td>
                                <td className="px-4 py-3 text-slate-500">{original?.arrivalTime}</td>
                                <td className="px-4 py-3 text-slate-500">{original?.burstTime}</td>
                                <td className="px-4 py-3 text-slate-500">{original?.priority}</td>
                                <td className="px-4 py-3 font-mono">{stat.completionTime}</td>
                                <td className="px-4 py-3 font-mono font-medium text-blue-600">{stat.turnaroundTime}</td>
                                <td className="px-4 py-3 font-mono font-medium text-orange-600">{stat.waitingTime}</td>
                            </tr>
                        );
                    })}
                    <tr className="bg-slate-50 font-semibold border-t border-slate-200">
                        <td colSpan={5} className="px-4 py-3 text-right text-slate-600">Average:</td>
                        <td className="px-4 py-3 text-blue-700 font-mono">{results.averageTurnaroundTime.toFixed(2)}</td>
                        <td className="px-4 py-3 text-orange-700 font-mono">{results.averageWaitingTime.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Visualization;