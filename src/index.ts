import { convertHtmlChars, splitByTag } from './converters';
import { extractAndConvertCodeBlocks, reinsertCodeBlocks } from './extractors';
import { combineBlockquotes } from './formatters';
import { removeBlockquoteEscaping, removeSpoilerEscaping } from './helpers';
import { InlineCodeSnippets } from './types';

/**
 * Extracts inline code (single-backtick content) from the text,
 * replacing it with placeholders, returning modified text and a dict of placeholders -> code text.
 * This ensures characters like '*' or '_' inside inline code won't be interpreted as Markdown.
 */
function extractInlineCodeSnippets(text: string): [string, InlineCodeSnippets] {
  const placeholders: string[] = [];
  const codeSnippets: InlineCodeSnippets = {};
  const inlineCodePattern = /`([^`]+)`/g;

  let newText = text;
  let match;

  while ((match = inlineCodePattern.exec(text)) !== null) {
    const snippet = match[1];
    const placeholder = `INLINECODEPLACEHOLDER${placeholders.length}`;
    placeholders.push(placeholder);
    codeSnippets[placeholder] = snippet;

    // Replace only this occurrence
    newText = newText.replace(match[0], placeholder);
  }

  return [newText, codeSnippets];
}

/**
 * Converts markdown in the provided text to HTML supported by Telegram.
 */
export default function telegramFormat(text: string): string {
  // Step 0: Combine blockquotes
  text = combineBlockquotes(text);

  // Step 1: Extract and convert triple-backtick code blocks first
  const [output, tripleCodeBlocks] = extractAndConvertCodeBlocks(text);

  // Step 2: Extract inline code snippets
  const [outputWithInlineExtracted, inlineCodeSnippets] = extractInlineCodeSnippets(output);

  // Step 3: Convert HTML reserved symbols in the text (not in code blocks)
  let processedOutput = convertHtmlChars(outputWithInlineExtracted);

  // Convert headings (H1-H6)
  processedOutput = processedOutput.replace(/^(#{1,6})\s+(.+)$/gm, '<b>$2</b>');

  // Convert unordered lists (do this before italic detection so that leading '*' is recognized as bullet)
  processedOutput = processedOutput.replace(/^(\s*)[\-\*]\s+(.+)$/gm, '$1• $2');

  // Nested Bold and Italic
  processedOutput = processedOutput.replace(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>');
  processedOutput = processedOutput.replace(/\_\_\_(.*?)\_\_\_/g, '<u><i>$1</i></u>');

  // Process markdown for bold (**), underline (__), strikethrough (~~), and spoiler (||)
  processedOutput = splitByTag(processedOutput, '**', 'b');
  processedOutput = splitByTag(processedOutput, '__', 'u');
  processedOutput = splitByTag(processedOutput, '~~', 's');
  processedOutput = splitByTag(processedOutput, '||', 'span class="tg-spoiler"');

  // Custom approach for single-asterisk italic
  const italicPattern = /(?<![A-Za-z0-9])\*(?=[^\s])(.*?)(?<!\s)\*(?![A-Za-z0-9])/gs;
  processedOutput = processedOutput.replace(italicPattern, '<i>$1</i>');

  // Process single underscore-based italic
  processedOutput = splitByTag(processedOutput, '_', 'i');

  // Remove storage links (Vector storage placeholders like 【4:0†source】)
  processedOutput = processedOutput.replace(/【[^】]+】/g, '');

  // Convert Markdown links/images to <a href="">…</a>
  const linkPattern = /(?:!?)\[((?:[^\[\]]|\[.*?\])*)\]\(([^)]+)\)/g;
  processedOutput = processedOutput.replace(linkPattern, '<a href="$2">$1</a>');

  // Step 4: Reinsert inline code snippets, applying HTML escaping to the content
  for (const [placeholder, snippet] of Object.entries(inlineCodeSnippets)) {
    // Apply HTML escaping to the content of inline code
    const escapedSnippet = snippet
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    processedOutput = processedOutput.replace(placeholder, `<code>${escapedSnippet}</code>`);
  }

  // Step 5: Reinsert the converted triple-backtick code blocks
  processedOutput = reinsertCodeBlocks(processedOutput, tripleCodeBlocks);

  // Step 6: Remove blockquote escaping
  processedOutput = removeBlockquoteEscaping(processedOutput);

  // Step 7: Remove spoiler tag escaping
  processedOutput = removeSpoilerEscaping(processedOutput);

  // Clean up multiple consecutive newlines, but preserve intentional spacing
  processedOutput = processedOutput.replace(/\n{3,}/g, '\n\n');

  return processedOutput.trim();
}
