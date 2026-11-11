# PDA & CFG LAB – Interactive Context-Free Grammar and Pushdown Automata Simulator

![FLA Task 3](https://img.shields.io/badge/FLA-Task_3_Assessment-cyan?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Fully_Operational-emerald?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-30%20Passing%20(Vitest)-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

> **Formal Languages and Automata (FLA) Assessment Task 3**  
> An interactive compiler designer, automata simulator, and theoretical computer science laboratory.

---

## 🌟 Executive Overview

**PDA & CFG LAB** is a comprehensive, developer-grade laboratory built to bridge formal language theory with concrete compiler and automata implementations. Rather than presenting static diagrams, this application provides fully functional simulation engines for:

1. **Case Study 1: Arithmetic Expression Parsing**  
   Recursive descent parser, precedence stratification, associativity, concrete parse-tree generation, step-by-step trace logs, leftmost & rightmost derivations, and ambiguity analysis.
2. **Case Study 2: Balanced Parentheses Checking (Dyck Language)**  
   Deterministic Pushdown Automaton (DPDA) with animated physical stack visualization, state transition diagrams, underflow/overflow detection, and formal Dyck CFG derivations.
3. **Case Study 3: Palindrome Language Recognition**  
   Nondeterministic Pushdown Automaton (NPDA) featuring breadth-first configuration exploration, nondeterministic midpoint guessing (odd and even), parallel branch inspection, and winning-path recovery.
4. **Theory & Ambiguity Lab**  
   Side-by-side dual parse-tree generation for ambiguous grammar $E \to E + E \mid E * E \mid \text{id}$, precedence resolution proofs, Chomsky hierarchy, DFA vs DPDA vs NPDA comparative analysis, and Pumping Lemma proofs.

---

## 📸 Screenshots & Interface Design

```
+---------------------------------------------------------------------------------------+
|  [⚡] PDA & CFG LAB v1.0         [Vitest: 30 / 30 Tests Passing]     [Theory & Proofs] |
+---------------------------------------------------------------------------------------+
|  [Sidebar]    |  [Case Study 2: Balanced Parentheses Checking]                        |
|  - Dashboard  |  Status: [● Balanced (Accepted)]                                      |
|  - Arithmetic |-----------------------------------------------------------------------|
|  - Parens     |  Input: [ (()())                                                  ]   |
|  - Palindrome |  Controls: [◀ Step Back] [▶ Play] [Step Fwd ▶] [Speed: 1.0x]          |
|  - Theory     |-----------------------------------------------------------------------|
|               |  [Automata LIFO Stack]       |  [DPDA State Transition Diagram]       |
|               |  Top -> [ ( ]                |        ( (, Z0 -> (Z0 )               |
|               |         [ ( ]                |          +--------+                    |
|               |  Base-> [ Z0 ]               |   ===>   |   q0   | ===> [ q_acc ]     |
|               |  Depth: 3 | Last: PUSH       |          +--------+                    |
|               |-----------------------------------------------------------------------|
|               |  [Transition Table]          |  [Execution History Log]               |
|               |  Rule 2: δ(q0, '(', '(')     |  #1: q0 | Read: '(' | Stack: [Z0, (]   |
+---------------------------------------------------------------------------------------+
```

---

## 🏗️ Project Architecture

```
pda-cfg-lab/
├── docs/                                  # Complete academic documentation suite
│   ├── PROJECT_REPORT.md                  # Comprehensive FLA task 3 technical report
│   ├── CASE_STUDY_1_ARITHMETIC.md         # Arithmetic parser, CFG, precedence specs
│   ├── CASE_STUDY_2_PARENTHESES.md        # DPDA specification & stack trace walkthrough
│   ├── CASE_STUDY_3_PALINDROME.md         # NPDA model, midpoint exploration, proofs
│   ├── CFG_PRODUCTIONS.md                 # Complete grammar productions reference
│   ├── PDA_TRANSITIONS.md                 # DPDA & NPDA transition tables
│   ├── AMBIGUITY_ANALYSIS.md              # Ambiguity proofs & dual parse-tree analysis
│   ├── MODEL_LIMITATIONS.md               # DFA limitations, Pumping Lemma, DPDA ⊊ NPDA
│   └── diagrams/                          # Individual Mermaid diagrams for GitHub rendering
│       ├── case1_arithmetic_cfg.mmd
│       ├── case1_ambiguity_trees.mmd
│       ├── case2_parentheses_dpda.mmd
│       ├── case2_parentheses_cfg.mmd
│       ├── case3_palindrome_npda.mmd
│       ├── case3_nondeterministic_tree.mmd
│       └── chomsky_automata_hierarchy.mmd
├── src/
│   ├── core/                              # Theoretical engines (No UI dependencies)
│   │   ├── types.js                       # Tokens, TreeNodes, DerivationSteps
│   │   ├── lexer.js                       # Tokenizers for Arithmetic, Dyck, Palindromes
│   │   ├── cfg/                           # CFG Models, Layouts, Derivations
│   │   ├── parsers/                       # Recursive Descent, Ambiguity & CFG Parsers
│   │   └── automata/                      # DPDA & NPDA engines and specifications
│   ├── testcases/                         # Standardized preset test cases
│   ├── components/                        # UI components & visualizers
│   │   ├── layout/                        # Navbar, Sidebar
│   │   ├── visualizers/                   # Stack, State Diagram, Parse Tree, Derivations
│   │   ├── common/                        # Controls, Presets, Grammar Cards
│   │   └── modules/                       # 4 Main Laboratory Views
│   ├── tests/                             # Vitest unit test suite (30 automated tests)
│   ├── App.jsx                            # Main application controller
│   └── index.css                          # Dark compiler theme & custom typography
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🚀 Installation & Local Execution

### Prerequisites:
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher) or **pnpm** / **yarn**

### 1. Clone the repository:
```bash
git clone https://github.com/your-username/pda-cfg-lab.git
cd pda-cfg-lab
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Run the automated test suite:
```bash
npm test
```
*Executes all 30 Vitest unit tests verifying lexing, parsing, DPDA execution, NPDA branching, and ambiguity resolution.*

### 4. Start the interactive development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production:
```bash
npm run build
```

---

## 🧪 Automated Test Suite (Vitest)

All 30 unit tests pass across 5 test suites:

```bash
 ✓ src/tests/lexer.test.js (7 tests)
 ✓ src/tests/ambiguity.test.js (2 tests)
 ✓ src/tests/arithmeticParser.test.js (4 tests)
 ✓ src/tests/palindromeNPDA.test.js (9 tests)
 ✓ src/tests/parenthesesPDA.test.js (8 tests)

 Test Files  5 passed (5)
      Tests  30 passed (30)
```

Every test case is runnable both through `npm test` and interactively through the application UI with preset buttons.

---

## 🔬 Theoretical Foundations Implemented

### 1. Case Study 1: Stratified Arithmetic CFG
- Nonterminal hierarchy:
  $$E \to E + T \mid E - T \mid T$$
  $$T \to T * F \mid T / F \mid F$$
  $$F \to (E) \mid \text{id} \mid \text{num}$$
- Solves classical ambiguity: proves that ambiguous grammar $E \to E + E \mid E * E \mid \text{id}$ yields two trees for `id + id * id`, whereas stratified precedence forces a unique tree and left-to-right evaluation.

### 2. Case Study 2: Dyck Language DPDA
- Single-state deterministic pushdown automaton:
  $$\delta(q_0, '(', Z_0) = (q_0, (Z_0), \quad \delta(q_0, ')', '(') = (q_0, \varepsilon)$$
- Detects stack underflow ($\delta(q_0, ')', Z_0) \to q_{rej}$) and stack overflow ($\delta(q_0, \varepsilon, '(') \to q_{rej}$).

### 3. Case Study 3: Palindromes NPDA
- Non-deterministic midpoint guessing for $L = \{w \in \{a,b\}^* \mid w = w^R\}$:
  - Even length: $\delta(q_{push}, \varepsilon, X) \ni (q_{comp}, X)$
  - Odd length: $\delta(q_{push}, a, X) \ni (q_{comp}, X)$
- Configuration tree explorer maintains parallel execution branches and isolates the winning path.

### 4. Determinism Boundary ($\text{DPDA} \subsetneq \text{NPDA}$)
- Formal demonstration of why palindromes without center markers cannot be recognized by any DPDA.
- Pumping Lemma proof showing why finite memory ($O(1)$) in DFAs cannot recognize unbounded nested parentheses or palindromes.

---

## 📄 Documentation Sitemap

Detailed academic write-ups and formal diagrams are available in the [`docs/`](./docs) directory:
- [Project Report](./docs/PROJECT_REPORT.md)
- [Case Study 1: Arithmetic Expression Parser](./docs/CASE_STUDY_1_ARITHMETIC.md)
- [Case Study 2: Balanced Parentheses DPDA](./docs/CASE_STUDY_2_PARENTHESES.md)
- [Case Study 3: Palindrome NPDA](./docs/CASE_STUDY_3_PALINDROME.md)
- [CFG Productions Reference](./docs/CFG_PRODUCTIONS.md)
- [PDA Transitions Reference](./docs/PDA_TRANSITIONS.md)
- [Ambiguity Analysis](./docs/AMBIGUITY_ANALYSIS.md)
- [Model Limitations & Pumping Lemma Proofs](./docs/MODEL_LIMITATIONS.md)
- [Mermaid Diagrams](./docs/diagrams)

---

## 🎓 University Assessment Details
- **Subject**: Formal Languages and Automata (FLA)
- **Assignment**: Assessment Task 3
- **Repository Name**: `pda-cfg-lab`
