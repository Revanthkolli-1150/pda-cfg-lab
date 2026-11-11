export const PALINDROME_TEST_CASES = [
  // Accepted test cases
  {
    id: 'pal_acc_1',
    category: 'accepted',
    input: 'abba',
    name: 'Even-Length Palindrome (abba)',
    description: 'Pushes "a" then "b", nondeterministically branches ε to q_comp at center, matches & pops "b", then "a".'
  },
  {
    id: 'pal_acc_2',
    category: 'accepted',
    input: 'aba',
    name: 'Odd-Length Palindrome (aba)',
    description: 'Pushes "a", nondeterministically guesses "b" as odd center symbol, pops "a" to match.'
  },
  {
    id: 'pal_acc_3',
    category: 'accepted',
    input: 'a',
    name: 'Single Character Palindrome',
    description: 'Minimal odd palindrome of length 1: guesses "a" as center symbol.'
  },
  {
    id: 'pal_acc_4',
    category: 'accepted',
    input: 'ababbaba',
    name: 'Complex Even Palindrome',
    description: '8-character even palindrome testing deep stack and exact midpoint branch detection.'
  },
  {
    id: 'pal_acc_5',
    category: 'accepted',
    input: 'baabaab',
    name: 'Complex Odd Palindrome',
    description: '7-character odd palindrome with center symbol "a" flanked by "baab".'
  },
  {
    id: 'pal_acc_6',
    category: 'accepted',
    input: '',
    name: 'Empty String (ε)',
    description: 'Formally in L via S → ε: zero symbols pushed, immediately transitions to q_comp and q_acc.'
  },

  // Rejected test cases
  {
    id: 'pal_rej_1',
    category: 'rejected',
    input: 'ab',
    name: 'Asymmetric 2-Char String',
    description: 'First half "a" cannot match second half "b". All midpoint guesses fail.'
  },
  {
    id: 'pal_rej_2',
    category: 'rejected',
    input: 'aab',
    name: 'Near-Match Odd String',
    description: 'Center "a" leaves "a" vs "b" mismatch between outer symbols.'
  },
  {
    id: 'pal_rej_3',
    category: 'rejected',
    input: 'bbaa',
    name: 'Transposed Halves',
    description: 'Contains equal count of "a" and "b" but incorrect reflection order.'
  },
  {
    id: 'pal_rej_4',
    category: 'rejected',
    input: 'abaa',
    name: 'Trailing Extra Symbol',
    description: 'Length 4 string with asymmetric prefix and suffix.'
  },
  {
    id: 'pal_rej_5',
    category: 'rejected',
    input: 'abbabb',
    name: 'Repeated Word (Not Palindrome)',
    description: 'String of form ww instead of ww^R: cannot be popped in reverse order.'
  },
  {
    id: 'pal_rej_6',
    category: 'rejected',
    input: 'abcba',
    name: 'Illegal Alphabet Symbol',
    description: 'Contains character "c" which is outside the formal alphabet Σ = {a, b}.'
  }
];
