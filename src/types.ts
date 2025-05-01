/**
 * Interface representing a dictionary of code block placeholders.
 * Keys are placeholder strings, values are HTML code blocks.
 */
export interface CodeBlocks {
  [placeholder: string]: string;
}

/**
 * Interface representing a dictionary of inline code snippet placeholders.
 * Keys are placeholder strings, values are the content of the snippets.
 */
export interface InlineCodeSnippets {
  [placeholder: string]: string;
}
