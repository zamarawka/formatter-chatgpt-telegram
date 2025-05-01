/**
 * Combines multiline blockquotes into a single blockquote while keeping the \n characters.
 * Supports both regular blockquotes (>) and expandable blockquotes (**>).
 */
export function combineBlockquotes(text: string): string {
  const lines = text.split('\n');
  const combinedLines: string[] = [];
  let blockquoteLines: string[] = [];
  let inBlockquote = false;
  let isExpandable = false;

  for (const line of lines) {
    if (line.startsWith('**>')) {
      // Expandable blockquote
      inBlockquote = true;
      isExpandable = true;
      blockquoteLines.push(line.substring(3).trim());
    } else if (line.startsWith('>')) {
      // Regular blockquote
      if (!inBlockquote) {
        // This is a new blockquote
        inBlockquote = true;
        isExpandable = false;
      }
      blockquoteLines.push(line.substring(1).trim());
    } else {
      if (inBlockquote) {
        // End of blockquote, combine the lines
        if (isExpandable) {
          combinedLines.push(
            '<blockquote expandable>' + blockquoteLines.join('\n') + '</blockquote>',
          );
        } else {
          combinedLines.push('<blockquote>' + blockquoteLines.join('\n') + '</blockquote>');
        }
        blockquoteLines = [];
        inBlockquote = false;
        isExpandable = false;
      }
      combinedLines.push(line);
    }
  }

  if (inBlockquote) {
    // Handle the case where the file ends with a blockquote
    if (isExpandable) {
      combinedLines.push('<blockquote expandable>' + blockquoteLines.join('\n') + '</blockquote>');
    } else {
      combinedLines.push('<blockquote>' + blockquoteLines.join('\n') + '</blockquote>');
    }
  }

  return combinedLines.join('\n');
}

/**
 * Replaces numeric expressions with '*' in them with '×'
 * to avoid accidental italic formatting.
 * e.g. '6*8' -> '6×8', '6 * 8' -> '6×8'
 */
export function fixAsteriskEquations(text: string): string {
  const eqPattern = /(\d+)\s*\*\s*(\d+)/g;
  return text.replace(eqPattern, '$1×$2');
}
