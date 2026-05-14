# MOTHER SEED - Existon 1.0

**Next.js 15 | Deterministic | Batched | Production-Ready**

The canonical template for EXISTON 1.0 implementations. A deterministic state machine with batched execution, persistent logging, and pure functional architecture.

## Overview

MOTHER SEED defines:

- **Deterministic state transitions**: Same input → identical output, always
- **Batched execution**: Process up to 10 state transitions per API call
- **Persistent logging**: JSONL format for data integrity and replay
- **Pure functions**: No side effects, no randomness, no external dependencies in core logic
- **Agent tracking**: Per-agent execution logs for debugging and analysis

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Test the API

```bash
# Process 10 state transitions
curl -X POST http://localhost:3000/api/batch \
  -H "Content-Type: application/json" \
  -d '{"steps": 10, "agent": "test"}'

# Get current state
curl http://localhost:3000/api/batch
```

### Check Logs

```bash
# Main state log (JSONL format)
cat data/water_log.jsonl

# Agent-specific logs (Markdown)
cat agents/test.md
```

## Architecture

### Core Components

| File | Purpose |
| :--- | :--- |
| `lib/existon.ts` | Pure state transition logic |
| `lib/logger.ts` | File-based persistence layer |
| `app/api/batch/route.ts` | HTTP API endpoints |
| `MOTHER_SEED.md` | Canonical specification |

### State Vector

21 integers, range [0, 4095]:

- **[0-18]**: Coil readings (individual sensor values)
- **[19]**: Avg outer 12 (computed average)
- **[20]**: Avg inner 7 (computed average)

### Execution Flow

```
Request → Validate → Initialize State → Generate Batch → Log → Response
```

1. **Validate**: Check parameters (steps, agent, seed)
2. **Initialize**: Load state from log or use seed
3. **Generate**: Apply updateState N times
4. **Log**: Write to JSONL and agent markdown
5. **Response**: Return batch and metadata

## API Specification

### POST /api/batch

Process state transitions and log results.

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
  "batch": [[0, 0, ..., 0], [0, 0, ..., 0]],
  "count": 11,
  "agent": "system"
}
```

**Parameters:**
- `steps` (number, 1-10, default 10): Transitions to apply
- `agent` (string, default "system"): Agent identifier
- `seed` (StateVector, optional): Reset state to specific vector

### GET /api/batch

Get current state and log statistics.

**Response:**
```json
{
  "t": 1234567890,
  "state": [0, 0, ..., 0],
  "ready": true,
  "stats": {
    "totalEntries": 42,
    "timeRange": { "start": 1234567800, "end": 1234567890 },
    "agents": ["system", "test"]
  }
}
```

## Logging

### water_log.jsonl

Main persistent log. Each line is a JSON object:

```json
{"t": 1234567890, "v": [0, 1, 2, 3, ..., 4095]}
```

- `t`: Timestamp (milliseconds since epoch)
- `v`: State vector (21 integers)

**Properties:**
- Append-only
- One entry per state
- Immutable once written
- Enables complete replay

### agents/{agent}.md

Agent-specific execution logs in Markdown:

```markdown
### 2026-05-14T12:34:56.789Z
Agent: system
Steps: 10
Final State: [0, 1, 2, 3, ..., 4095]

### 2026-05-14T12:35:00.123Z
Agent: system
Steps: 10
Final State: [0, 1, 2, 3, ..., 4095]
```

**Properties:**
- Human-readable
- Agent-specific
- Chronological order
- Useful for debugging

## Implementation Guide

### Modifying State Transition Logic

Edit `lib/existon.ts` → `updateState()` function:

```typescript
export function updateState(prev: StateVector): StateVector {
  // Replace this with your domain-specific logic
  return prev.map(v => Math.max(0, Math.min(4095, v)));
}
```

**Requirements:**
- Must be pure (no side effects)
- Must return valid StateVector
- Must clamp values to [0, 4095]
- Must be deterministic

### Adding Custom Metrics

Use `computeAverage()` and `updateDerivedMetrics()`:

```typescript
export function updateDerivedMetrics(state: StateVector): StateVector {
  const updated = [...state];
  updated[19] = computeAverage(state, [0, 1, 2, ...]);
  updated[20] = computeAverage(state, [12, 13, 14, ...]);
  return updated;
}
```

### Extending Logging

Add custom log entries in `lib/logger.ts`:

```typescript
export async function logCustom(data: any, agent: string): Promise<void> {
  // Your custom logging logic
}
```

## Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
# Test batch endpoint
curl -X POST http://localhost:3000/api/batch \
  -H "Content-Type: application/json" \
  -d '{"steps": 5, "agent": "integration-test"}'

# Verify logs
cat data/water_log.jsonl | tail -5
```

### State Replay

```bash
# Get all states
curl http://localhost:3000/api/batch | jq '.state'

# Reset to specific state
curl -X POST http://localhost:3000/api/batch \
  -H "Content-Type: application/json" \
  -d '{"steps": 1, "seed": [0, 0, ..., 0]}'
```

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

None required for core functionality. Optional:

- `NODE_ENV`: Set to "production" for optimized build
- `LOG_PATH`: Override default log location (default: `./data/water_log.jsonl`)

### Scaling Considerations

- **State persistence**: JSONL log grows linearly with requests
- **Memory**: In-memory state is minimal (21 integers)
- **Concurrency**: Single state machine (not distributed)
- **Logging**: Append-only, suitable for high-throughput scenarios

## Cloning and Extending

### Create a New Project

```bash
# Clone this repository
git clone https://github.com/your-org/lilycaramel-lotus.git my-project
cd my-project

# Install dependencies
npm install

# Modify updateState() in lib/existon.ts
# Modify logging in lib/logger.ts
# Extend API in app/api/batch/route.ts

# Test
npm run dev

# Deploy
npm run build && npm start
```

### Best Practices

1. **Keep core logic pure**: No side effects in `lib/existon.ts`
2. **Preserve determinism**: Same seed → identical output
3. **Document changes**: Update MOTHER_SEED.md if modifying spec
4. **Test thoroughly**: Verify state replay works correctly
5. **Monitor logs**: Check `data/water_log.jsonl` for anomalies

## Troubleshooting

### Logs not appearing

```bash
# Check directory permissions
ls -la data/
ls -la agents/

# Verify API response
curl http://localhost:3000/api/batch
```

### State not persisting

```bash
# Check log file
cat data/water_log.jsonl

# Restart server
npm run dev
```

### Invalid state vector

```bash
# Verify state values are in [0, 4095]
curl http://localhost:3000/api/batch | jq '.state[] | select(. < 0 or . > 4095)'
```

## References

- **MOTHER_SEED.md**: Canonical specification
- **lib/existon.ts**: Core logic with JSDoc
- **lib/logger.ts**: Logging utilities with JSDoc
- **app/api/batch/route.ts**: API endpoints with JSDoc

## License

MIT

## Support

For issues or questions, refer to MOTHER_SEED.md or the inline documentation in source files.

---

**Status**: Production-ready
**Version**: 1.0
**Last Updated**: 2026-05-14
