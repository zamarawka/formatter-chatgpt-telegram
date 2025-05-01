import {
  ensureClosingDelimiters,
  extractAndConvertCodeBlocks,
  reinsertCodeBlocks,
} from '../src/extractors';
import { CodeBlocks } from '../src/types';

describe('extractors', () => {
  describe('ensureClosingDelimiters', () => {
    it('should add closing triple backticks if missing', () => {
      const input = 'Text ```code';
      const expected = 'Text ```code```';
      expect(ensureClosingDelimiters(input)).toBe(expected);
    });

    it('should add closing single backtick if missing', () => {
      const input = 'Text `code';
      const expected = 'Text `code`';
      expect(ensureClosingDelimiters(input)).toBe(expected);
    });

    it('should add both closing backticks if both are missing', () => {
      const input = 'Text ```code `inner';
      const expected = 'Text ```code `inner````';
      expect(ensureClosingDelimiters(input)).toBe(expected);
    });

    it('should not modify text if all delimiters are balanced', () => {
      const input = 'Text `code` and ```block\ncode```';
      expect(ensureClosingDelimiters(input)).toBe(input);
    });
  });

  describe('extractAndConvertCodeBlocks', () => {
    it('should extract and convert code blocks with language', () => {
      const input = 'Before ```python\nprint("hello")\n``` after';
      const [modifiedText, codeBlocks] = extractAndConvertCodeBlocks(input);

      expect(modifiedText).toContain('Before CODEBLOCKPLACEHOLDER0 after');
      expect(Object.keys(codeBlocks).length).toBe(1);
      expect(codeBlocks[Object.keys(codeBlocks)[0]]).toContain('class="language-python"');
    });

    it('should extract and convert code blocks without language', () => {
      const input = 'Before ```\nconsole.log("hello")\n``` after';
      const [modifiedText, codeBlocks] = extractAndConvertCodeBlocks(input);

      expect(modifiedText).toContain('Before CODEBLOCKPLACEHOLDER0 after');
      expect(Object.keys(codeBlocks).length).toBe(1);
      expect(codeBlocks[Object.keys(codeBlocks)[0]]).toMatch(/<pre><code>[\s\S]*<\/code><\/pre>/);
    });
  });

  describe('reinsertCodeBlocks', () => {
    it('should reinsert code blocks into the text', () => {
      const codeBlocks: CodeBlocks = {
        CODEBLOCKPLACEHOLDER0: '<pre><code>test code</code></pre>',
      };
      const input = 'Before CODEBLOCKPLACEHOLDER0 after';
      const expected = 'Before <pre><code>test code</code></pre> after';

      expect(reinsertCodeBlocks(input, codeBlocks)).toBe(expected);
    });

    it('should reinsert multiple code blocks', () => {
      const codeBlocks: CodeBlocks = {
        CODEBLOCKPLACEHOLDER0: '<pre><code>first code</code></pre>',
        CODEBLOCKPLACEHOLDER1: '<pre><code>second code</code></pre>',
      };
      const input = 'Before CODEBLOCKPLACEHOLDER0 middle CODEBLOCKPLACEHOLDER1 after';
      const expected =
        'Before <pre><code>first code</code></pre> middle <pre><code>second code</code></pre> after';

      expect(reinsertCodeBlocks(input, codeBlocks)).toBe(expected);
    });
  });
});
