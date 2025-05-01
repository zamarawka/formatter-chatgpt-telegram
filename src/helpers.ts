/**
 * Removes the escaping from blockquote tags, including expandable blockquotes.
 */
export function removeBlockquoteEscaping(output: string): string {
  // Regular blockquotes
  output = output
    .replace(/&lt;blockquote&gt;/g, '<blockquote>')
    .replace(/&lt;\/blockquote&gt;/g, '</blockquote>');

  // Expandable blockquotes
  output = output
    .replace(/&lt;blockquote expandable&gt;/g, '<blockquote expandable>')
    .replace(/&lt;\/blockquote&gt;/g, '</blockquote>');

  return output;
}

/**
 * Ensures spoiler tags are correctly formatted (rather than being escaped).
 */
export function removeSpoilerEscaping(output: string): string {
  // Fix any incorrectly escaped spoiler tags
  output = output.replace(/&lt;span class="tg-spoiler"&gt;/g, '<span class="tg-spoiler">');
  output = output.replace(/&lt;\/span&gt;/g, '</span>');
  return output;
}
