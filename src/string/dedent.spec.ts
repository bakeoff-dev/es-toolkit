import { describe, expect, it } from 'vitest';
import { dedent } from './dedent';

describe('dedent', () => {
  it('should remove common leading whitespace from each line', () => {
    expect(dedent('  hello\n  world')).toBe('hello\nworld');
  });

  it('should preserve relative indentation', () => {
    expect(dedent('  hello\n    world')).toBe('hello\n  world');
  });

  it('should handle a tagged template literal', () => {
    const result = dedent`
      hello
      world
    `;
    expect(result).toBe('hello\nworld');
  });

  it('should preserve relative indentation in a tagged template literal', () => {
    const result = dedent`
      hello
        world
    `;
    expect(result).toBe('hello\n  world');
  });

  it('should handle interpolations in a tagged template literal', () => {
    const name = 'world';
    const result = dedent`
      hello
      ${name}
    `;
    expect(result).toBe('hello\nworld');
  });

  it('should handle empty lines', () => {
    const result = dedent`
      hello

      world
    `;
    expect(result).toBe('hello\n\nworld');
  });

  it('should handle a single line', () => {
    expect(dedent('  hello')).toBe('hello');
  });

  it('should handle an empty string', () => {
    expect(dedent('')).toBe('');
  });

  it('should handle a string with no indentation', () => {
    expect(dedent('hello\nworld')).toBe('hello\nworld');
  });

  it('should handle tab indentation', () => {
    expect(dedent('\t\thello\n\t\tworld')).toBe('hello\nworld');
  });

  it('should remove first and last empty lines', () => {
    expect(dedent('\n  hello\n  world\n')).toBe('hello\nworld');
  });

  it('should handle lines with only whitespace', () => {
    expect(dedent('  hello\n    \n  world')).toBe('hello\n\nworld');
  });

  it('should handle mixed indentation levels', () => {
    expect(dedent('    a\n  b\n      c')).toBe('  a\nb\n    c');
  });

  it('should handle Windows line endings', () => {
    expect(dedent('  hello\r\n  world')).toBe('hello\nworld');
  });

  it('should handle a string with only empty lines', () => {
    expect(dedent('\n\n\n')).toBe('');
  });

  it('should accept an opening line that contains only whitespace', () => {
    const result = dedent`\t
      hello
    `;
    expect(result).toBe('hello');
  });

  it('should throw a TypeError if the opening line has content', () => {
    expect(
      () => dedent`hello
      world
    `
    ).toThrow(TypeError);
  });

  it('should throw a TypeError if the template has no newline', () => {
    expect(() => dedent`hello`).toThrow(TypeError);
  });

  it('should throw a TypeError if the template starts with an interpolation', () => {
    const name = 'hello';
    expect(
      () => dedent`${name}
      world
    `
    ).toThrow(TypeError);
  });

  it('should throw a TypeError if the closing line has content', () => {
    expect(
      () => dedent`
      hello
      world`
    ).toThrow(TypeError);
  });

  it('should throw a TypeError if the template ends with an interpolation', () => {
    const name = 'world';
    expect(
      () => dedent`
      hello
      ${name}`
    ).toThrow(TypeError);
  });

  it('should not check the template shape when called with a string', () => {
    expect(dedent('hello')).toBe('hello');
    expect(dedent('  hello\n  world')).toBe('hello\nworld');
  });

  it('should compose with another tag function', () => {
    const upper = (strings: TemplateStringsArray, ...values: unknown[]) => {
      let result = '';
      for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
          result += String(values[i]);
        }
      }
      return result.toUpperCase();
    };

    const dedentedUpper = dedent(upper);
    const result = dedentedUpper`
      hello
      world
    `;
    expect(result).toBe('HELLO\nWORLD');
  });

  it('should compose with another tag function and preserve interpolations', () => {
    const identity = (strings: TemplateStringsArray, ...values: unknown[]) => {
      let result = '';
      for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
          result += String(values[i]);
        }
      }
      return result;
    };

    const dedentedIdentity = dedent(identity);
    const name = 'es-toolkit';
    const result = dedentedIdentity`
      Welcome to
      ${name}!
    `;
    expect(result).toBe('Welcome to\nes-toolkit!');
  });

  it('should not let a multi-line interpolated value affect the indentation that is removed', () => {
    const value = 'a\nb';
    const result = dedent`
      hello ${value}
      world
    `;
    expect(result).toBe('hello a\nb\nworld');
  });

  it('should keep the indentation of a line that starts with an interpolation', () => {
    const result = dedent`
      hello
        ${'x'}
    `;
    expect(result).toBe('hello\n  x');
  });

  it('should use the least indented template line even when an interpolation starts it', () => {
    const value = 'a\nb';
    const result = dedent`
        hello
      ${value}
    `;
    expect(result).toBe('  hello\na\nb');
  });

  it('should keep the text that follows a multi-line interpolated value on the same line', () => {
    const value = 'first\nsecond';
    const result = dedent`
      start ${value} end
      tail
    `;
    expect(result).toBe('start first\nsecond end\ntail');
  });

  it('should not let a multi-line interpolated value affect a composed tag function', () => {
    const identity = (strings: TemplateStringsArray, ...values: unknown[]) => {
      let result = '';
      for (let i = 0; i < strings.length; i++) {
        result += strings[i];
        if (i < values.length) {
          result += String(values[i]);
        }
      }
      return result;
    };

    const dedentedIdentity = dedent(identity);
    const value = 'a\nb';
    const result = dedentedIdentity`
      hello ${value}
      world
    `;
    expect(result).toBe('hello a\nb\nworld');
  });

  it('should handle null characters in template strings and interpolated values', () => {
    const value = '\x00value\x00';
    const result = dedent`
      \x00 ${value}
      world
    `;
    expect(result).toBe('\x00 \x00value\x00\nworld');
  });

  it('should handle null characters in a composed tag function', () => {
    const identity = (strings: TemplateStringsArray) => strings.join('|');

    const dedentedIdentity = dedent(identity);
    const result = dedentedIdentity`
      \x00hello
      world\x00
    `;
    expect(result).toBe('\x00hello\nworld\x00');
  });

  it('should throw a TypeError from a composed tag function if the template shape is invalid', () => {
    const identity = (strings: TemplateStringsArray) => strings.join('');
    const dedentedIdentity = dedent(identity);

    expect(
      () => dedentedIdentity`hello
      world
    `
    ).toThrow(TypeError);
    expect(
      () => dedentedIdentity`
      hello
      world`
    ).toThrow(TypeError);
  });
});
