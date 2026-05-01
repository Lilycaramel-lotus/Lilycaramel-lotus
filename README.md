# LILYCODE / EXISTON

Deterministic causal engine with validation-first execution.

---

## Extended Description

LILYCODE is a deterministic causal execution system designed to eliminate ambiguity, randomness, and uncontrolled state evolution.

The system operates strictly on discrete steps (k), where each state transition is derived solely from the previous validated state. No timing, asynchronous behavior, or probabilistic input is allowed. This ensures that identical initial conditions always produce identical outcomes.

EXISTON (Ξ) defines the canonical unit of existence within the system. A state is considered real only after it has passed validation. Any unvalidated or invalid state is treated as non-existent and is never stored, propagated, or logged.

The system enforces a constrained state space of {+1, 0, -1} and operates over a fixed topology (target: 28-node hex graph). All updates occur synchronously and atomically. There are no partial updates, no side effects, and no external mutation of system state.

Validation is the critical control point. Every transition must be recomputable and verifiable. If validation fails, the system halts or reverts. No silent corrections are permitted.

This architecture is designed to produce a fully reproducible execution model. Given the same seed and topology, the system must produce identical outputs, step-by-step, without deviation.

The repository currently defines the formal specification only. No runtime implementation exists yet. The next phase is to construct a minimal deterministic runtime that enforces the transition rules, validation gate, and execution constraints defined in the specification.

---

## System Definition

LILYCODE defines a step-based execution model where system state is strictly derived, validated, and immutable once accepted.

EXISTON (Ξ) is the canonical unit of validated existence.

---

## Core Model

Ξ_i^k = (k, i, s, v)

- k → discrete step index  
- i → node identifier  
- s ∈ {+1, 0, -1}  
- v = 1 (validated only)  

Rule:

Only validated states exist.  
Unvalidated state does not exist.

---

## Execution Properties

- Deterministic (same seed → identical output)  
- Discrete time (k ∈ ℕ)  
- No randomness  
- No async execution  
- Validation-gated state transitions  
- Fixed execution order  

---

## System Constraints

- State space: {+1, 0, -1}  
- Fixed topology (target: 28 nodes)  
- Synchronous updates only  
- No partial state mutation  
- No external mutation of state  

---

## Architecture Boundary

Core runtime (not yet implemented) will contain:

- transition  
- step  
- validate  
- run  
- replay  

Rules:

- Core must be pure  
- No UI logic  
- No side effects  
- No external dependencies  

---

## Specification

Full system definition:

EXISTON_SPEC.md

This file is the canonical source of truth.

---

## Status

- Specification defined  
- No runtime implemented  
- Determinism not yet proven  
- Validation not yet enforced  
- System not production-safe  

---

## Build Rule

Do NOT build:

- UI  
- APIs  
- Integrations  
- Agents  

Until the following are proven:

- deterministic execution  
- validation gate enforced  
- replay matches execution exactly  

---

## Next Step

Implement minimal deterministic runtime:

- fixed seed  
- pure step()  
- deterministic loop  
- validation gate  

Nothing else.
