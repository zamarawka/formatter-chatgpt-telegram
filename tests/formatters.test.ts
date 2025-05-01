import { combineBlockquotes, fixAsteriskEquations } from '../src/formatters';

describe('formatters', () => {
  describe('combineBlockquotes', () => {
    it('should combine regular blockquotes', () => {
      const input = '> Line 1\n> Line 2\nNormal text';
      const expected = '<blockquote>Line 1\nLine 2</blockquote>\nNormal text';
      expect(combineBlockquotes(input)).toBe(expected);
    });

    it('should combine expandable blockquotes', () => {
      const input = '**> Line 1\n**> Line 2\nNormal text';
      const expected = '<blockquote expandable>Line 1\nLine 2</blockquote>\nNormal text';
      expect(combineBlockquotes(input)).toBe(expected);
    });

    it('should handle mixed content correctly', () => {
      const input = 'Text before\n> Blockquote 1\nText in middle\n**> Expandable quote\nText after';
      const expected =
        'Text before\n<blockquote>Blockquote 1</blockquote>\nText in middle\n<blockquote expandable>Expandable quote</blockquote>\nText after';
      expect(combineBlockquotes(input)).toBe(expected);
    });

    it('should handle blockquotes at the end of text', () => {
      const input = 'Text before\n> Final blockquote\n> Multiple lines';
      const expected = 'Text before\n<blockquote>Final blockquote\nMultiple lines</blockquote>';
      expect(combineBlockquotes(input)).toBe(expected);
    });

    it('should handle expandable blockquotes at the end of text', () => {
      const input = 'Text before\n**> Final expandable blockquote\n**> Multiple lines';
      const expected =
        'Text before\n<blockquote expandable>Final expandable blockquote\nMultiple lines</blockquote>';
      expect(combineBlockquotes(input)).toBe(expected);
    });
  });

  describe('fixAsteriskEquations', () => {
    it('should replace * with × in numeric expressions', () => {
      const input = 'Calculate 5*3 to get the result';
      const expected = 'Calculate 5×3 to get the result';
      expect(fixAsteriskEquations(input)).toBe(expected);
    });

    it('should handle spaces around the asterisk', () => {
      const input = 'Calculate 5 * 3 to get the result';
      const expected = 'Calculate 5×3 to get the result';
      expect(fixAsteriskEquations(input)).toBe(expected);
    });

    it('should handle multiple expressions', () => {
      const input = 'Calculate 5*3 and then 10*7';
      const expected = 'Calculate 5×3 and then 10×7';
      expect(fixAsteriskEquations(input)).toBe(expected);
    });
  });
});
