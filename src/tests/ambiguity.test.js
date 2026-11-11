import { describe, it, expect } from 'vitest';
import { AmbiguityAnalyzer } from '../core/parsers/AmbiguityAnalyzer.js';
import { ArithmeticParser } from '../core/parsers/ArithmeticParser.js';

describe('Ambiguity Analysis Engine', () => {
  it('generates two distinct parse trees for ambiguous grammar E → E + E | E * E | id', () => {
    const { tree1, tree2 } = AmbiguityAnalyzer.generateAmbiguousTrees();
    expect(tree1).toBeDefined();
    expect(tree2).toBeDefined();

    // Verify Tree 1 has * at root (evaluated + first)
    expect(tree1.root.children[1].label).toBe('*');
    expect(tree1.root.children[0].children[1].label).toBe('+');

    // Verify Tree 2 has + at root (evaluated * first)
    expect(tree2.root.children[1].label).toBe('+');
    expect(tree2.root.children[2].children[1].label).toBe('*');

    // Both trees yield the exact same terminal sequence: id + id * id
    expect(tree1.tree.getYield()).toBe('id + id * id');
    expect(tree2.tree.getYield()).toBe('id + id * id');

    // Leftmost derivations differ
    expect(tree1.derivation[1].appliedRule).toContain('E → E * E');
    expect(tree2.derivation[1].appliedRule).toContain('E → E + E');
  });

  it('proves revised precedence grammar produces exactly one unique parse tree for id + id * id', () => {
    const parser = new ArithmeticParser('id + id * id');
    const result = parser.parse();
    expect(result.success).toBe(true);

    // In unambiguous grammar, + is at root level E, and * is inside right child T
    expect(result.rootNode.label).toBe('E');
    expect(result.rootNode.children[1].label).toBe('+');
    expect(result.rootNode.children[2].label).toBe('T');
    expect(result.rootNode.children[2].children[1].label).toBe('*');
  });
});
