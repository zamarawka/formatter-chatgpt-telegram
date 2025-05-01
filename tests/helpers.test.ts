import { removeBlockquoteEscaping, removeSpoilerEscaping } from '../src/helpers';

describe('helpers', () => {
  describe('removeBlockquoteEscaping', () => {
    it('should unescape blockquote tags', () => {
      const input = 'Text &lt;blockquote&gt;Quote&lt;/blockquote&gt;';
      const expected = 'Text <blockquote>Quote</blockquote>';
      expect(removeBlockquoteEscaping(input)).toBe(expected);
    });

    it('should unescape expandable blockquote tags', () => {
      const input = 'Text &lt;blockquote expandable&gt;Quote&lt;/blockquote&gt;';
      const expected = 'Text <blockquote expandable>Quote</blockquote>';
      expect(removeBlockquoteEscaping(input)).toBe(expected);
    });
  });

  describe('removeSpoilerEscaping', () => {
    it('should unescape spoiler tags', () => {
      const input = 'Text &lt;span class="tg-spoiler"&gt;Spoiler&lt;/span&gt;';
      const expected = 'Text <span class="tg-spoiler">Spoiler</span>';
      expect(removeSpoilerEscaping(input)).toBe(expected);
    });
  });
});
