import { Process, SchedulerResult, GanttBlock, ProcessStats, AlgorithmType } from '../types';

const calculateAverages = (stats: ProcessStats[]): { avgTurnaround: number; avgWaiting: number } => {
  const totalTurnaround = stats.reduce((acc, curr) => acc + curr.turnaroundTime, 0);
  const totalWaiting = stats.reduce((acc, curr) => acc + curr.waitingTime, 0);
  return {
    avgTurnaround: stats.length ? totalTurnaround / stats.length : 0,
    avgWaiting: stats.length ? totalWaiting / stats.length : 0,
  };
};

export const solveFCFS = (processes: Process[]): SchedulerResult => {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const ganttChart: GanttBlock[] = [];
  const stats: ProcessStats[] = [];

  sorted.forEach((p) => {
    if (currentTime < p.arrivalTime) {
      ganttChart.push({ processId: null, startTime: currentTime, endTime: p.arrivalTime });
      currentTime = p.arrivalTime;
    }
    const startTime = currentTime;
    const endTime = startTime + p.burstTime;
    ganttChart.push({ processId: p.id, startTime, endTime });
    
    stats.push({
      id: p.id,
      completionTime: endTime,
      turnaroundTime: endTime - p.arrivalTime,
      waitingTime: endTime - p.arrivalTime - p.burstTime,
    });
    currentTime = endTime;
  });

  const avgs = calculateAverages(stats);
  return { ganttChart, stats, averageTurnaroundTime: avgs.avgTurnaround, averageWaitingTime: avgs.avgWaiting };
};

export const solveSJF = (processes: Process[]): SchedulerResult => {
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;
  const isCompleted = new Array(n).fill(false);
  const ganttChart: GanttBlock[] = [];
  const stats: ProcessStats[] = [];

  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  while (completed < n) {
    const available = sortedProcesses.filter((p, i) => !isCompleted[i] && p.arrivalTime <= currentTime);

    if (available.length === 0) {
      const nextArrival = sortedProcesses.find((p, i) => !isCompleted[i])?.arrivalTime;
      if (nextArrival !== undefined) {
         ganttChart.push({ processId: null, startTime: currentTime, endTime: nextArrival });
         currentTime = nextArrival;
      } else {
        break;
      }
      continue;
    }

    available.sort((a, b) => a.burstTime - b.burstTime);
    const p = available[0];
    const originalIndex = sortedProcesses.findIndex(x => x.id === p.id);

    const startTime = currentTime;
    const endTime = startTime + p.burstTime;
    ganttChart.push({ processId: p.id, startTime, endTime });
    
    stats.push({
      id: p.id,
      completionTime: endTime,
      turnaroundTime: endTime - p.arrivalTime,
      waitingTime: endTime - p.arrivalTime - p.burstTime,
    });

    isCompleted[originalIndex] = true;
    completed++;
    currentTime = endTime;
  }

  const avgs = calculateAverages(stats);
  return { ganttChart, stats, averageTurnaroundTime: avgs.avgTurnaround, averageWaitingTime: avgs.avgWaiting };
};

export const solvePriority = (processes: Process[]): SchedulerResult => {
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;
  const isCompleted = new Array(n).fill(false);
  const ganttChart: GanttBlock[] = [];
  const stats: ProcessStats[] = [];

  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

  while (completed < n) {
    const available = sortedProcesses.filter((p, i) => !isCompleted[i] && p.arrivalTime <= currentTime);

    if (available.length === 0) {
      const nextArrival = sortedProcesses.find((p, i) => !isCompleted[i])?.arrivalTime;
      if (nextArrival !== undefined) {
         ganttChart.push({ processId: null, startTime: currentTime, endTime: nextArrival });
         currentTime = nextArrival;
      } else {
        break;
      }
      continue;
    }

    // Sort by Priority (ascending), then Arrival Time
    available.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.arrivalTime - b.arrivalTime;
    });

    const p = available[0];
    const originalIndex = sortedProcesses.findIndex(x => x.id === p.id);

    const startTime = currentTime;
    const endTime = startTime + p.burstTime;
    ganttChart.push({ processId: p.id, startTime, endTime });
    
    stats.push({
      id: p.id,
      completionTime: endTime,
      turnaroundTime: endTime - p.arrivalTime,
      waitingTime: endTime - p.arrivalTime - p.burstTime,
    });

    isCompleted[originalIndex] = true;
    completed++;
    currentTime = endTime;
  }

  const avgs = calculateAverages(stats);
  return { ganttChart, stats, averageTurnaroundTime: avgs.avgTurnaround, averageWaitingTime: avgs.avgWaiting };
};

export const solveRR = (processes: Process[], quantum: number): SchedulerResult => {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const n = sortedProcesses.length;
  const remainingBurst = sortedProcesses.map(p => p.burstTime);
  const statsMap: {[key: string]: Partial<ProcessStats>} = {};
  
  let currentTime = 0;
  let completed = 0;
  const ganttChart: GanttBlock[] = [];
  
  const queue: number[] = [];
  const visited = new Array(n).fill(false);

  if (n > 0) {
      if (sortedProcesses[0].arrivalTime > 0) {
        ganttChart.push({ processId: null, startTime: 0, endTime: sortedProcesses[0].arrivalTime });
        currentTime = sortedProcesses[0].arrivalTime;
      }
      sortedProcesses.forEach((p, i) => {
        if (p.arrivalTime <= currentTime && !visited[i]) {
            queue.push(i);
            visited[i] = true;
        }
      });
  }

  while (completed < n) {
    if (queue.length === 0) {
       const nextProcessIdx = sortedProcesses.findIndex((p, i) => !visited[i]);
       if (nextProcessIdx !== -1) {
           const nextTime = sortedProcesses[nextProcessIdx].arrivalTime;
           ganttChart.push({ processId: null, startTime: currentTime, endTime: nextTime });
           currentTime = nextTime;
           
           sortedProcesses.forEach((p, i) => {
             if (p.arrivalTime <= currentTime && !visited[i]) {
                 queue.push(i);
                 visited[i] = true;
             }
           });
       } else {
           break; 
       }
    }

    const idx = queue.shift()!;
    const p = sortedProcesses[idx];
    
    const startTime = currentTime;
    const executeTime = Math.min(quantum, remainingBurst[idx]);
    remainingBurst[idx] -= executeTime;
    currentTime += executeTime;
    
    ganttChart.push({ processId: p.id, startTime, endTime: currentTime });

    sortedProcesses.forEach((proc, i) => {
        if (proc.arrivalTime <= currentTime && !visited[i] && i !== idx) {
            queue.push(i);
            visited[i] = true;
        }
    });

    if (remainingBurst[idx] > 0) {
        queue.push(idx);
    } else {
        completed++;
        statsMap[p.id] = {
            id: p.id,
            completionTime: currentTime,
            turnaroundTime: currentTime - p.arrivalTime,
            waitingTime: (currentTime - p.arrivalTime) - p.burstTime
        };
    }
  }

  const stats = processes.map(p => statsMap[p.id] as ProcessStats);
  const avgs = calculateAverages(stats);
  return { ganttChart, stats, averageTurnaroundTime: avgs.avgTurnaround, averageWaitingTime: avgs.avgWaiting };
};

export const solve = (algo: AlgorithmType, processes: Process[], quantum: number = 2): SchedulerResult => {
    switch (algo) {
        case AlgorithmType.FCFS: return solveFCFS(processes);
        case AlgorithmType.SJF: return solveSJF(processes);
        case AlgorithmType.RR: return solveRR(processes, quantum);
        case AlgorithmType.PRIORITY: return solvePriority(processes);
        default: return solveFCFS(processes);
    }
};