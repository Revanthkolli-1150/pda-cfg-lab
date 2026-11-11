/**
 * Formal Context-Free Grammar Definition G = (V, Σ, R, S)
 */
export class ProductionRule {
  /**
   * @param {string} head - Non-terminal on LHS (e.g., 'E')
   * @param {string[]} body - Array of symbols on RHS (e.g., ['E', '+', 'T'] or ['ε'])
   * @param {number} id - Unique identifier
   */
  constructor(head, body, id = 0) {
    this.head = head;
    this.body = body;
    this.id = id;
  }

  toString() {
    return `${this.head} → ${this.body.join(' ')}`;
  }
}

export class Grammar {
  /**
   * @param {string} name
   * @param {string[]} variables - Set of Non-terminals V
   * @param {string[]} terminals - Set of Terminals Σ
   * @param {string} startSymbol - Start variable S ∈ V
   * @param {ProductionRule[]} productions - Production rules R
   * @param {string} description
   */
  constructor(name, variables, terminals, startSymbol, productions = [], description = '') {
    this.name = name;
    this.variables = new Set(variables);
    this.terminals = new Set(terminals);
    this.startSymbol = startSymbol;
    this.productions = productions;
    this.description = description;
  }

  isVariable(symbol) {
    return this.variables.has(symbol);
  }

  isTerminal(symbol) {
    return this.terminals.has(symbol);
  }

  getProductionsFor(variable) {
    return this.productions.filter(p => p.head === variable);
  }

  /**
   * Format the grammar for display
   */
  formatProductions() {
    const grouped = new Map();
    for (const rule of this.productions) {
      if (!grouped.has(rule.head)) {
        grouped.set(rule.head, []);
      }
      grouped.get(rule.head).push(rule.body.join(' '));
    }

    const lines = [];
    for (const [head, bodies] of grouped.entries()) {
      lines.push(`${head} → ${bodies.join(' | ')}`);
    }
    return lines;
  }
}
