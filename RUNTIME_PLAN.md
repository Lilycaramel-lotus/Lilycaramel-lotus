# RUNTIME_DESCRIPTION.md

## System Definition

Deterministic runtime for the LILYCODE / EXISTON system.

A discrete, step-indexed dynamical system over 28 nodes. Each node holds a value in {−1,0,+1}. The system evolves deterministically from an initial state S^0 using a fixed interaction structure G.

At each step, a candidate state is computed, resolved, and verified. A next state exists if and only if it passes verification.

All functions are pure (no side effects). The system is closed. No randomness, external input, or hidden state exists.

---

## 1. Domains

ℕ := {0,1,2,...}

Nodes := {0,1,...,27}

|Nodes| = 28

Value := {−1,0,+1}

X := Value^{28}

max_degree := 6

---

## 2. Representation

S^k : Nodes → Value  
S^k ∈ X  

Index mapping:

∀i ∈ Nodes, index i corresponds to vector position i

---

## 3. Notation

S^k[i] ∈ Value  

|A| = cardinality  

Equality:

S = T ⇔ ∀i, S[i] = T[i]

Logical symbols:

∈, ⊆, ⇔, ∧, ∨, ¬, ∀, ∃, ∃!

---

## 4. Sequence

k ∈ ℕ  

Execution begins at k = 0  

(S^k)_{k=0}^{T}, T ∈ ℕ ∪ {∞}

---

## 5. Initial State

S^0 ∈ X  

S^0 exists without validation  

---

## 6. Topology

G : Nodes → 2^{Nodes}

G is fixed before execution:

∀k, G^k = G

Define:

N(i) := G(i)

---

## 6.1 Canonical Construction

Nodes arranged cyclically modulo 28.

For each i:

N(i) := {
    (i−1) mod 28,
    (i+1) mod 28,
    (i−2) mod 28,
    (i+2) mod 28
}

---

## 6.2 Constraints

∀i:

- N(i) ⊆ Nodes  
- i ∉ N(i)  
- |N(i)| ≤ max_degree  

Symmetry:

∀i,j:

j ∈ N(i) ⇔ i ∈ N(j)

---

## 6.3 Generalization

Any G′ is valid if it satisfies all constraints.

System correctness is invariant under all valid G.

---

## 7. Transition Function

step : (X, G) → X

Total:

∀S ∈ X, step(S,G) ∈ X

Synchronous:

All node updates are computed from S simultaneously.

Definition:

For S ∈ X and i ∈ Nodes:

If N(i) = ∅:

    step(S,G)[i] = 0

Else:

    plus  = |{ j ∈ N(i) : S[j] = +1 }|  
    zero  = |{ j ∈ N(i) : S[j] = 0 }|  
    minus = |{ j ∈ N(i) : S[j] = −1 }|  

    step(S,G)[i] =
        +1 if plus > max(zero, minus)
        −1 if minus > max(plus, zero)
         0 otherwise

Tie definition:

0 otherwise ⇔ no value is strictly greater than both others

---

## 8. Resolver

R : (X, X) → X

Total:

∀S_candidate, S ∈ X, R(S_candidate,S) ∈ X

Definition:

S_next := R(S_candidate, S)

For each i:

    S_next[i] =
        S_candidate[i] if S_candidate[i] ≠ 0
        S[i]           if S_candidate[i] = 0

---

## 9. Validation

validate : (X, X) → {true,false}

Total:

∀S_candidate, S_next ∈ X

Definition:

validate(S_candidate, S_next) = true ⇔

∀i:

    if S_candidate[i] ≠ 0 then
        S_next[i] = S_candidate[i]

Validation is logically redundant under correct implementation of R, but retained as a verification layer.

---

## 10. Evolution Operator

Φ : (X, G) → X

Definition:

Φ(S, G, S_candidate) := R(S_candidate, S)

Execution uses precomputed S_candidate and does not recompute step.

Φ produces candidate state only.

---

## 11. Execution

Given S^k:

S_candidate := step(S^k, G)  
S_next := R(S_candidate, S^k)  

valid := validate(S_candidate, S_next)

If valid:

    S^(k+1) = S_next

Else:

    execution halts at k

---

## 12. Existence

S^0 exists  

∀k:

S^(k+1) exists ⇔ valid = true

---

## 13. Determinism

∀S^0 ∈ X:

∃! sequence (S^k)

---

## 14. Existon

Ξ_i^k := (k, i, S^k[i])

---

## 15. Logging

L := ordered sequence of Ξ_i^k

Completeness:

L contains exactly all Ξ_i^k for all existing states

Ordering:

- primary: ascending k  
- secondary: ascending i  

Uniqueness:

∀(k,i) appears exactly once

Logging occurs immediately after state creation

---

## 16. Replay

Replay(S^0, k) recomputes S^k deterministically

---

## 17. Termination

Execution terminates if:

1. valid = false  
2. S_next = S^k  

Validation failure takes precedence

---

## 18. Fixed Point

S_next = S^k ⇔ stable state

---

## 19. Cycles

A cycle of period p exists if:

∃k, p > 0 such that S^k = S^(k+p)

Since X is finite, execution must eventually reach a fixed point or a cycle.

---

## 20. Immutability

∀k:

S^k is immutable once defined

---

## 21. No Hidden State

S_next = Φ(S^k, G, S_candidate)

¬∃U such that Φ depends on U

---

## 22. Computational Bound

Each step requires O(|Nodes| · max_degree) operations

---

## 23. Function Purity

All functions (step, R, validate, Φ) are pure

Outputs depend only on inputs

---

# =========================
# AGENT LAYERS
# =========================

## Core Runtime

A_transition(S,G) := step(S,G)  
A_resolver(S_candidate,S) := R(S_candidate,S)  
A_validate(S_candidate,S_next) := validate(S_candidate,S_next)  

Execution:

S^k → transition → resolver → validate → commit → log  

---

## Agent Separation

Agents are not inputs to Φ:

Φ depends only on (S, G, S_candidate)

---

## Placeholder Agents

A_j : X → Output_j  

No effect on state  

---

## External Agents

Operate outside runtime  

No influence on execution  

---

## Separation Principle

The runtime is closed and isolated.

External systems cannot affect state evolution.
