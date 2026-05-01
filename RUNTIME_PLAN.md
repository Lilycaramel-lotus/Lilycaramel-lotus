# RUNTIME_PLAN.md

## Initialization

Initial state S^0 must satisfy:

- length = n  
- values ∈ {+1, 0, -1}  

Optional:

- derived from fixed seed  

Rule:

Same seed → identical S^0

---

## Topology Invariant

- Topology is immutable  
- Neighbor mapping must not change  

Rule:

Topology hash must remain constant across execution

---

## Transition Function

step(S^k) → S^(k+1)_candidate

For each node i:

1. Read neighbors N(i)

2. Count:
   - plus (+1)
   - zero (0)
   - minus (-1)

3. Apply rule:

- if plus > zero AND plus > minus → +1  
- if minus > plus AND minus > zero → -1  
- otherwise → 0  

---

## Execution Order

- Nodes processed in fixed index order (0 → n-1)  
- Order must never change  

---

## Step Execution

Rules:

- No mutation of S^k  
- Compute full S^(k+1)_candidate first  
- Replace state atomically  

---

## Validation Gate

validate(S^k, S^(k+1)_candidate) → boolean

Must check:

### 1. Size Integrity
- length(S^(k+1)) == length(S^k)

### 2. Domain Integrity
- all values ∈ {+1, 0, -1}

### 3. Rule Integrity
- recompute step(S^k)  
- result must match candidate exactly  

### 4. Topology Integrity
- neighbor structure unchanged  

---

## Execution Loop

for k = 1 → N:

1. candidate = step(S^k)

2. if validate(S^k, candidate) == false → STOP

3. log(candidate)

4. S^(k+1) = candidate

---

## Logging

Log only validated states.

Structure:

(k, node, state, valid=1)

Rules:

- Append-only  
- No raw state logs  
- No invalid entries  

---

## Deduplication

Each entry must be unique:

Key = (k, node)

If duplicate detected:

- throw error  
- halt or reject write  

---

## Replay System

replay(S^0, steps)

Process:

1. Start from S^0  
2. Recompute each step  
3. Compare with stored results  

Rule:

Replay must match exactly  

---

## Failure Handling

If validation fails:

- STRICT MODE → halt execution immediately  
- SAFE MODE → revert to S^k  

Rules:

- No silent correction  
- No partial acceptance  

---

## Determinism Enforcement

System must guarantee:

- No Math.random()  
- No time-based functions  
- No async scheduling  
- No concurrency  
- No external inputs  

---

## Concurrency Constraints

- Single-threaded execution  
- No shared mutable state  
- Immutable state per step  

---

## Runtime Boundary

Core runtime includes:

- step()  
- validate()  
- run()  
- replay()  

Must be:

- pure  
- no side effects  
- no external dependencies  

---

## Outputs

System produces:

- final state S^k  
- full existon log  
- validation status  

---

## Verification Requirements

Must pass:

1. Same seed → identical output  
2. Invalid step → rejected  
3. Replay == execution  
4. No duplicate logs  
5. Topology hash constant  

---

## Non-Goals

Do NOT include:

- UI  
- React  
- APIs  
- External integrations  
- Visualization  

---

## Rule

Do NOT implement runtime until:

- determinism is proven in plan  
- validation rules are fully defined  
- replay guarantees are clear
