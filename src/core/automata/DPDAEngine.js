/**
 * Deterministic Pushdown Automata (DPDA) Engine
 * Formal model: M = (Q, Σ, Γ, δ, q0, Z0, F)
 */

export class DPDAEngine {
  /**
   * @param {Object} config
   * @param {string[]} config.states - Set of states Q
   * @param {string[]} config.inputAlphabet - Input alphabet Σ
   * @param {string[]} config.stackAlphabet - Stack alphabet Γ
   * @param {string} config.initialState - Start state q0
   * @param {string} config.initialStackSymbol - Initial stack symbol Z0
   * @param {string[]} config.acceptingStates - Set of final states F
   * @param {Function} config.transitionFn - (state, inputSymbol, stackTop) => { nextState, stackAction, pushSymbols, ruleDesc }
   */
  constructor({
    states,
    inputAlphabet,
    stackAlphabet,
    initialState,
    initialStackSymbol = 'Z0',
    acceptingStates,
    transitionFn
  }) {
    this.states = states;
    this.inputAlphabet = inputAlphabet;
    this.stackAlphabet = stackAlphabet;
    this.initialState = initialState;
    this.initialStackSymbol = initialStackSymbol;
    this.acceptingStates = new Set(acceptingStates);
    this.transitionFn = transitionFn;
  }

  /**
   * Runs the DPDA on an input string
   * @param {string} inputString
   * @returns {Object} Full execution trace and result
   */
  execute(inputString) {
    const history = [];
    const stack = [this.initialStackSymbol];
    let currentState = this.initialState;
    let inputCursor = 0;
    const n = inputString.length;

    let step = 0;

    // Record initial configuration
    history.push({
      step: step++,
      state: currentState,
      inputCursor,
      readChar: 'START',
      unconsumedInput: inputString,
      stackSnapshot: [...stack],
      stackTop: stack[stack.length - 1],
      operation: 'INITIALIZE',
      ruleDescription: `Start machine in state ${currentState} with stack [${stack.join(', ')}]`,
      status: 'RUNNING'
    });

    let isAccepted = false;
    let terminationReason = '';

    while (true) {
      const stackTop = stack.length > 0 ? stack[stack.length - 1] : null;
      const currentChar = inputCursor < n ? inputString[inputCursor] : null;

      // Check transition
      const transition = this.transitionFn(currentState, currentChar, stackTop, inputCursor, n);

      if (!transition) {
        // No transition possible: dead end
        if (inputCursor >= n && this.acceptingStates.has(currentState) && stackTop === this.initialStackSymbol) {
          isAccepted = true;
          terminationReason = 'Accepted: Entire input consumed and machine reached accepting state.';
        } else {
          isAccepted = false;
          terminationReason = `Rejected: No valid transition from state '${currentState}' with input '${currentChar ?? 'EOF'}' and stack top '${stackTop ?? 'EMPTY'}'.`;
        }
        break;
      }

      const {
        nextState,
        consumeInput = true,
        stackAction = 'NONE', // 'PUSH' | 'POP' | 'REPLACE' | 'NONE'
        pushSymbols = [],
        ruleDescription = '',
        isAccept = false,
        isReject = false,
        errorMessage = ''
      } = transition;

      const readSymbol = consumeInput ? (currentChar ?? 'ε') : 'ε';
      if (consumeInput && currentChar !== null) {
        inputCursor++;
      }

      // Apply stack operation
      if (stackAction === 'POP') {
        stack.pop();
      } else if (stackAction === 'PUSH') {
        for (const s of pushSymbols) {
          stack.push(s);
        }
      } else if (stackAction === 'REPLACE') {
        stack.pop();
        for (const s of pushSymbols) {
          stack.push(s);
        }
      }

      currentState = nextState;

      const currentStatus = isAccept ? 'ACCEPTED' : (isReject ? 'REJECTED' : 'RUNNING');

      history.push({
        step: step++,
        state: currentState,
        inputCursor,
        readChar: readSymbol,
        unconsumedInput: inputString.slice(inputCursor),
        stackSnapshot: [...stack],
        stackTop: stack[stack.length - 1] ?? 'EMPTY',
        operation: stackAction,
        ruleDescription,
        status: currentStatus,
        errorMessage
      });

      if (isAccept) {
        isAccepted = true;
        terminationReason = ruleDescription || 'Accepted by final state and stack validation.';
        break;
      }

      if (isReject) {
        isAccepted = false;
        terminationReason = errorMessage || ruleDescription || 'Rejected: illegal configuration.';
        break;
      }
    }

    return {
      accepted: isAccepted,
      finalState: currentState,
      finalStack: [...stack],
      inputLength: n,
      consumedLength: inputCursor,
      reason: terminationReason,
      history
    };
  }
}
