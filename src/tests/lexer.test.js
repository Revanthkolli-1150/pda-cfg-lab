import { describe, it, expect } from 'vitest';
import { Lexer } from '../core/lexer.js';
import { TokenType } from '../core/types.js';

describe('Lexer Engine', () => {
  describe('tokenizeArithmetic', () => {
    it('tokenizes identifiers and operators', () => {
      const { tokens, errors } = Lexer.tokenizeArithmetic('id + count * 42');
      expect(errors).toHaveLength(0);
      expect(tokens.map(t => t.type)).toEqual([
        TokenType.ID,
        TokenType.PLUS,
        TokenType.ID,
        TokenType.STAR,
        TokenType.NUM,
        TokenType.EOF
      ]);
    });

    it('handles parentheses and decimals', () => {
      const { tokens, errors } = Lexer.tokenizeArithmetic('(3.14 + x) / 2');
      expect(errors).toHaveLength(0);
      expect(tokens.find(t => t.value === '3.14')?.type).toBe(TokenType.NUM);
      expect(tokens.find(t => t.value === '(')?.type).toBe(TokenType.LPAREN);
      expect(tokens.find(t => t.value === ')')?.type).toBe(TokenType.RPAREN);
    });

    it('reports invalid lexical tokens', () => {
      const { errors } = Lexer.tokenizeArithmetic('id + @bad');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain('@');
    });
  });

  describe('tokenizeParentheses', () => {
    it('accepts valid parentheses strings', () => {
      const { tokens, errors } = Lexer.tokenizeParentheses('(()())');
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(7); // 6 parens + EOF
    });

    it('flags invalid characters', () => {
      const { errors } = Lexer.tokenizeParentheses('()[x]');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('tokenizePalindrome', () => {
    it('accepts strings over {a, b}', () => {
      const { tokens, errors } = Lexer.tokenizePalindrome('abba');
      expect(errors).toHaveLength(0);
      expect(tokens).toHaveLength(5);
    });

    it('rejects characters not in {a, b}', () => {
      const { errors } = Lexer.tokenizePalindrome('abcba');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("'c'");
    });
  });
});
