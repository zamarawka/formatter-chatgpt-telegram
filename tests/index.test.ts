import telegramFormat from '../src/index';

describe('index', () => {
  describe('exports', () => {
    it('should export telegramFormat function as default', () => {
      expect(typeof telegramFormat).toBe('function');
    });
  });

  describe('telegramFormat', () => {
    it('should convert basic markdown to HTML', () => {
      const input = 'This is **bold**, *italic*, and `code`.';
      const expected = 'This is <b>bold</b>, <i>italic</i>, and <code>code</code>.';
      expect(telegramFormat(input)).toBe(expected);
    });

    it('should handle code blocks with language specification', () => {
      const input = '```javascript\nconst x = 1;\n```';
      const expected = '<pre><code class="language-javascript">const x = 1;\n</code></pre>';
      expect(telegramFormat(input)).toBe(expected);
    });

    it('should combine blockquotes correctly', () => {
      const input = '> This is\n> a blockquote';
      const expected = '<blockquote>This is\na blockquote</blockquote>';
      expect(telegramFormat(input)).toBe(expected);
    });

    it('should handle expandable blockquotes', () => {
      const input = '**> This is\n**> an expandable blockquote';
      const expected = '<blockquote expandable>This is\nan expandable blockquote</blockquote>';
      expect(telegramFormat(input)).toBe(expected);
    });

    it('should convert markdown links to HTML links', () => {
      const input = 'Check [this link](https://example.com)';
      const expected = 'Check <a href="https://example.com">this link</a>';
      expect(telegramFormat(input)).toBe(expected);
    });

    it('should handle headers correctly', () => {
      const input = '# Header 1\n## Header 2';
      const expected = '<b>Header 1</b>\n<b>Header 2</b>';
      expect(telegramFormat(input)).toBe(expected);
    });

    it('should process spoiler tags', () => {
      const input = 'This is a ||spoiler||';
      const expected = 'This is a <span class="tg-spoiler">spoiler</span>';
      expect(telegramFormat(input)).toBe(expected);
    });

    it('should handle unordered lists', () => {
      const input = '- Item 1\n- Item 2';
      const expected = '• Item 1\n• Item 2';
      expect(telegramFormat(input)).toBe(expected);
    });

    it('should handle nested formatting', () => {
      const input = '***Bold and italic***';
      const expected = '<b><i>Bold and italic</i></b>';
      expect(telegramFormat(input)).toBe(expected);
    });
  });
});
