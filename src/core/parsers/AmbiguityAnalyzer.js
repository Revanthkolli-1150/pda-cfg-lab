import { TreeNode } from '../types.js';
import { ParseTree } from '../cfg/ParseTree.js';
import { DerivationEngine } from '../cfg/DerivationEngine.js';

export class AmbiguityAnalyzer {
  /**
   * Generates the two distinct parse trees for the ambiguous grammar:
   * E → E + E | E * E | id
   * on input: id + id * id
   */
  static generateAmbiguousTrees() {
    // Tree 1: (id + id) * id -> E * E at root
    const id1 = new TreeNode('id', 'terminal');
    const plus = new TreeNode('+', 'terminal');
    const id2 = new TreeNode('id', 'terminal');
    const subE1 = new TreeNode('E', 'nonterminal', [id1, plus, id2], { rule: 'E → E + E' });

    const star1 = new TreeNode('*', 'terminal');
    const id3 = new TreeNode('id', 'terminal');
    const subE2 = new TreeNode('E', 'nonterminal', [id3], { rule: 'E → id' });

    // Also wrap id1 and id2 with E for standard CFG
    id1.parent = subE1;
    const wrappedId1 = new TreeNode('E', 'nonterminal', [new TreeNode('id', 'terminal')]);
    const wrappedId2 = new TreeNode('E', 'nonterminal', [new TreeNode('id', 'terminal')]);
    const leftE = new TreeNode('E', 'nonterminal', [wrappedId1, plus, wrappedId2], { rule: 'E → E + E' });

    const rightE = new TreeNode('E', 'nonterminal', [new TreeNode('id', 'terminal')], { rule: 'E → id' });
    const rootTree1 = new TreeNode('E', 'nonterminal', [leftE, star1, rightE], {
      rule: 'E → E * E (Evaluates + first: (id + id) * id)'
    });

    // Tree 2: id + (id * id) -> E + E at root (Standard Precedence)
    const plus2 = new TreeNode('+', 'terminal');
    const leftE2 = new TreeNode('E', 'nonterminal', [new TreeNode('id', 'terminal')], { rule: 'E → id' });

    const star2 = new TreeNode('*', 'terminal');
    const rightId1 = new TreeNode('E', 'nonterminal', [new TreeNode('id', 'terminal')]);
    const rightId2 = new TreeNode('E', 'nonterminal', [new TreeNode('id', 'terminal')]);
    const rightE2 = new TreeNode('E', 'nonterminal', [rightId1, star2, rightId2], { rule: 'E → E * E' });

    const rootTree2 = new TreeNode('E', 'nonterminal', [leftE2, plus2, rightE2], {
      rule: 'E → E + E (Evaluates * first: id + (id * id))'
    });

    const pTree1 = new ParseTree(rootTree1);
    const pTree2 = new ParseTree(rootTree2);

    const lm1 = DerivationEngine.generateLeftmostDerivation(rootTree1);
    const lm2 = DerivationEngine.generateLeftmostDerivation(rootTree2);

    return {
      tree1: {
        title: 'Parse Tree 1: High Precedence to Addition',
        semantics: '(id + id) * id',
        exampleEvaluation: '(2 + 3) * 4 = 20',
        tree: pTree1,
        root: rootTree1,
        derivation: lm1,
        interpretation: 'Binds addition tighter than multiplication, altering standard mathematical order of operations.'
      },
      tree2: {
        title: 'Parse Tree 2: High Precedence to Multiplication',
        semantics: 'id + (id * id)',
        exampleEvaluation: '2 + (3 * 4) = 14',
        tree: pTree2,
        root: rootTree2,
        derivation: lm2,
        interpretation: 'Binds multiplication tighter than addition, matching conventional mathematical precedence.'
      }
    };
  }

  /**
   * Explains how stratified grammar resolves ambiguity
   */
  static getResolutionExplanation() {
    return {
      ambiguousGrammar: [
        'E → E + E',
        'E → E * E',
        'E → id'
      ],
      revisedGrammar: [
        'E → E + T | E - T | T',
        'T → T * F | T / F | F',
        'F → (E) | id | num'
      ],
      explanation: [
        '1. Precedence Stratification: Levels of the parse tree reflect operator precedence. Addition and Subtraction sit at level E, whereas Multiplication and Division sit at level T (deeper in the tree), forcing * and / to be evaluated first.',
        '2. Associativity Enforcement: Left-recursive rules (E → E + T, T → T * F) guarantee that operators of identical precedence group left-to-right (e.g. 10 - 4 - 2 is parsed as ((10 - 4) - 2) = 4, never (10 - (4 - 2)) = 8).',
        '3. Uniqueness of Derivations: For every valid arithmetic expression, there is now exactly one valid leftmost derivation and exactly one valid parse tree.',
        '4. Theoretical Status: The resulting grammar is completely unambiguous. (Note: The underlying language was always unambiguous/deterministic; the initial ambiguity was purely an imperfection of the grammar specification).'
      ]
    };
  }
}
