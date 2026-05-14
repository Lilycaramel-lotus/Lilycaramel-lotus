import { promises as fs } from "fs";
import path from "path";
import type { StateVector } from "./existon";

const LOG_PATH = path.join(process.cwd(), "data", "water_log.jsonl");
const AGENT_DIR = path.join(process.cwd(), "agents");

export interface LogEntry {
  t: number; // timestamp (milliseconds)
  v: StateVector; // state vector
}

/**
 * Log a batch of states to both the main water_log.jsonl and an agent-specific markdown file
 * 
 * Files created/updated:
 * - data/water_log.jsonl: JSONL format with timestamp and state vector
 * - agents/{agent}.md: Markdown format with human-readable state summary
 * 
 * @param batch - Array of state vectors to log
 * @param agent - Agent identifier for logging
 */
export async function logBatch(batch: StateVector[], agent: string): Promise<void> {
  // Ensure directories exist
  await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
  await fs.mkdir(AGENT_DIR, { recursive: true });

  // Log to main JSONL file
  const timestamp = Date.now();
  const lines = batch
    .map((state) => {
      const entry: LogEntry = { t: timestamp, v: state };
      return JSON.stringify(entry);
    })
    .join("\n") + "\n";

  await fs.appendFile(LOG_PATH, lines);

  // Log to agent-specific markdown file
  const finalState = batch[batch.length - 1];
  const agentLog = `### ${new Date().toISOString()}\nAgent: ${agent}\nSteps: ${batch.length - 1}\nFinal State: [${finalState.join(", ")}]\n\n`;
  const agentFilePath = path.join(AGENT_DIR, `${agent}.md`);
  
  await fs.appendFile(agentFilePath, agentLog);
}

/**
 * Read the entire water_log.jsonl file and parse all entries
 * 
 * @returns Array of log entries, or empty array if file doesn't exist
 */
export async function readLog(): Promise<LogEntry[]> {
  try {
    const content = await fs.readFile(LOG_PATH, "utf-8");
    return content
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line) as LogEntry);
  } catch {
    return [];
  }
}

/**
 * Get the latest state from the log
 * 
 * @returns Latest state vector, or null if log is empty
 */
export async function getLatestState(): Promise<StateVector | null> {
  const entries = await readLog();
  if (entries.length === 0) return null;
  return entries[entries.length - 1].v;
}

/**
 * Get all states from the log
 * 
 * @returns Array of state vectors in chronological order
 */
export async function getAllStates(): Promise<StateVector[]> {
  const entries = await readLog();
  return entries.map(e => e.v);
}

/**
 * Get states within a time range
 * 
 * @param startTime - Start timestamp (milliseconds)
 * @param endTime - End timestamp (milliseconds)
 * @returns Array of log entries within the time range
 */
export async function getStatesByTimeRange(startTime: number, endTime: number): Promise<LogEntry[]> {
  const entries = await readLog();
  return entries.filter(e => e.t >= startTime && e.t <= endTime);
}

/**
 * Clear all logs (for testing/reset)
 * Removes water_log.jsonl and all agent markdown files
 */
export async function clearLogs(): Promise<void> {
  try {
    await fs.unlink(LOG_PATH);
  } catch {
    // File doesn't exist, that's fine
  }
  try {
    const files = await fs.readdir(AGENT_DIR);
    for (const file of files) {
      await fs.unlink(path.join(AGENT_DIR, file));
    }
  } catch {
    // Directory doesn't exist, that's fine
  }
}

/**
 * Get log statistics
 * 
 * @returns Object with log statistics
 */
export async function getLogStats(): Promise<{
  totalEntries: number;
  timeRange: { start: number; end: number } | null;
  agents: string[];
}> {
  const entries = await readLog();
  const agents = new Set<string>();
  
  try {
    const files = await fs.readdir(AGENT_DIR);
    files.forEach(f => {
      if (f.endsWith(".md")) {
        agents.add(f.replace(".md", ""));
      }
    });
  } catch {
    // Directory doesn't exist
  }

  if (entries.length === 0) {
    return {
      totalEntries: 0,
      timeRange: null,
      agents: Array.from(agents),
    };
  }

  return {
    totalEntries: entries.length,
    timeRange: {
      start: entries[0].t,
      end: entries[entries.length - 1].t,
    },
    agents: Array.from(agents),
  };
}
