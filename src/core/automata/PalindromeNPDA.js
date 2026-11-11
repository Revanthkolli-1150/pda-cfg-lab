import { NPDAEngine } from './NPDAEngine.js';

export const PALINDROME_FORMAL_SPEC = {
  states: ['q0', 'q_push', 'q_comp', 'q_acc'],
  inputAlphabet: ['a', 'b'],
  stackAlphabet: ['Z0', 'a', 'b'],
  initialState: 'q0',
  initialStackSymbol: 'Z0',
  acceptingStates: ['q_acc'],
  rules: [
    {
      id: 'R0',
      from: 'q0',
      input: 'ε',
      stackTop: 'Z0',
      to: 'q_push',
      action: 'NONE',
      formula: 'δ(q0, ε, Z0) = {(q_push, Z0)}',
      desc: 'Initialize machine with stack bottom marker Z0, enter push mode.'
    },
    {
      id: 'R1a',
      from: 'q_push',
      input: 'a',
      stackTop: '*',
      to: 'q_push',
      action: 'PUSH a',
      formula: 'δ(q_push, a, X) ∋ (q_push, aX)',
      desc: 'Continue first half: read "a" and push onto stack.'
    },
    {
      id: 'R1b',
      from: 'q_push',
      input: 'b',
      stackTop: '*',
      to: 'q_push',
      action: 'PUSH b',
      formula: 'δ(q_push, b, X) ∋ (q_push, bX)',
      desc: 'Continue first half: read "b" and push onto stack.'
    },
    {
      id: 'R2_even',
      from: 'q_push',
      input: 'ε',
      stackTop: '*',
      to: 'q_comp',
      action: 'NONE',
      formula: 'δ(q_push, ε, X) ∋ (q_comp, X)',
      desc: 'Nondeterministic Guess: Even-length midpoint reached. Switch to comparison mode without consuming input.'
    },
    {
      id: 'R2_odd_a',
      from: 'q_push',
      input: 'a',
      stackTop: '*',
      to: 'q_comp',
      action: 'NONE',
      formula: 'δ(q_push, a, X) ∋ (q_comp, X)',
      desc: 'Nondeterministic Guess: Odd-length center symbol "a". Consume "a" without pushing and switch to comparison.'
    },
    {
      id: 'R2_odd_b',
      from: 'q_push',
      input: 'b',
      stackTop: '*',
      to: 'q_comp',
      action: 'NONE',
      formula: 'δ(q_push, b, X) ∋ (q_comp, X)',
      desc: 'Nondeterministic Guess: Odd-length center symbol "b". Consume "b" without pushing and switch to comparison.'
    },
    {
      id: 'R3_match_a',
      from: 'q_comp',
      input: 'a',
      stackTop: 'a',
      to: 'q_comp',
      action: 'POP',
      formula: 'δ(q_comp, a, a) = {(q_comp, ε)}',
      desc: 'Second half match: read "a", matches stack top "a", pop.'
    },
    {
      id: 'R3_match_b',
      from: 'q_comp',
      input: 'b',
      stackTop: 'b',
      to: 'q_comp',
      action: 'POP',
      formula: 'δ(q_comp, b, b) = {(q_comp, ε)}',
      desc: 'Second half match: read "b", matches stack top "b", pop.'
    },
    {
      id: 'R4_accept',
      from: 'q_comp',
      input: 'ε (EOF)',
      stackTop: 'Z0',
      to: 'q_acc',
      action: 'NONE',
      formula: 'δ(q_comp, ε, Z0) = {(q_acc, Z0)}',
      desc: 'Acceptance: Input consumed and stack contains only Z0. String is a palindrome!'
    }
  ]
};

export class PalindromeNPDA {
  constructor() {
    this.engine = new NPDAEngine({
      states: PALINDROME_FORMAL_SPEC.states,
      inputAlphabet: PALINDROME_FORMAL_SPEC.inputAlphabet,
      stackAlphabet: PALINDROME_FORMAL_SPEC.stackAlphabet,
      initialState: PALINDROME_FORMAL_SPEC.initialState,
      initialStackSymbol: PALINDROME_FORMAL_SPEC.initialStackSymbol,
      acceptingStates: PALINDROME_FORMAL_SPEC.acceptingStates,
      getTransitions: this.getTransitions.bind(this)
    });
  }

  /**
   * Returns all possible nondeterministic branches from the current configuration
   */
  getTransitions(state, currentChar, stackTop, inputIndex, totalLen) {
    const options = [];

    // State q0: Start state immediately transitions to q_push
    if (state === 'q0') {
      options.push({
        nextState: 'q_push',
        consumeInput: false,
        stackAction: 'NONE',
        pushSymbols: [],
        actionName: 'INIT',
        branchLabel: 'q0 → q_push',
        formula: 'δ(q0, ε, Z0) = {(q_push, Z0)}',
        description: 'Initialize machine and enter push mode.'
      });
      return options;
    }

    // State q_push: reading and pushing first half, with nondeterministic midpoint guesses
    if (state === 'q_push') {
      // 1. Branch A: Even-length midpoint guess (ε transition to q_comp)
      options.push({
        nextState: 'q_comp',
        consumeInput: false,
        stackAction: 'NONE',
        pushSymbols: [],
        actionName: 'GUESS_EVEN_MID',
        branchLabel: `Guess Even Mid at index ${inputIndex}`,
        formula: 'δ(q_push, ε, X) ∋ (q_comp, X)',
        description: `Nondeterministic guess: Even midpoint at index ${inputIndex}. Transition to q_comp without reading.`
      });

      // If we have characters to read
      if (currentChar !== null) {
        // Validate alphabet Σ = {a, b}
        if (currentChar !== 'a' && currentChar !== 'b') {
          return []; // Alphabet error, branch dies immediately
        }

        // 2. Branch B: Continue pushing current character (stay in q_push)
        options.push({
          nextState: 'q_push',
          consumeInput: true,
          stackAction: 'PUSH',
          pushSymbols: [currentChar],
          actionName: `PUSH ${currentChar}`,
          branchLabel: `Push '${currentChar}'`,
          formula: `δ(q_push, '${currentChar}', '${stackTop}') ∋ (q_push, '${currentChar}${stackTop}')`,
          description: `Push '${currentChar}' onto stack and continue reading first half.`
        });

        // 3. Branch C: Odd-length midpoint guess (consume center character and transition to q_comp)
        options.push({
          nextState: 'q_comp',
          consumeInput: true,
          stackAction: 'NONE',
          pushSymbols: [],
          actionName: `GUESS_ODD_MID (${currentChar})`,
          branchLabel: `Guess Odd Mid '${currentChar}' at index ${inputIndex}`,
          formula: `δ(q_push, '${currentChar}', '${stackTop}') ∋ (q_comp, '${stackTop}')`,
          description: `Nondeterministic guess: '${currentChar}' at index ${inputIndex} is odd center. Consume without pushing.`
        });
      }

      return options;
    }

    // State q_comp: comparison and pop mode
    if (state === 'q_comp') {
      // Check acceptance when input is exhausted
      if (currentChar === null) {
        if (stackTop === 'Z0') {
          options.push({
            nextState: 'q_acc',
            consumeInput: false,
            stackAction: 'NONE',
            pushSymbols: [],
            actionName: 'ACCEPT',
            branchLabel: 'Accept: q_comp → q_acc',
            formula: 'δ(q_comp, ε, Z0) = {(q_acc, Z0)}',
            description: 'All input consumed and stack matched back to Z0. ACCEPT!'
          });
        }
        return options;
      }

      // Check matching second-half symbol with stack top
      if (currentChar === 'a' && stackTop === 'a') {
        options.push({
          nextState: 'q_comp',
          consumeInput: true,
          stackAction: 'POP',
          pushSymbols: [],
          actionName: 'POP a',
          branchLabel: "Match & Pop 'a'",
          formula: "δ(q_comp, 'a', 'a') = {(q_comp, ε)}",
          description: "Matched input 'a' with top of stack 'a'. Pop."
        });
      } else if (currentChar === 'b' && stackTop === 'b') {
        options.push({
          nextState: 'q_comp',
          consumeInput: true,
          stackAction: 'POP',
          pushSymbols: [],
          actionName: 'POP b',
          branchLabel: "Match & Pop 'b'",
          formula: "δ(q_comp, 'b', 'b') = {(q_comp, ε)}",
          description: "Matched input 'b' with top of stack 'b'. Pop."
        });
      } else {
        // Mismatch! e.g. input is 'a' but stack has 'b' or Z0.
        // In formal automata theory, there is no transition defined, so this branch dies.
      }

      return options;
    }

    return options;
  }

  run(input) {
    return this.engine.explore(input);
  }
}
