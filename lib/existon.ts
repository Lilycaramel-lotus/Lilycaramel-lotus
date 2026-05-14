export type StateVector = number[];

/**
 * Update a single state vector by clamping all values to [0, 4095]
 * Pure deterministic function - no side effects
 * 
 * @param prev - Previous state vector
 * @returns New state vector with all values clamped
 */
export function updateState(prev: StateVector): StateVector {
  return prev.map(v => Math.max(0, Math.min(4095, v)));
}

/**
 * Initialize a state vector of 21 elements, all set to 0
 * 
 * Indices:
 * - [0-18]: Coil readings (individual sensor values)
 * - [19]: Avg outer 12 (average of outer ring sensors)
 * - [20]: Avg inner 7 (average of inner ring sensors)
 * 
 * @returns Initial state vector
 */
export function initialState(): StateVector {
  return Array(21).fill(0);
}

/**
 * Generate a batch of states by repeatedly applying updateState
 * 
 * @param start - Starting state vector
 * @param steps - Number of transitions to apply (1-10)
 * @returns Array of states, length = steps + 1 (includes initial state)
 */
export function batchUpdate(start: StateVector, steps: number): StateVector[] {
  let current = [...start];
  const batch: StateVector[] = [current];
  
  for (let i = 0; i < steps; i++) {
    current = updateState(current);
    batch.push([...current]);
  }
  
  return batch;
}

/**
 * Validate that a state vector conforms to specification
 * 
 * Requirements:
 * - Must be an array
 * - Length must be exactly 21
 * - All values must be integers in range [0, 4095]
 * 
 * @param state - State vector to validate
 * @returns true if valid, false otherwise
 */
export function validateState(state: StateVector): boolean {
  if (!Array.isArray(state) || state.length !== 21) {
    return false;
  }
  return state.every(v => Number.isInteger(v) && v >= 0 && v <= 4095);
}

/**
 * Compute the average of a subset of state values
 * Used for calculating derived metrics
 * 
 * @param state - State vector
 * @param indices - Indices to average
 * @returns Average value, clamped to [0, 4095]
 */
export function computeAverage(state: StateVector, indices: number[]): number {
  if (indices.length === 0) return 0;
  const sum = indices.reduce((acc, i) => acc + (state[i] || 0), 0);
  const avg = Math.round(sum / indices.length);
  return Math.max(0, Math.min(4095, avg));
}

/**
 * Update derived metrics (indices 19 and 20) based on coil readings
 * 
 * @param state - State vector with coil readings
 * @returns Updated state vector with derived metrics
 */
export function updateDerivedMetrics(state: StateVector): StateVector {
  const updated = [...state];
  
  // Outer 12: indices 0-11
  updated[19] = computeAverage(state, Array.from({ length: 12 }, (_, i) => i));
  
  // Inner 7: indices 12-18
  updated[20] = computeAverage(state, Array.from({ length: 7 }, (_, i) => i + 12));
  
  return updated;
}
