# Pushdown Automata (PDA) Transitions Reference

This document catalogs the formal transitions for both the **Deterministic Pushdown Automaton (DPDA)** and the **Nondeterministic Pushdown Automaton (NPDA)** implemented in this laboratory.

---

## 1. Case Study 2: Balanced Parentheses (DPDA)

### Formal 7-Tuple:
$$M_{\text{paren}} = (Q, \Sigma, \Gamma, \delta, q_0, Z_0, F)$$
- $Q = \{q_0, q_{acc}, q_{rej}\}$
- $\Sigma = \{(, )\}$
- $\Gamma = \{Z_0, (\}$
- $q_0 = q_0$
- $Z_0 = Z_0$
- $F = \{q_{acc}\}$

### Complete Transition Table:
| Rule # | Current State | Input Symbol | Stack Top | Next State | Stack Replacement | Stack Operation | Explanation |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | $q_0$ | `(` | $Z_0$ | $q_0$ | $(Z_0$ | **PUSH `(`** | Push first opening parenthesis |
| **2** | $q_0$ | `(` | `(` | $q_0$ | $(($ | **PUSH `(`** | Push nested opening parenthesis |
| **3** | $q_0$ | `)` | `(` | $q_0$ | $\varepsilon$ | **POP `(`** | Match & pop matching opening parenthesis |
| **4** | $q_0$ | `)` | $Z_0$ | $q_{rej}$ | $Z_0$ | **NONE** | Stack Underflow: unmatched `)` (REJECT) |
| **5** | $q_0$ | $\varepsilon$ (EOF) | $Z_0$ | $q_{acc}$ | $Z_0$ | **NONE** | Input consumed and stack clean (ACCEPT) |
| **6** | $q_0$ | $\varepsilon$ (EOF) | `(` | $q_{rej}$ | `(` | **NONE** | Stack Overflow: unclosed `(` remains (REJECT) |

---

## 2. Case Study 3: Palindrome Language (NPDA)

### Formal 7-Tuple:
$$M_{\text{pal}} = (Q, \Sigma, \Gamma, \delta, q_0, Z_0, F)$$
- $Q = \{q_0, q_{push}, q_{comp}, q_{acc}\}$
- $\Sigma = \{a, b\}$
- $\Gamma = \{Z_0, a, b\}$
- $q_0 = q_0$
- $Z_0 = Z_0$
- $F = \{q_{acc}\}$

### Complete Transition Table:
| Rule ID | Current State | Input Symbol | Stack Top | Target Configurations | Category | Description |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **R0** | $q_0$ | $\varepsilon$ | $Z_0$ | $\{(q_{push}, Z_0)\}$ | Initialization | Seed bottom marker $Z_0$ |
| **R1a** | $q_{push}$ | `a` | $X \in \Gamma$ | $\{(q_{push}, aX)\}$ | Push 1st Half | Push symbol `a` onto stack |
| **R1b** | $q_{push}$ | `b` | $X \in \Gamma$ | $\{(q_{push}, bX)\}$ | Push 1st Half | Push symbol `b` onto stack |
| **R2_even** | $q_{push}$ | $\varepsilon$ | $X \in \Gamma$ | $\{(q_{comp}, X)\}$ | Nondeterministic Guess | Guess even midpoint |
| **R2_odd_a** | $q_{push}$ | `a` | $X \in \Gamma$ | $\{(q_{comp}, X)\}$ | Nondeterministic Guess | Guess odd center symbol `a` |
| **R2_odd_b** | $q_{push}$ | `b` | $X \in \Gamma$ | $\{(q_{comp}, X)\}$ | Nondeterministic Guess | Guess odd center symbol `b` |
| **R3_match_a** | $q_{comp}$ | `a` | `a` | $\{(q_{comp}, \varepsilon)\}$ | Match & Pop | Pop matching `a` |
| **R3_match_b** | $q_{comp}$ | `b` | `b` | $\{(q_{comp}, \varepsilon)\}$ | Match & Pop | Pop matching `b` |
| **R4_acc** | $q_{comp}$ | $\varepsilon$ (EOF) | $Z_0$ | $\{(q_{acc}, Z_0)\}$ | Acceptance | Stack returns to $Z_0$ |

---

## 3. Comparison of Automata Capabilities

| Feature | DPDA ($M_{\text{paren}}$) | NPDA ($M_{\text{pal}}$) |
| :--- | :--- | :--- |
| **Transitions per Configuration** | Maximum 1 ($\delta: Q \times \dots \to Q \times \Gamma^*$) | Set of options ($\delta: Q \times \dots \to \mathcal{P}(Q \times \Gamma^*)$) |
| **Backtracking Needed** | None (Single line of execution) | Yes (Explores branching tree via BFS) |
| **Midpoint Guessing** | Not needed (Delimiters are explicit) | Crucial (Inherently nondeterministic) |
| **Language Class** | Deterministic CFL (DCFL) | General CFL (CFL \ DCFL) |
