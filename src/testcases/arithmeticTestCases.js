export const ARITHMETIC_TEST_CASES = [
  // Accepted test cases
  {
    id: 'a1',
    category: 'accepted',
    input: 'id + id * id',
    name: 'Precedence Baseline (Multiplication over Addition)',
    description: 'Classic expression showing * binds tighter than +: evaluates as id + (id * id).'
  },
  {
    id: 'a2',
    category: 'accepted',
    input: '(id + id) * id',
    name: 'Parenthesized Precedence Override',
    description: 'Parentheses override default precedence, forcing addition before multiplication.'
  },
  {
    id: 'a3',
    category: 'accepted',
    input: '10 + 20 * 30 - 40 / 2',
    name: 'Full Numeric Mixed Operators',
    description: 'Combines all four arithmetic operations (+, -, *, /) with numeric literals.'
  },
  {
    id: 'a4',
    category: 'accepted',
    input: '((a + b) * (c - d)) / e',
    name: 'Nested Parentheses & Multi-level Factors',
    description: 'Deep nested factors testing recursive descent parenthesis matching and tree depth.'
  },
  {
    id: 'a5',
    category: 'accepted',
    input: 'x',
    name: 'Minimal Single Identifier',
    description: 'Single identifier leaf token validating base factor derivation F → id.'
  },
  {
    id: 'a6',
    category: 'accepted',
    input: 'a + b + c + d',
    name: 'Left-Associativity Chain',
    description: 'Successive additions validating strict left-associative tree grouping: (((a+b)+c)+d).'
  },

  // Rejected test cases
  {
    id: 'r1',
    category: 'rejected',
    input: 'id + * id',
    name: 'Consecutive Operators (Missing Operand)',
    description: 'Two binary operators (+ and *) adjacent with no operand between them.'
  },
  {
    id: 'r2',
    category: 'rejected',
    input: '(id + id',
    name: 'Unclosed Opening Parenthesis',
    description: 'Opening parenthesis without corresponding closing delimiter.'
  },
  {
    id: 'r3',
    category: 'rejected',
    input: 'id + id)',
    name: 'Stray Closing Parenthesis',
    description: 'Closing parenthesis with no matching opening delimiter.'
  },
  {
    id: 'r4',
    category: 'rejected',
    input: '+ id * id',
    name: 'Leading Binary Operator',
    description: 'Expression begins with binary addition operator with missing left operand.'
  },
  {
    id: 'r5',
    category: 'rejected',
    input: 'id + id *',
    name: 'Trailing Binary Operator',
    description: 'Expression terminates prematurely with a trailing multiplication operator.'
  },
  {
    id: 'r6',
    category: 'rejected',
    input: 'id + @num',
    name: 'Illegal Lexical Symbol',
    description: 'Contains character @ which is not in the terminal alphabet.'
  }
];
