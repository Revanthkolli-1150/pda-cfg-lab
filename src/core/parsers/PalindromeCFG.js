import { TreeNode } from '../types.js';
import { ParseTree } from '../cfg/ParseTree.js';
import { DerivationEngine } from '../cfg/DerivationEngine.js';
import { Lexer } from '../lexer.js';

export class PalindromeCFG {
  /**
   * Builds CFG parse tree and derivations for Palindrome Language:
   * S → aSa | bSb | a | b | ε
   * @param {string} input
   */
  static parse(input) {
    const { tokens, errors } = Lexer.tokenizePalindrome(input);
    if (errors.length > 0) {
      return {
        success: false,
        isPalindrome: false,
        tree: null,
        errors,
        leftmostDerivation: [],
        rightmostDerivation: []
      };
    }

    const cleanStr = tokens.filter(t => t.value !== '$').map(t => t.value).join('');
    const n = cleanStr.length;

    // Check palindrome condition
    let mismatchIndex = -1;
    for (let i = 0; i < Math.floor(n / 2); i++) {
      if (cleanStr[i] !== cleanStr[n - 1 - i]) {
        mismatchIndex = i;
        break;
      }
    }

    if (mismatchIndex !== -1) {
      const opposing = n - 1 - mismatchIndex;
      return {
        success: false,
        isPalindrome: false,
        tree: null,
        errors: [
          `String '${cleanStr}' is not a palindrome: mismatch between index ${mismatchIndex} ('${cleanStr[mismatchIndex]}') and index ${opposing} ('${cleanStr[opposing]}').`
        ],
        leftmostDerivation: [],
        rightmostDerivation: []
      };
    }

    // Build Parse Tree recursively
    function buildSubtree(sub) {
      if (sub.length === 0) {
        const epsNode = new TreeNode('ε', 'epsilon');
        return new TreeNode('S', 'nonterminal', [epsNode], { rule: 'S → ε' });
      }

      if (sub.length === 1) {
        const char = sub[0];
        const termNode = new TreeNode(char, 'terminal');
        return new TreeNode('S', 'nonterminal', [termNode], { rule: `S → ${char}` });
      }

      const first = sub[0];
      const last = sub[sub.length - 1];
      const inner = sub.slice(1, -1);

      const leftTerminal = new TreeNode(first, 'terminal');
      const innerS = buildSubtree(inner);
      const rightTerminal = new TreeNode(last, 'terminal');

      return new TreeNode('S', 'nonterminal', [leftTerminal, innerS, rightTerminal], {
        rule: `S → ${first} S ${last}`
      });
    }

    const root = buildSubtree(cleanStr);
    const pTree = new ParseTree(root);
    const leftmost = DerivationEngine.generateLeftmostDerivation(root);
    const rightmost = DerivationEngine.generateRightmostDerivation(root);

    return {
      success: true,
      isPalindrome: true,
      tree: pTree,
      rootNode: root,
      errors: [],
      leftmostDerivation: leftmost,
      rightmostDerivation: rightmost
    };
  }
}
