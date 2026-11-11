/**
 * Core Data Structures and Type Definitions for CFG & PDA LAB
 */

export const TokenType = {
  ID: 'ID',
  NUM: 'NUM',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  STAR: 'STAR',
  SLASH: 'SLASH',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  CHAR_A: 'CHAR_A',
  CHAR_B: 'CHAR_B',
  EOF: 'EOF',
  INVALID: 'INVALID'
};

export class Token {
  /**
   * @param {string} type
   * @param {string} value
   * @param {number} start
   * @param {number} end
   * @param {number} line
   * @param {number} col
   */
  constructor(type, value, start, end, line = 1, col = start + 1) {
    this.type = type;
    this.value = value;
    this.start = start;
    this.end = end;
    this.line = line;
    this.col = col;
  }
}

export class TreeNode {
  static idCounter = 0;

  /**
   * @param {string} label
   * @param {string} type - 'nonterminal' | 'terminal' | 'epsilon'
   * @param {Array<TreeNode>} children
   * @param {Object} metadata
   */
  constructor(label, type = 'nonterminal', children = [], metadata = {}) {
    this.id = `node-${++TreeNode.idCounter}`;
    this.label = label;
    this.type = type; // 'nonterminal', 'terminal', 'epsilon'
    this.children = children;
    this.metadata = metadata;
    this.x = 0;
    this.y = 0;
  }

  addChild(node) {
    this.children.push(node);
    return node;
  }

  toJSON() {
    return {
      id: this.id,
      label: this.label,
      type: this.type,
      metadata: this.metadata,
      children: this.children.map(c => c.toJSON())
    };
  }
}

export class DerivationStep {
  /**
   * @param {number} stepNumber
   * @param {string} sententialForm
   * @param {string} appliedRule
   * @param {number} replacedIndex
   * @param {string} replacedSymbol
   * @param {string} expansion
   */
  constructor(stepNumber, sententialForm, appliedRule = '', replacedIndex = -1, replacedSymbol = '', expansion = '') {
    this.stepNumber = stepNumber;
    this.sententialForm = sententialForm;
    this.appliedRule = appliedRule;
    this.replacedIndex = replacedIndex;
    this.replacedSymbol = replacedSymbol;
    this.expansion = expansion;
  }
}
