import { describe, it, expect } from 'vitest';
import { ArithmeticParser } from '../core/parsers/ArithmeticParser.js';
import { ARITHMETIC_TEST_CASES } from '../testcases/arithmeticTestCases.js';

describe('ArithmeticParser & CFG Derivation', () => {
  it('parses basic precedence expression: id + id * id', () => {
    const parser = new ArithmeticParser('id + id * id');
    const result = parser.parse();
    expect(result.success).toBe(true);
    expect(result.rootNode).toBeDefined();
    expect(result.rootNode.label).toBe('E');
    expect(result.leftmostDerivation.length).toBeGreaterThan(0);
    expect(result.rightmostDerivation.length).toBeGreaterThan(0);

    // Verify root is E -> E + T
    const children = result.rootNode.children;
    expect(children).toHaveLength(3);
    expect(children[0].label).toBe('E');
    expect(children[1].label).toBe('+');
    expect(children[2].label).toBe('T');

    // Verify right child T has * (precedence)
    const tChildren = children[2].children;
    expect(tChildren[1].label).toBe('*');
  });

  it('parses parenthesized expression overriding precedence: (id + id) * id', () => {
    const parser = new ArithmeticParser('(id + id) * id');
    const result = parser.parse();
    expect(result.success).toBe(true);

    // Root should be E -> T -> T * F
    const root = result.rootNode;
    expect(root.children[0].label).toBe('T');
    const tNode = root.children[0];
    expect(tNode.children[1].label).toBe('*');
  });

  it('runs all accepted test cases successfully', () => {
    const acceptedCases = ARITHMETIC_TEST_CASES.filter(c => c.category === 'accepted');
    for (const testCase of acceptedCases) {
      const parser = new ArithmeticParser(testCase.input);
      const res = parser.parse();
      expect(res.success, `Failed on: ${testCase.input} - ${res.errors.join(', ')}`).toBe(true);
      expect(res.leftmostDerivation.length).toBeGreaterThan(0);
    }
  });

  it('rejects all rejected test cases with meaningful syntax errors', () => {
    const rejectedCases = ARITHMETIC_TEST_CASES.filter(c => c.category === 'rejected');
    for (const testCase of rejectedCases) {
      const parser = new ArithmeticParser(testCase.input);
      const res = parser.parse();
      expect(res.success, `Should have rejected: ${testCase.input}`).toBe(false);
      expect(res.errors.length).toBeGreaterThan(0);
    }
  });
});
