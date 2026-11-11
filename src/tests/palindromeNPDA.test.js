import { describe, it, expect } from 'vitest';
import { PalindromeNPDA } from '../core/automata/PalindromeNPDA.js';
import { PalindromeCFG } from '../core/parsers/PalindromeCFG.js';
import { PALINDROME_TEST_CASES } from '../testcases/palindromeTestCases.js';

describe('Case Study 3: Palindrome Language (NPDA & CFG)', () => {
  const npda = new PalindromeNPDA();

  describe('NPDA Nondeterministic Exploration', () => {
    it('accepts even-length palindrome abba and finds winning midpoint branch', () => {
      const res = npda.run('abba');
      expect(res.accepted).toBe(true);
      expect(res.winningPath.length).toBeGreaterThan(0);
      expect(res.configurationsExplored).toBeGreaterThan(1); // Demonstrates branching!
      expect(res.acceptedLeaf.state).toBe('q_acc');
    });

    it('accepts odd-length palindrome aba and correctly consumes center symbol', () => {
      const res = npda.run('aba');
      expect(res.accepted).toBe(true);
      expect(res.acceptedLeaf.state).toBe('q_acc');
    });

    it('accepts single character "a" and empty string ""', () => {
      expect(npda.run('a').accepted).toBe(true);
      expect(npda.run('').accepted).toBe(true);
    });

    it('rejects asymmetric string "ab"', () => {
      const res = npda.run('ab');
      expect(res.accepted).toBe(false);
      expect(res.acceptedLeaf).toBeNull();
      expect(res.deadEndsCount).toBeGreaterThan(0);
    });

    it('passes all accepted test cases from test suite', () => {
      const acceptedCases = PALINDROME_TEST_CASES.filter(c => c.category === 'accepted');
      for (const tc of acceptedCases) {
        const res = npda.run(tc.input);
        expect(res.accepted, `Failed on: '${tc.input}' (${tc.name})`).toBe(true);
      }
    });

    it('rejects all rejected test cases from test suite', () => {
      const rejectedCases = PALINDROME_TEST_CASES.filter(c => c.category === 'rejected');
      for (const tc of rejectedCases) {
        const res = npda.run(tc.input);
        expect(res.accepted, `Should have rejected: '${tc.input}' (${tc.name})`).toBe(false);
      }
    });
  });

  describe('Palindrome CFG S → aSa | bSb | a | b | ε', () => {
    it('derives even palindrome abba', () => {
      const res = PalindromeCFG.parse('abba');
      expect(res.success).toBe(true);
      expect(res.isPalindrome).toBe(true);
      expect(res.leftmostDerivation.length).toBeGreaterThan(0);
    });

    it('derives odd palindrome baabaab', () => {
      const res = PalindromeCFG.parse('baabaab');
      expect(res.success).toBe(true);
      expect(res.isPalindrome).toBe(true);
    });

    it('rejects non-palindrome and reports mismatch location', () => {
      const res = PalindromeCFG.parse('aab');
      expect(res.success).toBe(false);
      expect(res.errors[0]).toContain('mismatch');
    });
  });
});
