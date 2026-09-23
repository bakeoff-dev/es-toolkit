const LINE_BREAK = /(\n)/;

/**
 * Removes common leading whitespace from each line of a multi-line string.
 *
 * This function can be used as a regular function, as a tagged template literal,
 * or composed with another tag function (TC39 String.dedent proposal).
 * It calculates the common indentation across all non-empty lines and removes it,
 * preserving relative indentation differences between lines.
 * The first and last lines are removed if they are empty or contain only whitespace.
 *
 * Only the text of the template decides how much indentation is removed. Interpolated
 * values are inserted after the indentation is removed, so a value that contains line
 * breaks never changes the result.
 *
 * When used as a tagged template literal or composed with a tag function, the template
 * must have the same shape `String.dedent` requires: the opening line, right after the
 * opening backtick, and the closing line, right before the closing backtick, may contain
 * only whitespace. Otherwise a `TypeError` is thrown.
 *
 * @param {string | TemplateStringsArray | Function} str - The string, template literal, or tag function to dedent.
 * @param {unknown[]} values - The values to interpolate when used as a tagged template literal.
 * @returns {string | Function} The dedented string, or a dedented tag function when composed.
 * @throws {TypeError} If a template literal has content on its opening or closing line.
 *
 * @example
 * // As a regular function
 * dedent("  hello\n  world"); // "hello\nworld"
 *
 * @example
 * // As a tagged template literal
 * dedent`
 *   hello
 *   world
 * `; // "hello\nworld"
 *
 * @example
 * // Interpolated values do not affect the indentation that is removed
 * const value = "a\nb";
 * dedent`
 *   hello ${value}
 *   world
 * `; // "hello a\nb\nworld"
 *
 * @example
 * // Tag composition
 * const html = dedent((strings, ...values) => strings.join(''));
 * html`
 *   <div>Hello</div>
 * `; // "<div>Hello</div>"
 */
export function dedent(str: string): string;
export function dedent(str: TemplateStringsArray, ...values: unknown[]): string;
export function dedent<T>(
  tagFn: (strings: TemplateStringsArray, ...values: unknown[]) => T
): (strings: TemplateStringsArray, ...values: unknown[]) => T;
export function dedent(
  str: string | TemplateStringsArray | ((strings: TemplateStringsArray, ...values: unknown[]) => unknown),
  ...values: unknown[]
): unknown {
  switch (typeof str) {
    case 'function': {
      return function (strings: TemplateStringsArray, ...args: unknown[]) {
        return str(dedentTemplateStringsArray(strings), ...args);
      };
    }
    case 'string': {
      return dedentImpl(str);
    }
    default: {
      const strings = dedentTemplateStrings(str);

      let text = strings[0];
      for (let i = 0; i < values.length; i++) {
        text += String(values[i]) + strings[i + 1];
      }

      return text;
    }
  }
}

function dedentTemplateStringsArray(strings: TemplateStringsArray): TemplateStringsArray {
  const parts = dedentTemplateStrings(strings);

  return Object.assign(parts, { raw: parts }) as unknown as TemplateStringsArray;
}

/**
 * Removes the common leading whitespace from the static parts of a template literal.
 *
 * Only the static parts decide how much indentation is removed, so interpolated values
 * never affect the result, even when they contain line breaks. Each part is split into
 * the lines it starts, and the common indentation is taken over the lines the template
 * itself begins. A line that ends with an interpolation is never treated as blank, so it
 * keeps its indentation relative to the other lines.
 *
 * The template must have the shape `String.dedent` requires: the opening line must end
 * with a newline and the closing line must be preceded by one, and both may contain only
 * whitespace. Otherwise a `TypeError` is thrown.
 */
function dedentTemplateStrings(strings: ArrayLike<string>): string[] {
  const length = strings.length;
  const blocks: string[][] = new Array(length);

  // Each block alternates between the text of a line and the line break that follows it,
  // so `block[0]` continues the line the previous interpolation was on and every other
  // even index starts a new line.
  for (let i = 0; i < length; i++) {
    blocks[i] = strings[i].replace(/\r\n/g, '\n').split(LINE_BREAK);
  }

  let commonIndent: string | undefined;

  for (let i = 0; i < length; i++) {
    const isLastBlock = i === length - 1;
    const block = blocks[i];

    if (i === 0) {
      if (block.length === 1 || block[0].trim() !== '') {
        throw new TypeError('Invalid opening line.');
      }

      block[0] = '';
      block[1] = '';
    }

    if (isLastBlock) {
      if (block.length === 1 || block[block.length - 1].trim() !== '') {
        throw new TypeError('Invalid closing line.');
      }

      block[block.length - 2] = '';
      block[block.length - 1] = '';
    }

    for (let j = 2; j < block.length; j += 2) {
      const line = block[j];
      const endsWithInterpolation = j === block.length - 1 && !isLastBlock;

      if (!endsWithInterpolation && line.trim() === '') {
        block[j] = '';
        continue;
      }

      let indent = 0;
      while (indent < line.length && (line[indent] === ' ' || line[indent] === '\t')) {
        indent++;
      }

      commonIndent = commonPrefix(line.slice(0, indent), commonIndent);
    }
  }

  const count = commonIndent === undefined ? 0 : commonIndent.length;
  const dedented: string[] = new Array(length);

  for (let i = 0; i < length; i++) {
    const block = blocks[i];

    let text = block[0];
    for (let j = 1; j < block.length; j += 2) {
      text += block[j] + block[j + 1].slice(count);
    }

    dedented[i] = text;
  }

  return dedented;
}

function commonPrefix(a: string, b: string | undefined): string {
  if (b === undefined) {
    return a;
  }

  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }

  return a.slice(0, i);
}

function dedentImpl(text: string): string {
  text = text.replace(/\r\n/g, '\n');
  const lines = text.split('\n');

  if (lines.length > 0 && lines[0].trim() === '') {
    lines.shift();
  }

  if (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  let commonIndent = Infinity;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') {
      continue;
    }

    let indent = 0;
    while (indent < line.length && (line[indent] === ' ' || line[indent] === '\t')) {
      indent++;
    }

    if (indent < commonIndent) {
      commonIndent = indent;
    }
  }

  if (commonIndent === Infinity) {
    return '';
  }

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      lines[i] = '';
    } else {
      lines[i] = lines[i].slice(commonIndent);
    }
  }

  return lines.join('\n');
}
