import { convertHtmlChars, splitByTag } from '../src/converters';

describe('converters', () => {
  describe('convertHtmlChars', () => {
    it('should convert HTML reserved symbols to their character references', () => {
      const input = 'Text with <tags> & special chars';
      const expected = 'Text with &lt;tags&gt; &amp; special chars';
      expect(convertHtmlChars(input)).toBe(expected);
    });
  });

  describe('splitByTag', () => {
    it('should split text by markdown tag and replace with HTML tag', () => {
      const input = 'This is **bold** text';
      const expected = 'This is <b>bold</b> text';
      expect(splitByTag(input, '**', 'b')).toBe(expected);
    });

    it('should handle multiple occurrences of tags', () => {
      const input = 'This has **bold** and **another bold** text';
      const expected = 'This has <b>bold</b> and <b>another bold</b> text';
      expect(splitByTag(input, '**', 'b')).toBe(expected);
    });

    it('should handle special case for spoiler tag', () => {
      const input = 'This is a ||spoiler|| text';
      const expected = 'This is a <span class="tg-spoiler">spoiler</span> text';
      expect(splitByTag(input, '||', 'span class="tg-spoiler"')).toBe(expected);
    });
  });
});
