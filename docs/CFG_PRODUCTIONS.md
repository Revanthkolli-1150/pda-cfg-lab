# Context-Free Grammar (CFG) Productions Reference

This document provides formal specifications for all context-free grammars implemented across the three case studies in **PDA & CFG LAB**.

---

## 1. Case Study 1: Arithmetic Expression Grammar

### Formal 4-Tuple:
$$G_{\text{arith}} = (V, \Sigma, R, E)$$
- **Variables $V$**: $\{E, T, F\}$
- **Terminals $\Sigma$**: $\{+, -, *, /, (, ), \text{id}, \text{num}\}$
- **Start Symbol**: $E$

### Production Rules $R$:
```
E → E + T
  | E - T
  | T

T → T * F
  | T / F
  | F

F → ( E )
  | id
  | num
```

### Precedence & Associativity Specifications:
| Non-Terminal | Role | Handled Operators | Associativity | Precedence Level |
| :--- | :--- | :--- | :--- | :--- |
| **$E$** (Expression) | Additive operations | `+`, `-` | Left-to-right | Lowest |
| **$T$** (Term) | Multiplicative operations | `*`, `/` | Left-to-right | Higher |
| **$F$** (Factor) | Atomic primaries / Parentheses | `( )`, literals | Non-associative | Highest |

---

## 2. Case Study 2: Balanced Parentheses (Dyck Language $D_1$)

### Formal 4-Tuple:
$$G_{\text{paren}} = (\{S\}, \{(, )\}, R, S)$$

### Production Rules $R$:
```
S → ( S ) S
  | ε
```

### Properties:
- **Language**: $L = \{w \in \{(,)\}^* \mid w \text{ is balanced}\}$
- **Chomsky Type**: Type 2 (Context-Free)
- **Determinism**: Deterministic Context-Free Language (DCFL)
- **Ambiguity**: Unambiguous

---

## 3. Case Study 3: Palindrome Language

### Formal 4-Tuple:
$$G_{\text{pal}} = (\{S\}, \{a, b\}, R, S)$$

### Production Rules $R$:
```
S → a S a
  | b S b
  | a
  | b
  | ε
```

### Properties:
- **Language**: $L = \{w \in \{a,b\}^* \mid w = w^R\}$
- **Chomsky Type**: Type 2 (Context-Free)
- **Determinism**: Nondeterministic (requires NPDA; not a DCFL)
- **Ambiguity**: Unambiguous (every palindrome has a unique center reflection derivation)

---

## 4. Grammar Comparison Table

| Attribute | Arithmetic $G_{\text{arith}}$ | Parentheses $G_{\text{paren}}$ | Palindromes $G_{\text{pal}}$ |
| :--- | :--- | :--- | :--- |
| **Number of Variables** | 3 ($E, T, F$) | 1 ($S$) | 1 ($S$) |
| **Number of Terminals** | 8 | 2 | 2 |
| **Includes $\varepsilon$-productions** | No | Yes ($S \to \varepsilon$) | Yes ($S \to \varepsilon$) |
| **Recursion Type** | Left-recursive ($E \to E+T$) | Mixed ($S \to (S)S$) | Linear centered ($S \to aSa$) |
| **Parser Class** | Recursive Descent / $LR(1)$ | Predictive / $LL(1)$ | Nondeterministic / NPDA |
