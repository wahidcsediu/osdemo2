import { GoogleGenAI } from "@google/genai";
import { Process, SchedulerResult, AlgorithmType } from '../types';

// NOTE: The API key must be provided via process.env.API_KEY
// The app will function without it, but the AI feature will be disabled or error out.

export const analyzeSchedule = async (
  algorithm: AlgorithmType,
  processes: Process[],
  results: SchedulerResult
): Promise<string> => {
  
  if (!process.env.API_KEY) {
      throw new Error("API Key not found. Please set REACT_APP_GEMINI_API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze the following CPU Scheduling simulation results.
    Algorithm: ${algorithm}
    
    Processes:
    ${JSON.stringify(processes.map(p => ({id: p.id, AT: p.arrivalTime, BT: p.burstTime})))}

    Results (Averages):
    Average Turnaround Time: ${results.averageTurnaroundTime.toFixed(2)}
    Average Waiting Time: ${results.averageWaitingTime.toFixed(2)}

    Process Stats:
    ${JSON.stringify(results.stats)}

    Please provide a concise (max 150 words) insight on:
    1. Is this algorithm efficient for this specific batch?
    2. Which process suffered the most (starvation/waiting)?
    3. Would a different algorithm likely perform better?
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze schedule.");
  }
};