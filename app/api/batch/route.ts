import { NextResponse } from "next/server";
import { batchUpdate, initialState, validateState } from "@/lib/existon";
import { logBatch, getLatestState, getLogStats } from "@/lib/logger";
import type { StateVector } from "@/lib/existon";

// In-memory state for the current session
// Persists across API calls within the same server instance
let state: StateVector | null = null;

/**
 * Initialize state from log or create new initial state
 */
async function ensureState(): Promise<StateVector> {
  if (state === null) {
    const latestFromLog = await getLatestState();
    state = latestFromLog || initialState();
  }
  return state;
}

/**
 * POST /api/batch
 * 
 * Process a batch of state transitions and log the results
 * 
 * Request body:
 * {
 *   "steps": number (default 10, max 10),
 *   "agent": string (default "system"),
 *   "seed": StateVector (optional, to reset state)
 * }
 * 
 * Response:
 * {
 *   "t": number (timestamp),
 *   "batch": StateVector[],
 *   "count": number (batch length),
 *   "agent": string
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { steps = 10, agent = "system", seed } = body;

    // Validate steps
    if (!Number.isInteger(steps) || steps < 1 || steps > 10) {
      return NextResponse.json(
        { error: "steps must be an integer between 1 and 10" },
        { status: 400 }
      );
    }

    // Validate agent name
    if (typeof agent !== "string" || agent.length === 0 || agent.length > 50) {
      return NextResponse.json(
        { error: "agent must be a non-empty string (max 50 chars)" },
        { status: 400 }
      );
    }

    // Handle seed reset if provided
    if (seed !== undefined) {
      if (!Array.isArray(seed) || !validateState(seed)) {
        return NextResponse.json(
          { error: "seed must be a valid StateVector" },
          { status: 400 }
        );
      }
      state = seed;
    } else {
      // Ensure state is initialized
      await ensureState();
    }

    // Generate batch
    const batch = batchUpdate(state!, steps);
    const finalState = batch[batch.length - 1];

    // Update in-memory state
    state = finalState;

    // Log batch to files
    await logBatch(batch, agent);

    // Return response
    return NextResponse.json(
      {
        t: Date.now(),
        batch,
        count: batch.length,
        agent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/batch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/batch
 * 
 * Get current state and log summary
 * 
 * Response:
 * {
 *   "t": number (timestamp),
 *   "state": StateVector,
 *   "ready": boolean,
 *   "stats": { totalEntries, timeRange, agents }
 * }
 */
export async function GET() {
  try {
    const currentState = await ensureState();
    const stats = await getLogStats();
    
    return NextResponse.json(
      {
        t: Date.now(),
        state: currentState,
        ready: true,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/batch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
