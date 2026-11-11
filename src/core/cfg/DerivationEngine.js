import { DerivationStep } from '../types.js';

export class DerivationEngine {
  /**
   * Generates a Leftmost Derivation from a parse tree.
   * In a leftmost derivation, at each step the leftmost nonterminal is expanded.
   * @param {TreeNode} root
   * @returns {DerivationStep[]}
   */
  static generateLeftmostDerivation(root) {
    if (!root) return [];

    const steps = [];
    let stepCount = 0;

    // A sentential form represented as an array of items (each can be a tree node or symbol)
    // We start with [root]
    let currentSymbols = [root];

    // Initial step
    steps.push(new DerivationStep(
      stepCount++,
      root.label,
      'Start symbol',
      0,
      root.label,
      root.label
    ));

    while (true) {
      // Find the first (leftmost) non-terminal node in currentSymbols
      const ntIndex = currentSymbols.findIndex(s => typeof s === 'object' && s.type === 'nonterminal');
      if (ntIndex === -1) {
        // No more non-terminals, derivation is complete!
        break;
      }

      const nodeToExpand = currentSymbols[ntIndex];
      const children = nodeToExpand.children || [];

      // Determine expansion rule
      const childLabels = children.map(c => c.label).join(' ') || 'ε';
      const ruleStr = `${nodeToExpand.label} → ${childLabels}`;

      // Replace nodeToExpand with its children
      // If child is epsilon, it doesn't contribute symbols to the string representation,
      // but in sentential form we can show ε or collapse it.
      const replacement = children.length > 0 ? children : ['ε'];
      currentSymbols.splice(ntIndex, 1, ...replacement);

      // Render sentential form string
      const formString = currentSymbols.map(s => (typeof s === 'object' ? s.label : s)).join(' ');

      steps.push(new DerivationStep(
        stepCount++,
        formString,
        ruleStr,
        ntIndex,
        nodeToExpand.label,
        childLabels
      ));
    }

    return steps;
  }

  /**
   * Generates a Rightmost Derivation from a parse tree.
   * In a rightmost derivation, at each step the rightmost nonterminal is expanded.
   * @param {TreeNode} root
   * @returns {DerivationStep[]}
   */
  static generateRightmostDerivation(root) {
    if (!root) return [];

    const steps = [];
    let stepCount = 0;

    let currentSymbols = [root];

    steps.push(new DerivationStep(
      stepCount++,
      root.label,
      'Start symbol',
      0,
      root.label,
      root.label
    ));

    while (true) {
      // Find the last (rightmost) non-terminal node in currentSymbols
      let ntIndex = -1;
      for (let i = currentSymbols.length - 1; i >= 0; i--) {
        if (typeof currentSymbols[i] === 'object' && currentSymbols[i].type === 'nonterminal') {
          ntIndex = i;
          break;
        }
      }

      if (ntIndex === -1) {
        break;
      }

      const nodeToExpand = currentSymbols[ntIndex];
      const children = nodeToExpand.children || [];
      const childLabels = children.map(c => c.label).join(' ') || 'ε';
      const ruleStr = `${nodeToExpand.label} → ${childLabels}`;

      const replacement = children.length > 0 ? children : ['ε'];
      currentSymbols.splice(ntIndex, 1, ...replacement);

      const formString = currentSymbols.map(s => (typeof s === 'object' ? s.label : s)).join(' ');

      steps.push(new DerivationStep(
        stepCount++,
        formString,
        ruleStr,
        ntIndex,
        nodeToExpand.label,
        childLabels
      ));
    }

    return steps;
  }
}
