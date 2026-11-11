/**
 * Non-deterministic Pushdown Automata (NPDA) Engine
 * Explores multiple execution branches via configuration tree exploration
 */

export class NPDAConfiguration {
  static idCounter = 0;

  /**
   * @param {Object} params
   * @param {string} params.state - Current state q ∈ Q
   * @param {number} params.inputIndex - Current index in input
   * @param {string[]} params.stack - Stack from bottom to top: [Z0, ...]
   * @param {string} params.lastAction - Description of the action taken
   * @param {string} params.ruleApplied - Formal transition rule
   * @param {number|null} params.parentId - ID of parent configuration
   * @param {number} params.depth - Depth in configuration tree
   * @param {string} params.branchLabel - Label e.g. "Guess midpoint at pos 3"
   */
  constructor({
    state,
    inputIndex,
    stack,
    lastAction = 'INITIALIZE',
    ruleApplied = '',
    parentId = null,
    depth = 0,
    branchLabel = 'Root'
  }) {
    this.id = ++NPDAConfiguration.idCounter;
    this.state = state;
    this.inputIndex = inputIndex;
    this.stack = [...stack];
    this.lastAction = lastAction;
    this.ruleApplied = ruleApplied;
    this.parentId = parentId;
    this.depth = depth;
    this.branchLabel = branchLabel;
    this.status = 'ACTIVE'; // 'ACTIVE' | 'ACCEPTED' | 'DEAD_END'
    this.children = [];
    this.historyStep = null;
  }

  get stackTop() {
    return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
  }
}

export class NPDAEngine {
  /**
   * @param {Object} spec
   * @param {string[]} spec.states
   * @param {string[]} spec.inputAlphabet
   * @param {string[]} spec.stackAlphabet
   * @param {string} spec.initialState
   * @param {string} spec.initialStackSymbol
   * @param {string[]} spec.acceptingStates
   * @param {Function} spec.getTransitions - (state, inputChar, stackTop, inputIndex, totalLen) => TransitionOption[]
   */
  constructor(spec) {
    this.spec = spec;
    this.acceptingStates = new Set(spec.acceptingStates);
    this.getTransitions = spec.getTransitions;
  }

  /**
   * Explores all branches of the NPDA on the input string using Breadth-First Search (BFS)
   * to guarantee finding the shortest accepting computation path if one exists.
   * @param {string} inputString
   * @param {number} maxConfigurations - Safety limit to prevent unbounded loops on malformed grammars
   * @returns {Object} Exploration tree, winning path, acceptance status, branch count
   */
  explore(inputString, maxConfigurations = 2000) {
    NPDAConfiguration.idCounter = 0;
    const n = inputString.length;

    const rootConfig = new NPDAConfiguration({
      state: this.spec.initialState,
      inputIndex: 0,
      stack: [this.spec.initialStackSymbol],
      lastAction: 'INITIALIZE',
      ruleApplied: `M starts in state ${this.spec.initialState} with stack [${this.spec.initialStackSymbol}]`,
      parentId: null,
      depth: 0,
      branchLabel: 'Start: q0'
    });

    const allConfigs = new Map();
    allConfigs.set(rootConfig.id, rootConfig);

    const queue = [rootConfig];
    let acceptedLeaf = null;
    let configurationsExplored = 0;
    const deadEnds = [];

    while (queue.length > 0 && configurationsExplored < maxConfigurations) {
      const current = queue.shift();
      configurationsExplored++;

      const isEof = current.inputIndex >= n;
      const currentChar = isEof ? null : inputString[current.inputIndex];
      const stackTop = current.stackTop;

      // Check if current is already in an accepting state and input is exhausted
      if (this.acceptingStates.has(current.state) && isEof && stackTop === this.spec.initialStackSymbol) {
        current.status = 'ACCEPTED';
        if (!acceptedLeaf) {
          acceptedLeaf = current;
        }
        continue;
      }

      // Query possible nondeterministic transitions from this configuration
      const transitions = this.getTransitions(current.state, currentChar, stackTop, current.inputIndex, n);

      if (!transitions || transitions.length === 0) {
        current.status = 'DEAD_END';
        deadEnds.push(current);
        continue;
      }

      for (const t of transitions) {
        const nextStack = [...current.stack];

        // Apply stack change
        if (t.stackAction === 'POP') {
          nextStack.pop();
        } else if (t.stackAction === 'PUSH') {
          for (const s of t.pushSymbols) {
            nextStack.push(s);
          }
        }

        const nextInputIndex = t.consumeInput ? current.inputIndex + 1 : current.inputIndex;

        const childConfig = new NPDAConfiguration({
          state: t.nextState,
          inputIndex: nextInputIndex,
          stack: nextStack,
          lastAction: t.actionName || t.stackAction,
          ruleApplied: t.formula || t.description,
          parentId: current.id,
          depth: current.depth + 1,
          branchLabel: t.branchLabel || `→ ${t.nextState}`
        });

        current.children.push(childConfig.id);
        allConfigs.set(childConfig.id, childConfig);

        // Check immediate acceptance
        if (
          this.acceptingStates.has(childConfig.state) &&
          childConfig.inputIndex >= n &&
          childConfig.stackTop === this.spec.initialStackSymbol
        ) {
          childConfig.status = 'ACCEPTED';
          if (!acceptedLeaf) {
            acceptedLeaf = childConfig;
          }
        }

        queue.push(childConfig);
      }
    }

    // Trace winning path if accepted
    const winningPath = [];
    if (acceptedLeaf) {
      let curr = acceptedLeaf;
      while (curr) {
        winningPath.unshift(curr);
        curr = curr.parentId ? allConfigs.get(curr.parentId) : null;
      }
    }

    // Build representative history steps for winning path or best path
    const pathToTrace = acceptedLeaf ? winningPath : this.getBestFailedPath(rootConfig, allConfigs);
    const traceHistory = pathToTrace.map((cfg, idx) => ({
      step: idx,
      configId: cfg.id,
      state: cfg.state,
      inputIndex: cfg.inputIndex,
      consumed: inputString.slice(0, cfg.inputIndex),
      remaining: inputString.slice(cfg.inputIndex),
      readChar: idx === 0 ? 'START' : (cfg.inputIndex > pathToTrace[idx - 1]?.inputIndex ? inputString[cfg.inputIndex - 1] : 'ε'),
      stackSnapshot: [...cfg.stack],
      stackTop: cfg.stackTop ?? 'EMPTY',
      operation: cfg.lastAction,
      ruleDescription: cfg.ruleApplied,
      status: cfg.status,
      branchLabel: cfg.branchLabel
    }));

    return {
      accepted: acceptedLeaf !== null,
      winningPath,
      traceHistory,
      rootConfig,
      allConfigs: Array.from(allConfigs.values()),
      configurationsExplored,
      totalBranches: allConfigs.size,
      deadEndsCount: deadEnds.length,
      acceptedLeaf
    };
  }

  /**
   * For rejected strings, extracts the longest explored path to show where it failed
   */
  getBestFailedPath(root, allConfigs) {
    let deepest = root;
    for (const cfg of allConfigs.values()) {
      if (cfg.depth > deepest.depth || (cfg.depth === deepest.depth && cfg.inputIndex > deepest.inputIndex)) {
        deepest = cfg;
      }
    }

    const path = [];
    let curr = deepest;
    while (curr) {
      path.unshift(curr);
      curr = curr.parentId ? allConfigs.get(curr.parentId) : null;
    }
    return path;
  }
}
