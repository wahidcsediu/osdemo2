import React, { useState } from 'react';
import { Process, AlgorithmType } from '../types';
import { Plus, Trash2, Play, RefreshCw } from 'lucide-react';

interface ProcessInputProps {
  processes: Process[];
  setProcesses: (p: Process[]) => void;
  algorithm: AlgorithmType;
  setAlgorithm: (a: AlgorithmType) => void;
  quantum: number;
  setQuantum: (q: number) => void;
  onSimulate: () => void;
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

const ProcessInput: React.FC<ProcessInputProps> = ({
  processes,
  setProcesses,
  algorithm,
  setAlgorithm,
  quantum,
  setQuantum,
  onSimulate
}) => {
  const [newBurst, setNewBurst] = useState(1);
  const [newArrival, setNewArrival] = useState(0);
  const [newPriority, setNewPriority] = useState(1);

  const addProcess = () => {
    const id = `P${processes.length + 1}`;
    const color = COLORS[processes.length % COLORS.length];
    setProcesses([...processes, {
      id,
      arrivalTime: Number(newArrival),
      burstTime: Number(newBurst),
      priority: Number(newPriority),
      color
    }]);
    setNewBurst(1);
    setNewPriority(1);
  };

  const removeProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const generateRandom = () => {
    const count = 5;
    const newProcs: Process[] = [];
    for(let i=0; i<count; i++) {
        newProcs.push({
            id: `P${i+1}`,
            arrivalTime: Math.floor(Math.random() * 10),
            burstTime: Math.floor(Math.random() * 10) + 1,
            priority: Math.floor(Math.random() * 5) + 1,
            color: COLORS[i % COLORS.length]
        });
    }
    setProcesses(newProcs);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
        Configuration
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Algorithm</label>
          <select 
            value={algorithm} 
            onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={AlgorithmType.FCFS}>First Come First Serve (FCFS)</option>
            <option value={AlgorithmType.SJF}>Shortest Job First (SJF)</option>
            <option value={AlgorithmType.RR}>Round Robin (RR)</option>
            <option value={AlgorithmType.PRIORITY}>Priority (Non-Preemptive)</option>
          </select>
        </div>
        
        {algorithm === AlgorithmType.RR && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Time Quantum</label>
            <input 
              type="number" 
              min="1"
              value={quantum}
              onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-6">
        <label className="block text-sm font-medium text-slate-600 mb-2">Add Process</label>
        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <input 
               type="number" 
               placeholder="Arrival"
               value={newArrival}
               min="0"
               onChange={(e) => setNewArrival(Number(e.target.value))}
               className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none placeholder:text-slate-400"
            />
            <span className="text-xs text-slate-400 ml-1">Arrival Time</span>
          </div>
          <div className="flex-1">
            <input 
               type="number" 
               placeholder="Burst"
               value={newBurst}
               min="1"
               onChange={(e) => setNewBurst(Number(e.target.value))}
               className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none placeholder:text-slate-400"
            />
            <span className="text-xs text-slate-400 ml-1">Burst Time</span>
          </div>
          <div className="flex-1">
            <input 
               type="number" 
               placeholder="Priority"
               value={newPriority}
               min="0"
               onChange={(e) => setNewPriority(Number(e.target.value))}
               className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none placeholder:text-slate-400"
            />
            <span className="text-xs text-slate-400 ml-1">Priority (Low=High)</span>
          </div>
          <button 
            onClick={addProcess}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center h-[42px]"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-[200px] overflow-y-auto mb-6 pr-2">
           {processes.map((p) => (
             <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                   <span className="font-semibold text-slate-700">{p.id}</span>
                   <span className="text-sm text-slate-500">Arrival: {p.arrivalTime}</span>
                   <span className="text-sm text-slate-500">Burst: {p.burstTime}</span>
                   <span className="text-sm text-slate-500">Prio: {p.priority}</span>
                </div>
                <button onClick={() => removeProcess(p.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 size={16} />
                </button>
             </div>
           ))}
           {processes.length === 0 && (
             <div className="text-center py-4 text-slate-400 text-sm">No processes added yet.</div>
           )}
        </div>

        <div className="flex gap-3">
            <button 
                onClick={onSimulate}
                disabled={processes.length === 0}
                className="flex-1 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all active:scale-[0.98]"
            >
                <Play size={18} /> Run Simulation
            </button>
            <button 
                onClick={generateRandom}
                className="px-4 py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-medium flex items-center gap-2 transition-colors"
                title="Randomize"
            >
                <RefreshCw size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessInput;