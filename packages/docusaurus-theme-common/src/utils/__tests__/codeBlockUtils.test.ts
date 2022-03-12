/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  parseCodeBlockTitle,
  parseLanguage,
  parseLines,
} from '../codeBlockUtils';

describe('parseCodeBlockTitle', () => {
  it('parses double quote delimited title', () => {
    expect(parseCodeBlockTitle(`title="index.js"`)).toEqual(`index.js`);
  });

  it('parses single quote delimited title', () => {
    expect(parseCodeBlockTitle(`title='index.js'`)).toEqual(`index.js`);
  });

  it('does not parse mismatched quote delimiters', () => {
    expect(parseCodeBlockTitle(`title="index.js'`)).toEqual(``);
  });

  it('parses undefined metastring', () => {
    expect(parseCodeBlockTitle(undefined)).toEqual(``);
  });

  it('parses metastring with no title specified', () => {
    expect(parseCodeBlockTitle(`{1,2-3}`)).toEqual(``);
  });

  it('parses with multiple metadata title first', () => {
    expect(parseCodeBlockTitle(`title="index.js" label="JavaScript"`)).toEqual(
      `index.js`,
    );
  });

  it('parses with multiple metadata title last', () => {
    expect(parseCodeBlockTitle(`label="JavaScript" title="index.js"`)).toEqual(
      `index.js`,
    );
  });

  it('parses double quotes when delimited by single quotes', () => {
    expect(parseCodeBlockTitle(`title='console.log("Hello, World!")'`)).toEqual(
      `console.log("Hello, World!")`,
    );
  });

  it('parses single quotes when delimited by double quotes', () => {
    expect(parseCodeBlockTitle(`title="console.log('Hello, World!')"`)).toEqual(
      `console.log('Hello, World!')`,
    );
  });
});

describe('parseLanguage', () => {
  it('works', () => {
    expect(parseLanguage('language-foo xxx yyy')).toEqual('foo');
    expect(parseLanguage('xxxxx language-foo yyy')).toEqual('foo');
    expect(parseLanguage('xx-language-foo yyyy')).toBeUndefined();
    expect(parseLanguage('xxx yyy zzz')).toBeUndefined();
  });
});

describe('parseLines', () => {
  it('does not parse content with metastring', () => {
    expect(parseLines('aaaaa\nbbbbb', '{1}', 'js')).toMatchSnapshot();
    expect(
      parseLines(
        `// highlight-next-line
aaaaa
bbbbb`,
        '{1}',
        'js',
      ),
    ).toMatchSnapshot();
    expect(
      parseLines(
        `aaaaa
bbbbb`,
        '{1}',
      ),
    ).toMatchSnapshot();
  });
  it('does not parse content with no language', () => {
    expect(
      parseLines(
        `// highlight-next-line
aaaaa
bbbbb`,
        '',
        undefined,
      ),
    ).toMatchSnapshot();
  });
  it('removes lines correctly', () => {
    expect(
      parseLines(
        `// highlight-next-line
aaaaa
bbbbb`,
        '',
        'js',
      ),
    ).toMatchSnapshot();
    expect(
      parseLines(
        `// highlight-start
aaaaa
// highlight-end
bbbbb`,
        '',
        'js',
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
        '',
        'js',
      ),
    ).toMatchSnapshot();
  });
  it('respects language', () => {
    expect(
      parseLines(
        `# highlight-next-line
aaaaa
bbbbb`,
        '',
        'js',
      ),
    ).toMatchSnapshot();
    expect(
      parseLines(
        `/* highlight-next-line */
aaaaa
bbbbb`,
        '',
        'py',
      ),
    ).toMatchSnapshot();
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
        '',
        'py',
      ),
    ).toMatchSnapshot();
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
        '',
        '',
      ),
    ).toMatchSnapshot();
  });
});
