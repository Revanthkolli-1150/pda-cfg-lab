import { TreeNode } from '../types.js';
import { ParseTree } from '../cfg/ParseTree.js';
import { DerivationEngine } from '../cfg/DerivationEngine.js';
import { Lexer } from '../lexer.js';

export class ParenthesesCFG {
  /**
   * Parses balanced parentheses string according to grammar:
   * S → ( S ) S | ε
   * @param {string} input
   */
  static parse(input) {
    const { tokens, errors } = Lexer.tokenizeParentheses(input);
    if (errors.length > 0) {
      return {
        success: false,
        tree: null,
        errors,
        leftmostDerivation: [],
        rightmostDerivation: []
      };
    }

    let cursor = 0;

    /**
     * Recursive helper to parse nonterminal S
     */
    function parseS() {
      // If next token is '(', apply S → ( S ) S
      if (tokens[cursor] && tokens[cursor].value === '(') {
        const lparenTok = tokens[cursor++];
        const lparenNode = new TreeNode('(', 'terminal', [], { token: lparenTok });

        const innerS = parseS();

        if (!tokens[cursor] || tokens[cursor].value !== ')') {
          throw new Error(`Unmatched opening parenthesis '(': expected ')' matching position ${lparenTok.start}`);
        }

        const rparenTok = tokens[cursor++];
        const rparenNode = new TreeNode(')', 'terminal', [], { token: rparenTok });

        const outerS = parseS();

        return new TreeNode('S', 'nonterminal', [lparenNode, innerS, rparenNode, outerS], {
          rule: 'S → ( S ) S'
        });
      }

      // Base case: S → ε
      const epsilonNode = new TreeNode('ε', 'epsilon', [], { rule: 'S → ε' });
      return new TreeNode('S', 'nonterminal', [epsilonNode], { rule: 'S → ε' });
    }

    try {
      const root = parseS();
      if (tokens[cursor] && tokens[cursor].value !== '$') {
        throw new Error(`Unexpected closing parenthesis ')' at index ${tokens[cursor].start} with no matching '('`);
      }

      const pTree = new ParseTree(root);
      const leftmost = DerivationEngine.generateLeftmostDerivation(root);
      const rightmost = DerivationEngine.generateRightmostDerivation(root);

      return {
        success: true,
        tree: pTree,
        rootNode: root,
        errors: [],
        leftmostDerivation: leftmost,
        rightmostDerivation: rightmost
      };
    } catch (err) {
      return {
        success: false,
        tree: null,
        rootNode: null,
        errors: [err.message],
        leftmostDerivation: [],
        rightmostDerivation: []
      };
    }
  }
}
