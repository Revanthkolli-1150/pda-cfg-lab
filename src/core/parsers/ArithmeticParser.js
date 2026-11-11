import { TreeNode } from '../types.js';
import { Lexer } from '../lexer.js';
import { TokenType } from '../types.js';
import { ParseTree } from '../cfg/ParseTree.js';
import { DerivationEngine } from '../cfg/DerivationEngine.js';

export class ArithmeticParser {
  /**
   * @param {string} input
   */
  constructor(input) {
    this.rawInput = input;
    const { tokens, errors } = Lexer.tokenizeArithmetic(input);
    this.tokens = tokens;
    this.lexErrors = errors;
    this.cursor = 0;
    this.parseSteps = [];
    this.errors = [...errors];
  }

  currentToken() {
    return this.tokens[this.cursor] || this.tokens[this.tokens.length - 1];
  }

  peek() {
    return this.tokens[this.cursor] ? this.tokens[this.cursor].type : TokenType.EOF;
  }

  match(...expectedTypes) {
    const curr = this.currentToken();
    if (expectedTypes.includes(curr.type)) {
      this.cursor++;
      return curr;
    }
    return null;
  }

  logStep(action, symbol, detail = '') {
    this.parseSteps.push({
      step: this.parseSteps.length + 1,
      action,
      symbol,
      cursor: this.cursor,
      currentToken: this.currentToken()?.value || '$',
      detail,
      remainingTokens: this.tokens.slice(this.cursor).map(t => t.value).join(' ')
    });
  }

  /**
   * Main entry point to parse the expression
   */
  parse() {
    if (this.lexErrors.length > 0) {
      return {
        success: false,
        tree: null,
        errors: this.lexErrors,
        steps: this.parseSteps,
        leftmostDerivation: [],
        rightmostDerivation: []
      };
    }

    if (this.tokens.length === 1 && this.tokens[0].type === TokenType.EOF) {
      return {
        success: false,
        tree: null,
        errors: ['Empty expression: expected identifier, number or parenthesis.'],
        steps: [],
        leftmostDerivation: [],
        rightmostDerivation: []
      };
    }

    try {
      this.logStep('ENTER', 'E', 'Begin parsing start symbol E');
      const root = this.parseE();

      if (this.peek() !== TokenType.EOF) {
        const unexpected = this.currentToken();
        throw new Error(`Unexpected token '${unexpected.value}' at column ${unexpected.col}. Expected operator or end of expression.`);
      }

      this.logStep('ACCEPT', 'E', 'Expression successfully parsed');

      const parseTree = new ParseTree(root);
      const leftmost = DerivationEngine.generateLeftmostDerivation(root);
      const rightmost = DerivationEngine.generateRightmostDerivation(root);

      return {
        success: true,
        tree: parseTree,
        rootNode: root,
        errors: [],
        steps: this.parseSteps,
        leftmostDerivation: leftmost,
        rightmostDerivation: rightmost
      };
    } catch (err) {
      this.errors.push(err.message);
      this.logStep('REJECT', 'ERROR', err.message);
      return {
        success: false,
        tree: null,
        rootNode: null,
        errors: this.errors,
        steps: this.parseSteps,
        leftmostDerivation: [],
        rightmostDerivation: []
      };
    }
  }

  /**
   * E → E + T | E - T | T
   */
  parseE() {
    this.logStep('CALL', 'E', 'Parsing Expression E');
    let firstT = this.parseT();

    // Wrap single T into E → T
    let currentENode = new TreeNode('E', 'nonterminal', [firstT], { rule: 'E → T' });

    while (this.peek() === TokenType.PLUS || this.peek() === TokenType.MINUS) {
      const opToken = this.currentToken();
      this.cursor++;
      this.logStep('MATCH', opToken.value, `Matched operator '${opToken.value}'`);

      const nextT = this.parseT();
      const opNode = new TreeNode(opToken.value, 'terminal', [], { token: opToken });
      
      // E → E + T or E → E - T (Left-associative expansion)
      currentENode = new TreeNode('E', 'nonterminal', [currentENode, opNode, nextT], {
        rule: `E → E ${opToken.value} T`
      });
      this.logStep('REDUCE', 'E', `Reduced to E → E ${opToken.value} T`);
    }

    this.logStep('RETURN', 'E', 'Completed Expression E');
    return currentENode;
  }

  /**
   * T → T * F | T / F | F
   */
  parseT() {
    this.logStep('CALL', 'T', 'Parsing Term T');
    let firstF = this.parseF();

    let currentTNode = new TreeNode('T', 'nonterminal', [firstF], { rule: 'T → F' });

    while (this.peek() === TokenType.STAR || this.peek() === TokenType.SLASH) {
      const opToken = this.currentToken();
      this.cursor++;
      this.logStep('MATCH', opToken.value, `Matched operator '${opToken.value}'`);

      const nextF = this.parseF();
      const opNode = new TreeNode(opToken.value, 'terminal', [], { token: opToken });

      // T → T * F or T → T / F
      currentTNode = new TreeNode('T', 'nonterminal', [currentTNode, opNode, nextF], {
        rule: `T → T ${opToken.value} F`
      });
      this.logStep('REDUCE', 'T', `Reduced to T → T ${opToken.value} F`);
    }

    this.logStep('RETURN', 'T', 'Completed Term T');
    return currentTNode;
  }

  /**
   * F → (E) | id | num
   */
  parseF() {
    this.logStep('CALL', 'F', 'Parsing Factor F');
    const token = this.currentToken();

    if (this.peek() === TokenType.ID) {
      this.cursor++;
      this.logStep('MATCH', token.value, `Matched identifier '${token.value}'`);
      const idNode = new TreeNode(token.value, 'terminal', [], { token });
      return new TreeNode('F', 'nonterminal', [idNode], { rule: 'F → id' });
    }

    if (this.peek() === TokenType.NUM) {
      this.cursor++;
      this.logStep('MATCH', token.value, `Matched numeric literal '${token.value}'`);
      const numNode = new TreeNode(token.value, 'terminal', [], { token });
      return new TreeNode('F', 'nonterminal', [numNode], { rule: 'F → num' });
    }

    if (this.peek() === TokenType.LPAREN) {
      this.cursor++;
      this.logStep('MATCH', '(', 'Matched opening parenthesis');
      const lparenNode = new TreeNode('(', 'terminal', [], { token });

      const eNode = this.parseE();

      const rparenToken = this.currentToken();
      if (this.peek() !== TokenType.RPAREN) {
        throw new Error(`Syntax Error: Expected closing ')' matching opening '(' at col ${token.col}, got '${rparenToken.value}'`);
      }
      this.cursor++;
      this.logStep('MATCH', ')', 'Matched closing parenthesis');
      const rparenNode = new TreeNode(')', 'terminal', [], { token: rparenToken });

      return new TreeNode('F', 'nonterminal', [lparenNode, eNode, rparenNode], { rule: 'F → (E)' });
    }

    throw new Error(`Syntax Error: Unexpected token '${token.value}' at column ${token.col}. Expected identifier, number, or '('`);
  }
}
