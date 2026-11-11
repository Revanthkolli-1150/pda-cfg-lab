import { Token, TokenType } from './types.js';

export class Lexer {
  /**
   * Tokenizes an arithmetic expression into a stream of tokens.
   * @param {string} input
   * @returns {{ tokens: Token[], errors: string[] }}
   */
  static tokenizeArithmetic(input) {
    const tokens = [];
    const errors = [];
    let i = 0;
    const len = input.length;

    while (i < len) {
      const ch = input[i];

      // Whitespace
      if (/\s/.test(ch)) {
        i++;
        continue;
      }

      // Operators & Parentheses
      if (ch === '+') {
        tokens.push(new Token(TokenType.PLUS, '+', i, i + 1));
        i++;
      } else if (ch === '-') {
        tokens.push(new Token(TokenType.MINUS, '-', i, i + 1));
        i++;
      } else if (ch === '*') {
        tokens.push(new Token(TokenType.STAR, '*', i, i + 1));
        i++;
      } else if (ch === '/') {
        tokens.push(new Token(TokenType.SLASH, '/', i, i + 1));
        i++;
      } else if (ch === '(') {
        tokens.push(new Token(TokenType.LPAREN, '(', i, i + 1));
        i++;
      } else if (ch === ')') {
        tokens.push(new Token(TokenType.RPAREN, ')', i, i + 1));
        i++;
      }
      // Numbers (integers or decimals)
      else if (/[0-9]/.test(ch)) {
        const start = i;
        let hasDecimal = false;
        while (i < len && (/[0-9]/.test(input[i]) || (input[i] === '.' && !hasDecimal))) {
          if (input[i] === '.') hasDecimal = true;
          i++;
        }
        const val = input.slice(start, i);
        tokens.push(new Token(TokenType.NUM, val, start, i));
      }
      // Identifiers (e.g. id, a, b, count, x1)
      else if (/[a-zA-Z_]/.test(ch)) {
        const start = i;
        while (i < len && /[a-zA-Z0-9_]/.test(input[i])) {
          i++;
        }
        const val = input.slice(start, i);
        tokens.push(new Token(TokenType.ID, val, start, i));
      }
      // Invalid character
      else {
        errors.push(`Unexpected character '${ch}' at index ${i}`);
        tokens.push(new Token(TokenType.INVALID, ch, i, i + 1));
        i++;
      }
    }

    tokens.push(new Token(TokenType.EOF, '$', len, len));
    return { tokens, errors };
  }

  /**
   * Tokenizes input for parentheses language: L = { w in {(,)}* }
   * @param {string} input
   * @returns {{ tokens: Token[], errors: string[] }}
   */
  static tokenizeParentheses(input) {
    const tokens = [];
    const errors = [];
    let i = 0;
    const len = input.length;

    while (i < len) {
      const ch = input[i];
      if (/\s/.test(ch)) {
        i++;
        continue;
      }
      if (ch === '(') {
        tokens.push(new Token(TokenType.LPAREN, '(', i, i + 1));
        i++;
      } else if (ch === ')') {
        tokens.push(new Token(TokenType.RPAREN, ')', i, i + 1));
        i++;
      } else {
        errors.push(`Invalid symbol '${ch}' at index ${i}. Expected '(' or ')'.`);
        tokens.push(new Token(TokenType.INVALID, ch, i, i + 1));
        i++;
      }
    }

    tokens.push(new Token(TokenType.EOF, '$', len, len));
    return { tokens, errors };
  }

  /**
   * Tokenizes input for palindrome language over alphabet {a, b}
   * @param {string} input
   * @returns {{ tokens: Token[], errors: string[] }}
   */
  static tokenizePalindrome(input) {
    const tokens = [];
    const errors = [];
    let i = 0;
    const len = input.length;

    while (i < len) {
      const ch = input[i];
      if (/\s/.test(ch)) {
        i++;
        continue;
      }
      if (ch === 'a') {
        tokens.push(new Token(TokenType.CHAR_A, 'a', i, i + 1));
        i++;
      } else if (ch === 'b') {
        tokens.push(new Token(TokenType.CHAR_B, 'b', i, i + 1));
        i++;
      } else {
        errors.push(`Invalid alphabet symbol '${ch}' at index ${i}. Alphabet is Σ = {a, b}.`);
        tokens.push(new Token(TokenType.INVALID, ch, i, i + 1));
        i++;
      }
    }

    tokens.push(new Token(TokenType.EOF, '$', len, len));
    return { tokens, errors };
  }
}
