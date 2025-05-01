[![Ci Status](https://github.com/zamarawka/formatter-chatgpt-telegram/workflows/CI/badge.svg)](https://github.com/zamarawka/formatter-chatgpt-telegram/actions)
[![Npm version](https://img.shields.io/npm/v/formatter-chatgpt-telegram.svg?style=flat&logo=npm)](https://www.npmjs.com/package/formatter-chatgpt-telegram)

# ChatGPT Markdown to Telegram HTML Converter - TypeScript

> This library is convertation to Typescript of [Python version formatter-chatgpt-telegram](https://github.com/Latand/formatter-chatgpt-telegram) originally crafted by [@Latand](https://github.com/Latand)

A TypeScript library for converting Markdown to HTML format supported by the Telegram Bot API.

## Installation

```bash
npm install formatter-chatgpt-telegram
```

## Usage

```typescript
import telegramFormat from 'formatter-chatgpt-telegram';

// Your Markdown text
const markdown = `
# Heading

This is _italic_ and **bold** text.

\`\`\`python
def hello():
    print("Hello, world!")
\`\`\`

- First list item
- Second list item
`;

// Convert to HTML compatible with Telegram
const html = telegramFormat(markdown);
console.log(html);
```

## Supported Syntax

### Code Blocks

#### Multiline Code Blocks with Language Specification

````markdown
```python
def hello_world():
    print("Hello, World!")
```
````

Will be converted to:

```html
<pre><code class="language-python">def hello_world():
    print("Hello, World!")</code></pre>
```

#### Inline Code Blocks

```markdown
Here is inline `code`.
```

Will be converted to:

```html
Here is inline <code>code</code>.
```

### Text Styling

| Markdown                 | HTML                                      | Result in Telegram                      |
| ------------------------ | ----------------------------------------- | --------------------------------------- |
| `**bold text**`          | `<b>bold text</b>`                        | **bold text**                           |
| `__underlined__`         | `<u>underlined</u>`                       | <u>underlined</u>                       |
| `*italic*` or `_italic_` | `<i>italic</i>`                           | _italic_                                |
| `***bold and italic***`  | `<b><i>bold and italic</i></b>`           | **_bold and italic_**                   |
| `___underline italic___` | `<u><i>underline italic</i></u>`          | <u><i>underline italic</i></u>          |
| `~~strikethrough~~`      | `<s>strikethrough</s>`                    | ~~strikethrough~~                       |
| `\|\|spoiler\|\|`        | `<span class="tg-spoiler">spoiler</span>` | <span class="tg-spoiler">spoiler</span> |

### Headers

Headers are converted to bold text:

```markdown
# Header 1

## Header 2

### Header 3
```

Will be converted to:

```html
<b>Header 1</b>
<b>Header 2</b>
<b>Header 3</b>
```

### Lists

Unordered lists using `*` or `-`:

```markdown
- First item
- Second item
```

Will be converted to:

```
• First item
• Second item
```

### Links

Links are converted to HTML `<a>` tags:

```markdown
[Link text](https://example.com)
```

Will be converted to:

```html
<a href="https://example.com">Link text</a>
```

### Blockquotes

```markdown
> This is a quote
> spanning multiple lines
```

Will be converted to:

```html
<blockquote>This is a quote spanning multiple lines</blockquote>
```

#### Expandable Blockquotes

```markdown
**> This is an expandable quote
**> spanning multiple lines
```

Will be converted to:

```html
<blockquote expandable>This is an expandable quote spanning multiple lines</blockquote>
```

## Development

```sh
npm run format # code fomatting
npm run test # testing
```

Active maintenance with care and ❤️.

Feel free to send a PR.

## License

MIT
