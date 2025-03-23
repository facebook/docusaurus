/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  getLineNumbersStart,
  type MagicCommentConfig,
  getCodeBlockTitle,
  parseLanguage,
  parseLines,
  parseCodeBlockMetaOptions,
} from '../codeBlockUtils';

const defaultMagicComments: MagicCommentConfig[] = [
  {
    className: 'theme-code-block-highlighted-line',
    line: 'highlight-next-line',
    block: {start: 'highlight-start', end: 'highlight-end'},
  },
];

describe('parseCodeBlockMetaOptions', () => {
  describe('title', () => {
    it('parses double quote delimited title', () => {
      expect(
        parseCodeBlockMetaOptions(`title="index.js"`, undefined).title,
      ).toBe(`index.js`);
    });

    it('parses single quote delimited title', () => {
      expect(
        parseCodeBlockMetaOptions(`title='index.js'`, undefined).title,
      ).toBe(`index.js`);
    });

    it('parses mismatched quote delimiters as literal', () => {
      expect(
        parseCodeBlockMetaOptions(`title="index.js'`, undefined).title,
      ).toBe(`"index.js'`);
    });

    it('parses undefined metastring', () => {
      expect(
        parseCodeBlockMetaOptions(undefined, undefined).title,
      ).toBeUndefined();
    });

    it('parses metastring with no title specified', () => {
      expect(
        parseCodeBlockMetaOptions(`{1,2-3}`, undefined).title,
      ).toBeUndefined();
    });

    it('parses with multiple metadata title first', () => {
      expect(
        parseCodeBlockMetaOptions(
          `title="index.js" label="JavaScript"`,
          undefined,
        ).title,
      ).toBe(`index.js`);
    });

    it('parses with multiple metadata title last', () => {
      expect(
        parseCodeBlockMetaOptions(
          `label="JavaScript" title="index.js"`,
          undefined,
        ).title,
      ).toBe(`index.js`);
    });

    it('parses double quotes when delimited by single quotes', () => {
      expect(
        parseCodeBlockMetaOptions(
          `title='console.log("Hello, World!")'`,
          undefined,
        ).title,
      ).toBe(`console.log("Hello, World!")`);
    });

    it('parses single quotes when delimited by double quotes', () => {
      expect(
        parseCodeBlockMetaOptions(
          `title="console.log('Hello, World!')"`,
          undefined,
        ).title,
      ).toBe(`console.log('Hello, World!')`);
    });
  });

  // showLineNumber logic is tested in combination with getLineNumber below

  describe('live', () => {
    it('parses live as true', () => {
      expect(parseCodeBlockMetaOptions(`live`, undefined).live).toBe(true);
    });
    it('parses no live as undefined', () => {
      expect(
        parseCodeBlockMetaOptions(` otherOption `, undefined).live,
      ).toBeUndefined();
    });
  });

  describe('noInline', () => {
    it('parses noInline as true', () => {
      expect(parseCodeBlockMetaOptions(`noInline`, undefined).noInline).toBe(
        true,
      );
    });
    it('parses no noInline as undefined', () => {
      expect(
        parseCodeBlockMetaOptions(` otherOption `, undefined).noInline,
      ).toBeUndefined();
    });
  });

  describe('any option', () => {
    it('flag as true', () => {
      expect(
        parseCodeBlockMetaOptions(
          `lowercase camelCase PascalCase UPPER_CASE kebab-case`,
          undefined,
        ),
      ).toMatchSnapshot();
    });

    it('single quotes as string', () => {
      expect(
        parseCodeBlockMetaOptions(
          `lowercase='Hello"Docusaurus Options' camelCase='Hello"Docusaurus Options' PascalCase='Hello"Docusaurus Options' UPPER_CASE='Hello"Docusaurus Options' kebab-case='Hello"Docusaurus Options'`,
          undefined,
        ),
      ).toMatchSnapshot();
    });

    it('double quotes as string', () => {
      expect(
        parseCodeBlockMetaOptions(
          `lowercase="Hello'Docusaurus Options" camelCase="Hello'Docusaurus Options" PascalCase="Hello'Docusaurus Options" UPPER_CASE="Hello'Docusaurus Options" kebab-case="Hello'Docusaurus Options"`,
          undefined,
        ),
      ).toMatchSnapshot();
    });

    it('true', () => {
      expect(
        parseCodeBlockMetaOptions(
          `lowercase=true camelCase=true PascalCase=true UPPER_CASE=true kebab-case=true`,
          undefined,
        ),
      ).toMatchSnapshot();
    });

    it('false', () => {
      expect(
        parseCodeBlockMetaOptions(
          `lowercase=false camelCase=false PascalCase=false UPPER_CASE=false kebab-case=false`,
          undefined,
        ),
      ).toMatchSnapshot();
    });

    it('integer numbers', () => {
      expect(
        parseCodeBlockMetaOptions(
          `lowercase=1 camelCase=2 PascalCase=3 UPPER_CASE=4 kebab-case=5`,
          undefined,
        ),
      ).toMatchSnapshot();
    });

    it('float numbers', () => {
      expect(
        parseCodeBlockMetaOptions(
          `lowercase=1.1 camelCase=2.2 PascalCase=3.3 UPPER_CASE=4.4 kebab-case=5.5`,
          undefined,
        ),
      ).toMatchSnapshot();
    });

    it('non quoted value as string', () => {
      expect(
        parseCodeBlockMetaOptions(
          `lowercase=simple camelCase=simple PascalCase=simple UPPER_CASE=simple kebab-case=simple`,
          undefined,
        ),
      ).toMatchSnapshot();
    });
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
        {
          metastring: '',
          language: 'js',
          magicComments: defaultMagicComments,
        },
      ),
    ).toMatchSnapshot();
    expect(
      parseLines(
        `// highlight-start
aaaaa
// highlight-end
bbbbb`,
        {
          metastring: '',
          language: 'js',
          magicComments: defaultMagicComments,
        },
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
        {
          metastring: '',
          language: 'js',
          magicComments: defaultMagicComments,
        },
      ),
    ).toMatchSnapshot();
  });
  it('respects language', () => {
    expect(
      parseLines(
        `# highlight-next-line
aaaaa
bbbbb`,
        {
          metastring: '',
          language: 'js',
          magicComments: defaultMagicComments,
        },
      ),
    ).toMatchSnapshot('js');
    expect(
      parseLines(
        `/* highlight-next-line */
aaaaa
bbbbb`,
        {
          metastring: '',
          language: 'py',
          magicComments: defaultMagicComments,
        },
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
        {
          metastring: '',
          language: 'py',
          magicComments: defaultMagicComments,
        },
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
        {
          metastring: '',
          language: '',
          magicComments: defaultMagicComments,
        },
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
        {
          metastring: '',
          language: 'jsx',
          magicComments: defaultMagicComments,
        },
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
        {
          metastring: '',
          language: 'html',
          magicComments: defaultMagicComments,
        },
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
        {
          metastring: '',
          language: 'md',
          magicComments: defaultMagicComments,
        },
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

describe('getLineNumbersStart', () => {
  describe('with parsed metaoption', () => {
    it('with nothing set', () => {
      expect(
        getLineNumbersStart({
          showLineNumbers: undefined,
          metaOptions: {},
        }),
      ).toMatchSnapshot();
      expect(
        getLineNumbersStart({
          showLineNumbers: undefined,
          metaOptions: {},
        }),
      ).toMatchSnapshot();
    });

    describe('handles prop', () => {
      describe('combined with metaoptions', () => {
        it('set to true', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: true,
              metaOptions: {
                showLineNumbers: 2,
              },
            }),
          ).toMatchSnapshot();
        });

        it('set to false', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: false,
              metaOptions: {
                showLineNumbers: 2,
              },
            }),
          ).toMatchSnapshot();
        });

        it('set to number', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: 10,
              metaOptions: {
                showLineNumbers: 2,
              },
            }),
          ).toMatchSnapshot();
        });
      });

      describe('standalone', () => {
        it('set to true', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: true,
              metaOptions: {
                showLineNumbers: 2,
              },
            }),
          ).toMatchSnapshot();
        });

        it('set to false', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: false,
              metaOptions: {
                showLineNumbers: 2,
              },
            }),
          ).toMatchSnapshot();
        });

        it('set to number', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: 10,
              metaOptions: {
                showLineNumbers: 2,
              },
            }),
          ).toMatchSnapshot();
        });
      });
    });

    describe('handles metadata', () => {
      describe('standalone', () => {
        it('set as flag', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: undefined,
              metaOptions: {
                showLineNumbers: true,
              },
            }),
          ).toMatchSnapshot();
        });
        it('set with number', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: undefined,
              metaOptions: {
                showLineNumbers: 10,
              },
            }),
          ).toMatchSnapshot();
        });
      });

      describe('combined with other options', () => {
        it('set as flag', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: undefined,
              metaOptions: {
                title: 'file.txt',
                showLineNumbers: true,
                noInline: true,
              },
            }),
          ).toMatchSnapshot();
        });
        it('set with number', () => {
          expect(
            getLineNumbersStart({
              showLineNumbers: undefined,
              metaOptions: {
                title: 'file.txt',
                showLineNumbers: 10,
                noInline: true,
              },
            }),
          ).toMatchSnapshot();
        });
      });
    });
  });

  describe('from metastring', () => {
    it('parses flags as 1', () => {
      expect(
        getLineNumbersStart({
          showLineNumbers: undefined,
          metaOptions: parseCodeBlockMetaOptions(
            ' showLineNumbers ',
            undefined,
          ),
        }),
      ).toMatchSnapshot();
    });

    it('parses value', () => {
      expect(
        getLineNumbersStart({
          showLineNumbers: undefined,
          metaOptions: parseCodeBlockMetaOptions(
            ' showLineNumbers=10 ',
            undefined,
          ),
        }),
      ).toMatchSnapshot();
    });
  });
});

describe('getCodeBlockTitle', () => {
  it('with nothing set', () => {
    expect(
      getCodeBlockTitle({
        titleProp: undefined,
        metaOptions: {},
      }),
    ).toMatchSnapshot();
  });

  describe('returns titleProp', () => {
    it('with empty options', () => {
      expect(
        getCodeBlockTitle({
          titleProp: 'Prop',
          metaOptions: {},
        }),
      ).toMatchSnapshot();
    });
    it('with empty string on option', () => {
      expect(
        getCodeBlockTitle({
          titleProp: 'Prop',
          metaOptions: {
            title: '',
          },
        }),
      ).toMatchSnapshot();
    });
  });

  describe('returns option', () => {
    it('with undefined prop', () => {
      expect(
        getCodeBlockTitle({
          titleProp: undefined,
          metaOptions: {
            title: 'Option',
          },
        }),
      ).toMatchSnapshot();
    });
    it('with empty prop', () => {
      expect(
        getCodeBlockTitle({
          titleProp: '',
          metaOptions: {
            title: 'Option',
          },
        }),
      ).toMatchSnapshot();
    });
    it('with filled prop', () => {
      expect(
        getCodeBlockTitle({
          titleProp: 'Prop',
          metaOptions: {
            title: 'Option',
          },
        }),
      ).toMatchSnapshot();
    });
  });
});
