import { DPDAEngine } from './DPDAEngine.js';

export const PARENTHESES_FORMAL_SPEC = {
  states: ['q0', 'q_acc', 'q_rej'],
  inputAlphabet: ['(', ')'],
  stackAlphabet: ['Z0', '('],
  initialState: 'q0',
  initialStackSymbol: 'Z0',
  acceptingStates: ['q_acc'],
  transitions: [
    {
      id: 1,
      from: 'q0',
      input: '(',
      stackTop: 'Z0',
      to: 'q0',
      stackAction: 'PUSH (',
      formula: 'δ(q0, "(", Z0) = (q0, (Z0)',
      explanation: 'Encountered first opening parenthesis. Push "(" on top of initial marker Z0.'
    },
    {
      id: 2,
      from: 'q0',
      input: '(',
      stackTop: '(',
      to: 'q0',
      stackAction: 'PUSH (',
      formula: 'δ(q0, "(", "(") = (q0, (("(")',
      explanation: 'Encountered nested opening parenthesis. Push another "(" onto stack.'
    },
    {
      id: 3,
      from: 'q0',
      input: ')',
      stackTop: '(',
      to: 'q0',
      stackAction: 'POP (',
      formula: 'δ(q0, ")", "(") = (q0, ε)',
      explanation: 'Encountered closing parenthesis matching top "(". Pop "(" from stack.'
    },
    {
      id: 4,
      from: 'q0',
      input: ')',
      stackTop: 'Z0',
      to: 'q_rej',
      stackAction: 'NONE (Reject)',
      formula: 'δ(q0, ")", Z0) = (q_rej, Z0)',
      explanation: 'ERROR: Encountered closing parenthesis ")" while top is Z0 (Stack Underflow / unmatched ")").'
    },
    {
      id: 5,
      from: 'q0',
      input: 'ε (EOF)',
      stackTop: 'Z0',
      to: 'q_acc',
      stackAction: 'NONE (Accept)',
      formula: 'δ(q0, ε, Z0) = (q_acc, Z0)',
      explanation: 'SUCCESS: Input exhausted and stack restored to Z0. Transition to accepting state q_acc.'
    },
    {
      id: 6,
      from: 'q0',
      input: 'ε (EOF)',
      stackTop: '(',
      to: 'q_rej',
      stackAction: 'NONE (Reject)',
      formula: 'δ(q0, ε, "(") = (q_rej, "(")',
      explanation: 'ERROR: Input exhausted but stack still contains unmatched "(" (Stack Overflow / unclosed "(").'
    }
  ]
};

export class ParenthesesPDA {
  constructor() {
    this.engine = new DPDAEngine({
      states: PARENTHESES_FORMAL_SPEC.states,
      inputAlphabet: PARENTHESES_FORMAL_SPEC.inputAlphabet,
      stackAlphabet: PARENTHESES_FORMAL_SPEC.stackAlphabet,
      initialState: PARENTHESES_FORMAL_SPEC.initialState,
      initialStackSymbol: PARENTHESES_FORMAL_SPEC.initialStackSymbol,
      acceptingStates: PARENTHESES_FORMAL_SPEC.acceptingStates,
      transitionFn: this.getTransition.bind(this)
    });
  }

  getTransition(state, currentChar, stackTop, inputCursor, totalLen) {
    if (state === 'q_acc' || state === 'q_rej') {
      return null; // Terminal states
    }

    // Check EOF condition
    if (currentChar === null || inputCursor >= totalLen) {
      if (stackTop === 'Z0') {
        return {
          nextState: 'q_acc',
          consumeInput: false,
          stackAction: 'NONE',
          pushSymbols: [],
          ruleDescription: 'δ(q0, ε, Z0) → (q_acc, Z0): Input consumed and stack returns to initial marker Z0. ACCEPT!',
          isAccept: true
        };
      } else {
        return {
          nextState: 'q_rej',
          consumeInput: false,
          stackAction: 'NONE',
          pushSymbols: [],
          ruleDescription: 'δ(q0, ε, "(") → (q_rej, "("): Input consumed but unclosed "(" remains on stack. REJECT!',
          isReject: true,
          errorMessage: 'Unmatched opening parenthesis remaining on stack at EOF.'
        };
      }
    }

    // Process '('
    if (currentChar === '(') {
      if (stackTop === 'Z0' || stackTop === '(') {
        return {
          nextState: 'q0',
          consumeInput: true,
          stackAction: 'PUSH',
          pushSymbols: ['('],
          ruleDescription: `δ(q0, '(', '${stackTop}') → (q0, ('${stackTop}')): Push '(' onto stack`
        };
      }
    }

    // Process ')'
    if (currentChar === ')') {
      if (stackTop === '(') {
        return {
          nextState: 'q0',
          consumeInput: true,
          stackAction: 'POP',
          pushSymbols: [],
          ruleDescription: "δ(q0, ')', '(') → (q0, ε): Match ')' with stack '(', pop top symbol"
        };
      } else if (stackTop === 'Z0') {
        return {
          nextState: 'q_rej',
          consumeInput: true,
          stackAction: 'NONE',
          pushSymbols: [],
          ruleDescription: "δ(q0, ')', 'Z0') → (q_rej, 'Z0'): Unmatched closing parenthesis ')'! Stack underflow. REJECT!",
          isReject: true,
          errorMessage: `Unmatched closing parenthesis ')' at index ${inputCursor}.`
        };
      }
    }

    // Any invalid symbol not in Σ = { '(', ')' }
    return {
      nextState: 'q_rej',
      consumeInput: true,
      stackAction: 'NONE',
      pushSymbols: [],
      ruleDescription: `Invalid character '${currentChar}' at index ${inputCursor}. Alphabet is Σ = {(, )}.`,
      isReject: true,
      errorMessage: `Alphabet error: '${currentChar}' is not in Σ.`
    };
  }

  run(input) {
    return this.engine.execute(input);
  }
}
