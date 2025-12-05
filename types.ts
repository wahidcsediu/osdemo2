export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number; // Lower number = Higher priority
  color: string;
}

export interface GanttBlock {
  processId: string | null; // null for idle
  startTime: number;
  endTime: number;
}

export interface ProcessStats {
  id: string;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
}

export interface SchedulerResult {
  ganttChart: GanttBlock[];
  stats: ProcessStats[];
  averageTurnaroundTime: number;
  averageWaitingTime: number;
}

export enum AlgorithmType {
  FCFS = 'FCFS',
  SJF = 'SJF', // Non-preemptive
  RR = 'RR',   // Round Robin
  PRIORITY = 'Priority', // Non-preemptive
}