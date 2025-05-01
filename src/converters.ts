/**
 * Converts HTML reserved symbols to their respective character references.
 */
export function convertHtmlChars(text: string): string {
  text = text.replace(/&/g, '&amp;');
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  return text;
}

/**
 * Splits the text by markdown tag and replaces it with the specified HTML tag.
 */
export function splitByTag(outText: string, mdTag: string, htmlTag: string): string {
  const escapedMdTag = mdTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagPattern = new RegExp(`(?<!\\w)${escapedMdTag}(.*?)${escapedMdTag}(?!\\w)`, 'gs');

  // Special handling for the tg-spoiler tag
  if (htmlTag === 'span class="tg-spoiler"') {
    return outText.replace(tagPattern, '<span class="tg-spoiler">$1</span>');
  }

  return outText.replace(tagPattern, `<${htmlTag}>$1</${htmlTag}>`);
}
