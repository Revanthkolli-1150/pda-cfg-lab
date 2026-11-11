import { describe, it, expect } from 'vitest';
import { ParenthesesPDA } from '../core/automata/ParenthesesPDA.js';
import { ParenthesesCFG } from '../core/parsers/ParenthesesCFG.js';
import { PARENTHESES_TEST_CASES } from '../testcases/parenthesesTestCases.js';

describe('Case Study 2: Balanced Parentheses (PDA & CFG)', () => {
  const pda = new ParenthesesPDA();

  describe('PDA Execution', () => {
    it('accepts balanced pairs and empty string', () => {
      expect(pda.run('()').accepted).toBe(true);
      expect(pda.run('(())').accepted).toBe(true);
      expect(pda.run('()()').accepted).toBe(true);
      expect(pda.run('((()()))').accepted).toBe(true);
      expect(pda.run('').accepted).toBe(true);
    });

    it('rejects unmatched closing parenthesis (underflow)', () => {
      const res = pda.run('())');
      expect(res.accepted).toBe(false);
      expect(res.finalState).toBe('q_rej');
    });

    it('rejects unmatched opening parenthesis (overflow at EOF)', () => {
      const res = pda.run('(()');
      expect(res.accepted).toBe(false);
      expect(res.finalState).toBe('q_rej');
    });

    it('rejects reversed order )(', () => {
      const res = pda.run(')(');
      expect(res.accepted).toBe(false);
      expect(res.finalState).toBe('q_rej');
    });

    it('verifies all accepted test cases pass', () => {
      const acceptedCases = PARENTHESES_TEST_CASES.filter(c => c.category === 'accepted');
      for (const tc of acceptedCases) {
        const res = pda.run(tc.input);
        expect(res.accepted, `Failed on: ${tc.input} (${tc.name})`).toBe(true);
        expect(res.finalStack).toEqual(['Z0']);
      }
    });

    it('verifies all rejected test cases fail', () => {
      const rejectedCases = PARENTHESES_TEST_CASES.filter(c => c.category === 'rejected');
      for (const tc of rejectedCases) {
        const res = pda.run(tc.input);
        expect(res.accepted, `Expected rejection on: ${tc.input} (${tc.name})`).toBe(false);
      }
    });
  });

  describe('Parentheses CFG S → (S)S | ε', () => {
    it('generates parse tree and leftmost derivations for balanced strings', () => {
      const result = ParenthesesCFG.parse('(())');
      expect(result.success).toBe(true);
      expect(result.rootNode).toBeDefined();
      expect(result.leftmostDerivation.length).toBeGreaterThan(0);
      expect(result.rightmostDerivation.length).toBeGreaterThan(0);
    });

    it('fails to parse unbalanced strings', () => {
      const result = ParenthesesCFG.parse('(()');
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
