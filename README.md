# LILYCODE / EXISTON

Deterministic causal engine with validation-first execution.

---

## Identity

GitHub: Lilycaramel-lotus  
Repository: Lilycaramel-lotus  
Project: LILYCODE / EXISTON  

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
