/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  type MagicCommentConfig,
  parseCodeBlockMeta,
  parseLanguage,
  parseLines,
} from '../codeBlockUtils';

const defaultMagicComments: MagicCommentConfig[] = [
  {
    className: 'theme-code-block-highlighted-line',
    line: 'highlight-next-line',
    block: {start: 'highlight-start', end: 'highlight-end'},
  },
];

describe('parseCodeBlockMeta', () => {
  // shorthand for previously existing tests parsing the title
  function parseCodeBlockTitle(
    metastring?: string,
    magicComments?: MagicCommentConfig[],
  ): string {
    const meta = parseCodeBlockMeta({
      language: undefined,
      magicComments: magicComments ?? [],
      metastring,
    });

    return (meta.options.title as string) ?? '';
  }

  it('parses double quote delimited title', () => {
    expect(parseCodeBlockTitle(`title="index.js"`)).toBe(`index.js`);
  });

  it('parses single quote delimited title', () => {
    expect(parseCodeBlockTitle(`title='index.js'`)).toBe(`index.js`);
  });

  it('parses mismatched quote delimiters as plain string', () => {
    expect(parseCodeBlockTitle(`title="index.js'`)).toBe(`"index.js'`);
  });

  it('parses undefined metastring', () => {
    expect(parseCodeBlockTitle(undefined)).toBe(``);
  });

  it('parses metastring with no title specified', () => {
    expect(parseCodeBlockTitle(`{1,2-3}`, defaultMagicComments)).toBe(``);
  });

  it('parses with multiple metadata title first', () => {
    expect(parseCodeBlockTitle(`title="index.js" label="JavaScript"`)).toBe(
      `index.js`,
    );
  });

  it('parses with multiple metadata title last', () => {
    expect(parseCodeBlockTitle(`label="JavaScript" title="index.js"`)).toBe(
      `index.js`,
    );
  });

  it('parses double quotes when delimited by single quotes', () => {
    expect(parseCodeBlockTitle(`title='console.log("Hello, World!")'`)).toBe(
      `console.log("Hello, World!")`,
    );
  });

  it('parses single quotes when delimited by double quotes', () => {
    expect(parseCodeBlockTitle(`title="console.log('Hello, World!')"`)).toBe(
      `console.log('Hello, World!')`,
    );
  });

  it('parses range only', () => {
    expect(
      parseCodeBlockMeta({
        metastring: `{1,2-3}`,
        language: undefined,
        magicComments: defaultMagicComments,
      }),
    ).toMatchSnapshot();
  });

  it('parses range and options', () => {
    expect(
      parseCodeBlockMeta({
        metastring: `{1,2-3} title="index.js" label="JavaScript"`,
        language: undefined,
        magicComments: defaultMagicComments,
      }),
    ).toMatchSnapshot();
  });

  it('parses range and options end', () => {
    expect(
      parseCodeBlockMeta({
        metastring: `title="index.js" label="JavaScript" {1,2-3} `,
        language: undefined,
        magicComments: defaultMagicComments,
      }),
    ).toMatchSnapshot();
  });

  it('parses range and options middle', () => {
    expect(
      parseCodeBlockMeta({
        metastring: `title="index.js" {1,2-3} label="JavaScript"`,
        language: undefined,
        magicComments: defaultMagicComments,
      }),
    ).toMatchSnapshot();
  });

  it('parses range and options multiple', () => {
    expect(
      parseCodeBlockMeta({
        metastring: `{1} title="index.js" {1,2-3} label="JavaScript" {4}`,
        language: undefined,
        magicComments: defaultMagicComments,
      }),
    ).toMatchSnapshot();
  });

  it('parses mixed values', () => {
    expect(
      parseCodeBlockMeta({
        metastring: `{1} a="double'quote" b='single"quote' c=raw d=true e=false f=1 g=0.5`,
        language: undefined,
        magicComments: defaultMagicComments,
      }),
    ).toMatchSnapshot();
  });
});

describe('parseLanguage', () => {
  it('works', () => {
    expect(parseLanguage('language-foo xxx yyy')).toBe('foo');
    expect(parseLanguage('xxxxx language-foo yyy')).toBe('foo');
    expect(parseLanguage('xx-language-foo yyyy')).toBeUndefined();
    expect(parseLanguage('xxx yyy zzz')).toBeUndefined();
  });
});

describe('parseLines', () => {
  it('does not parse content with metastring', () => {
    expect(
      parseLines('aaaaa\nnnnnn', {
        metastring: '{1}',
        language: 'js',
        magicComments: defaultMagicComments,
      }),
    ).toMatchSnapshot();
    expect(
      parseLines(
        `// highlight-next-line
aaaaa
bbbbb`,
        {
          metastring: '{1}',
          language: 'js',
          magicComments: defaultMagicComments,
        },
      ),
    ).toMatchSnapshot();
    expect(
      parseLines(
        `aaaaa
bbbbb`,
        {
          metastring: '{1}',
          language: 'undefined',
          magicComments: defaultMagicComments,
        },
      ),
    ).toMatchSnapshot();
    expect(() =>
      parseLines(
        `aaaaa
bbbbb`,
        {
          metastring: '{1}',
          language: 'js',
          magicComments: [],
        },
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"A highlight range has been given in code block's metastring (\`\`\` {1}), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges."`,
    );
  });
  it('does not parse content with no language', () => {
    expect(
      parseLines(
        `// highlight-next-line
aaaaa
bbbbb`,
        {
          metastring: '',
          language: undefined,
          magicComments: defaultMagicComments,
        },
      ),
    ).toMatchSnapshot();
  });
  it('removes lines correctly', () => {
    expect(
      parseLines(
        `// highlight-next-line
aaaaa
bbbbb`,
        {metastring: '', language: 'js', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot();
    expect(
      parseLines(
        `// highlight-start
aaaaa
// highlight-end
bbbbb`,
        {metastring: '', language: 'js', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot();
    expect(
      parseLines(
        `// highlight-start
// highlight-next-line
aaaaa
bbbbbbb
// highlight-next-line
// highlight-end
bbbbb`,
        {metastring: '', language: 'js', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot();
  });
  it('respects language', () => {
    expect(
      parseLines(
        `# highlight-next-line
aaaaa
bbbbb`,
        {metastring: '', language: 'js', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot('js');
    expect(
      parseLines(
        `/* highlight-next-line */
aaaaa
bbbbb`,
        {metastring: '', language: 'py', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot('py');
    expect(
      parseLines(
        `// highlight-next-line
aaaa
/* highlight-next-line */
bbbbb
# highlight-next-line
ccccc
<!-- highlight-next-line -->
dddd`,
        {metastring: '', language: 'py', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot('py');
    expect(
      parseLines(
        `// highlight-next-line
aaaa
/* highlight-next-line */
bbbbb
# highlight-next-line
ccccc
<!-- highlight-next-line -->
dddd`,
        {metastring: '', language: '', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot('none');
    expect(
      parseLines(
        `// highlight-next-line
aaaa
{/* highlight-next-line */}
bbbbb
<!-- highlight-next-line -->
dddd`,
        {metastring: '', language: 'jsx', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot('jsx');
    expect(
      parseLines(
        `// highlight-next-line
aaaa
{/* highlight-next-line */}
bbbbb
<!-- highlight-next-line -->
dddd`,
        {metastring: '', language: 'html', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot('html');
    expect(
      parseLines(
        `---
# highlight-next-line
aaa: boo
---

aaaa

<div>
{/* highlight-next-line */}
foo
</div>

bbbbb
<!-- highlight-next-line -->
dddd

\`\`\`js
// highlight-next-line
console.log("preserved");
\`\`\`
`,
        {metastring: '', language: 'md', magicComments: defaultMagicComments},
      ),
    ).toMatchSnapshot('md');
  });

  it('parses multiple types of magic comments', () => {
    expect(
      parseLines(
        `
// highlight-next-line
highlighted
// collapse-next-line
collapsed
/* collapse-start */
collapsed
collapsed
/* collapse-end */
`,
        {
          language: 'js',
          metastring: '',
          magicComments: [
            {
              className: 'highlight',
              line: 'highlight-next-line',
              block: {start: 'highlight-start', end: 'highlight-end'},
            },
            {
              className: 'collapse',
              line: 'collapse-next-line',
              block: {start: 'collapse-start', end: 'collapse-end'},
            },
          ],
        },
      ),
    ).toMatchSnapshot();
  });

  it('handles one line with multiple class names', () => {
    expect(
      parseLines(
        `
// highlight-next-line
// collapse-next-line
highlighted and collapsed
/* collapse-start */
/* highlight-start */
highlighted and collapsed
highlighted and collapsed
/* collapse-end */
Only highlighted
/* highlight-end */
/* collapse-start */
Only collapsed
/* highlight-start */
highlighted and collapsed
highlighted and collapsed
/* highlight-end */
Only collapsed
// highlight-next-line
highlighted and collapsed
/* collapse-end */
`,
        {
          language: 'js',
          metastring: '',
          magicComments: [
            {
              className: 'highlight',
              line: 'highlight-next-line',
              block: {start: 'highlight-start', end: 'highlight-end'},
            },
            {
              className: 'collapse',
              line: 'collapse-next-line',
              block: {start: 'collapse-start', end: 'collapse-end'},
            },
          ],
        },
      ),
    ).toMatchSnapshot();
    expect(
      parseLines(
        `// a
// b
// c
// d
line
// b
// d
line
`,
        {
          language: 'js',
          metastring: '',
          magicComments: [
            {className: 'a', line: 'a'},
            {className: 'b', line: 'b'},
            {className: 'c', line: 'c'},
            {className: 'd', line: 'd'},
          ],
        },
      ),
    ).toMatchSnapshot();
  });
});
