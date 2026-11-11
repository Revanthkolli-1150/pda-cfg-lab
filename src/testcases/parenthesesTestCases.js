export const PARENTHESES_TEST_CASES = [
  // Accepted test cases
  {
    id: 'p_acc_1',
    category: 'accepted',
    input: '()',
    name: 'Minimal Balanced Pair',
    description: 'Single pair of matching parentheses: S → ( S ) S with both inner and outer ε.'
  },
  {
    id: 'p_acc_2',
    category: 'accepted',
    input: '(())',
    name: 'Nested Parentheses',
    description: 'Two nested pairs: pushes twice to stack depth 2, then pops sequentially.'
  },
  {
    id: 'p_acc_3',
    category: 'accepted',
    input: '()()()',
    name: 'Sequential Adjacent Pairs',
    description: 'Three consecutive balanced pairs, resetting stack to Z0 after each pair.'
  },
  {
    id: 'p_acc_4',
    category: 'accepted',
    input: '((()()))',
    name: 'Complex Composite Structure',
    description: 'Deep nested structure with both sibling and nested parentheses.'
  },
  {
    id: 'p_acc_5',
    category: 'accepted',
    input: '(()(()))()',
    name: 'Irregular Mixed Nesting',
    description: 'Multi-level nesting followed by an adjacent pair.'
  },
  {
    id: 'p_acc_6',
    category: 'accepted',
    input: '',
    name: 'Empty String (ε)',
    description: 'The empty string is formally in L via production S → ε (stack remains Z0).'
  },

  // Rejected test cases
  {
    id: 'p_rej_1',
    category: 'rejected',
    input: '(',
    name: 'Single Unclosed Opening',
    description: 'Stack overflow at EOF: stack still contains unmatched "(" on top of Z0.'
  },
  {
    id: 'p_rej_2',
    category: 'rejected',
    input: ')',
    name: 'Immediate Underflow (Leading Closing)',
    description: 'Closing ")" encountered while stack top is Z0; immediate underflow rejection.'
  },
  {
    id: 'p_rej_3',
    category: 'rejected',
    input: ')(',
    name: 'Reversed Order',
    description: 'Equal number of opening and closing parentheses, but incorrect nesting order.'
  },
  {
    id: 'p_rej_4',
    category: 'rejected',
    input: '(()))',
    name: 'Closing Exceeds Opening',
    description: 'Two opening parentheses followed by three closing; pops twice then underflows on the 3rd ")".'
  },
  {
    id: 'p_rej_5',
    category: 'rejected',
    input: '((()',
    name: 'Opening Exceeds Closing',
    description: 'Three opening parentheses followed by one closing; two unmatched "(" remain at EOF.'
  },
  {
    id: 'p_rej_6',
    category: 'rejected',
    input: '(()[()])',
    name: 'Illegal Bracket Symbol',
    description: 'Contains character "[" which is not in alphabet Σ = {(, )}.'
  }
];
