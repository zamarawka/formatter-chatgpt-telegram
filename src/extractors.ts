import { CodeBlocks } from './types';

/**
 * Ensures that if an opening ` or ``` is found without a matching closing delimiter,
 * the missing delimiter is appended to the end of the text.
 */
export function ensureClosingDelimiters(text: string): string {
  // For triple backticks
  if ((text.match(/```/g) || []).length % 2 !== 0) {
    text += '```';
  }
  // For single backticks
  if ((text.match(/`/g) || []).length % 2 !== 0) {
    text += '`';
  }
  return text;
}

/**
 * Extracts code blocks from the text, converting them to HTML <pre><code> format,
 * and replaces them with placeholders. Also ensures closing delimiters for unmatched blocks.
 */
export function extractAndConvertCodeBlocks(text: string): [string, CodeBlocks] {
  text = ensureClosingDelimiters(text);
  const placeholders: string[] = [];
  const codeBlocks: CodeBlocks = {};

  const pattern = /```(\w*)?(\n)?(.*?)```/gs;
  let modifiedText = text;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const language = match[1] ? match[1] : '';
    const codeContent = match[3];

    // Properly escape HTML entities in code content
    const escapedContent = codeContent
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const placeholder = `CODEBLOCKPLACEHOLDER${placeholders.length}`;
    placeholders.push(placeholder);

    let htmlCodeBlock;
    if (!language) {
      htmlCodeBlock = `<pre><code>${escapedContent}</code></pre>`;
    } else {
      htmlCodeBlock = `<pre><code class="language-${language}">${escapedContent}</code></pre>`;
    }

    codeBlocks[placeholder] = htmlCodeBlock;
    modifiedText = modifiedText.replace(match[0], placeholder);
  }

  return [modifiedText, codeBlocks];
}

/**
 * Reinserts HTML code blocks into the text, replacing their placeholders.
 */
export function reinsertCodeBlocks(text: string, codeBlocks: CodeBlocks): string {
  for (const [placeholder, htmlCodeBlock] of Object.entries(codeBlocks)) {
    text = text.replace(placeholder, htmlCodeBlock);
  }
  return text;
}
