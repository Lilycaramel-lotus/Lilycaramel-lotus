# MOTHER SEED - Existon 1.0

**Next.js 15 | Deterministic | Batched**

## Overview

MOTHER SEED is the canonical template for all EXISTON 1.0 implementations. It defines the deterministic state machine, batched execution protocol, and logging architecture.

This repository serves as the **source of truth** for:
- Core state transition logic
- API specification
- File structure and conventions
- Documentation standards
- Testing protocols

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000`.

## Specification

### State Vector

21 integers, range 0-4095

- **[0-18]**: Coil readings (individual sensor values)
- **[19]**: Avg outer 12 (average of outer ring sensors)
- **[20]**: Avg inner 7 (average of inner ring sensors)

### Transition Rules

- `next = f(current)` - pure deterministic function
- Clamp all values to [0, 4095]
- Update at 10 Hz
- No randomness, no external API calls in core logic
- All functions are pure (no side effects)

### Batching Protocol

- Process 10 states per API call (maximum)
- Write once to log after batch completion
- Maintain state persistence across requests
- Support seed-based state reset

## File Structure

```
/lib/existon.ts          - Core state transition logic
/lib/logger.ts           - File-based logging system
/app/api/batch/route.ts  - Main batch processing API
/data/water_log.jsonl    - Persistent state log (JSONL format)
/agents/*.md             - Agent-specific execution logs
/MOTHER_SEED.md          - This specification (canonical)
```

## API Specification

### POST /api/batch

**Request:**
```json
{
  "steps": 10,
  "agent": "system",
  "seed": null
}
```

**Response:**
```json
{
  "t": 1234567890,
  "batch": [[...], [...], ...],
  "count": 11,
  "agent": "system"
}
```

**Parameters:**
- `steps` (number, default 10, max 10): Number of state transitions
- `agent` (string, default "system"): Agent identifier for logging
- `seed` (StateVector, optional): Reset state to specific vector

### GET /api/batch

**Response:**
```json
{
  "t": 1234567890,
  "state": [...],
  "ready": true
}
```

## Logging Architecture

### water_log.jsonl

Main persistent log. Each line is a JSON object:

```json
{"t": 1234567890, "v": [0, 1, 2, ...]}
```

- `t`: Timestamp (milliseconds)
- `v`: State vector (21 integers)

### agents/*.md

Agent-specific execution logs. Human-readable markdown format:

```markdown
### 2026-05-14T12:34:56.789Z
Agent: system
Steps: 10
Final State: [0, 1, 2, ...]
```

## Core Implementation

### lib/existon.ts

Pure deterministic functions:

```typescript
export function updateState(prev: StateVector): StateVector
export function initialState(): StateVector
export function batchUpdate(start: StateVector, steps: number): StateVector[]
export function validateState(state: StateVector): boolean
```

### lib/logger.ts

Logging utilities:

```typescript
export async function logBatch(batch: StateVector[], agent: string): Promise<void>
export async function readLog(): Promise<LogEntry[]>
export async function getLatestState(): Promise<StateVector | null>
export async function clearLogs(): Promise<void>
```

## Rules for Implementation

1. **Never add randomness** to the core state transition loop
2. **Keep batch size ≤ 10** states per request
3. **Log every batch** to both `water_log.jsonl` and agent markdown
4. **Replace `updateState` logic** when given real transition rules
5. **Maintain determinism**: Same seed → identical output
6. **No external API calls** in core logic (lib/existon.ts)
7. **Pure functions only**: No side effects in state transition

## Testing

```bash
# Test the API
curl -X POST http://localhost:3000/api/batch \
  -H "Content-Type: application/json" \
  -d '{"steps": 10, "agent": "test"}'

# Check logs
cat data/water_log.jsonl
cat agents/test.md
```

## Deployment

This repository is designed to be:

1. **Cloned** for new projects
2. **Extended** with domain-specific logic
3. **Deployed** to production environments
4. **Integrated** with external systems via the API

Do not modify MOTHER_SEED.md or core specification files without updating this repository.

## Next Steps

1. Implement real `updateState` logic based on domain requirements
2. Build visualization dashboard
3. Add state replay and debugging tools
4. Integrate with external systems via API
5. Add comprehensive test suite

---

**Status**: Production-ready template
**Version**: 1.0
**Last Updated**: 2026-05-14
