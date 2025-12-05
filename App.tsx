import React, { useState, useCallback } from 'react';
import ProcessInput from './components/ProcessInput';
import Visualization from './components/Visualization';
import { Process, AlgorithmType, SchedulerResult } from './types';
import { solve } from './utils/scheduler';
import { LayoutGrid, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>(AlgorithmType.FCFS);
  const [quantum, setQuantum] = useState<number>(2);
  const [results, setResults] = useState<SchedulerResult | null>(null);

  const handleSimulate = useCallback(() => {
    const res = solve(algorithm, processes, quantum);
    setResults(res);
  }, [algorithm, processes, quantum]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
                    <Cpu size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">OS Scheduler Simulator</h1>
                    <p className="text-slate-500 text-sm">Visualize FCFS, SJF, RR, and Priority algorithms</p>
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <ProcessInput 
              processes={processes} 
              setProcesses={setProcesses}
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              quantum={quantum}
              setQuantum={setQuantum}
              onSimulate={handleSimulate}
            />
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-8">
            {results ? (
              <Visualization results={results} processes={processes} />
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <LayoutGrid size={48} className="mb-4 opacity-20" />
                  <p>Add processes and click Simulate</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;