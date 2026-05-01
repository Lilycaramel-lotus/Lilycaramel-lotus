# LILYCODE / EXISTON

Deterministic causal engine with validation-first execution.

---

## Identity

GitHub: Lilycaramel-lotus  
Repository: Lilycaramel-lotus  
Project: LILYCODE / EXISTON  

---

## Extended Description

LILYCODE is a deterministic execution system designed to produce consistent, repeatable outcomes from a fixed starting state.

The system progresses in discrete steps (k). Each step is computed only from the previous validated state. There is no randomness, no asynchronous behavior, and no external influence on execution.

EXISTON (Ξ) defines the unit of validated existence. A state exists only after it has passed validation. Any invalid or unverified state is rejected and treated as non-existent.

The system operates within a constrained state space {+1, 0, -1} and a fixed node topology (target: 28 nodes). All updates are synchronous. The entire system state is replaced at each step.

The goal is strict reproducibility. Given the same initial state, the system must always produce the same sequence of states without deviation.

This repository currently defines the system at a specification level only. The runtime implementation has not yet been built.

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
