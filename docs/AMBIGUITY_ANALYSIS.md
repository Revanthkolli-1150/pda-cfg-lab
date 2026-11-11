# Ambiguity Analysis and Resolution Guide

## 1. What is Grammar Ambiguity?

In formal language theory:
> A context-free grammar $G$ is **ambiguous** if there exists at least one string $w \in L(G)$ that can produce **two or more distinct parse trees**, or equivalently, two or more distinct leftmost derivations.

Ambiguity poses a severe hazard in computer science because a parse tree dictates the semantics (interpretation) of code. When an expression yields two different trees, compilers may evaluate code with conflicting results.

---

## 2. Case Study Demonstration: `id + id * id`

Consider the intuitive grammar:
$$E \to E + E \mid E * E \mid \text{id}$$

String under evaluation:
$$w = \text{id}_1 + \text{id}_2 * \text{id}_3$$

### Parse Tree 1: High Precedence to Addition
- **Root**: $E \to E * E$
- **Left Child**: $E \to E + E \to \text{id}_1 + \text{id}_2$
- **Right Child**: $E \to \text{id}_3$
- **Semantic Grouping**: $(id_1 + id_2) * id_3$
- **Leftmost Derivation**:
  1. $E$
  2. $E * E$ (expanded $E \to E * E$)
  3. $E + E * E$ (expanded left $E \to E + E$)
  4. $\text{id} + E * E$
  5. $\text{id} + \text{id} * E$
  6. $\text{id} + \text{id} * \text{id}$

### Parse Tree 2: High Precedence to Multiplication (Conventional)
- **Root**: $E \to E + E$
- **Left Child**: $E \to \text{id}_1$
- **Right Child**: $E \to E * E \to \text{id}_2 * \text{id}_3$
- **Semantic Grouping**: $id_1 + (id_2 * id_3)$
- **Leftmost Derivation**:
  1. $E$
  2. $E + E$ (expanded $E \to E + E$)
  3. $\text{id} + E$
  4. $\text{id} + E * E$ (expanded right $E \to E * E$)
  5. $\text{id} + \text{id} * E$
  6. $\text{id} + \text{id} * \text{id}$

Both derivations produce the exact same terminal string $\text{id} + \text{id} * \text{id}$, yet they produce **different computational results**:
- Tree 1: $(2 + 3) \times 4 = 20$
- Tree 2: $2 + (3 \times 4) = 14$

---

## 3. Resolving Ambiguity via Stratification

Ambiguity is eliminated by stratifying grammar productions into distinct nonterminals corresponding to operator precedence and associativity:

```
E → E + T | E - T | T   (Level 1: Additive, lowest precedence, left-associative)
T → T * F | T / F | F   (Level 2: Multiplicative, intermediate precedence, left-associative)
F → ( E ) | id | num    (Level 3: Atomic / Parentheses, highest precedence)
```

### Why this resolves ambiguity:
1. An $E$ node cannot directly expand to $*$; it must descend through $T$.
2. Because $T$ is deeper, $*$ binds to factors $F$ before $E$ combines terms with $+$.
3. Left-recursive productions $E \to E + T$ and $T \to T * F$ enforce left-associative grouping ($a - b - c$ is always $((a - b) - c)$).
4. For $\text{id} + \text{id} * \text{id}$, **Tree 2 is the only possible parse tree**.

> **Important Theoretical Note**:
> The underlying arithmetic language was never inherently ambiguous; rather, the initial grammar specification was flawed. After applying precedence stratification, the revised grammar is completely **unambiguous**.
