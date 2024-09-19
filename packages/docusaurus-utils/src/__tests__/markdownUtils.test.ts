/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import dedent from 'dedent';
import {
  createExcerpt,
  parseMarkdownContentTitle,
  parseMarkdownHeadingId,
  writeMarkdownHeadingId,
  escapeMarkdownHeadingIds,
  unwrapMdxCodeBlocks,
  admonitionTitleToDirectiveLabel,
  parseMarkdownFile,
  DEFAULT_PARSE_FRONT_MATTER,
  parseFileContentFrontMatter,
} from '../markdownUtils';

describe('createExcerpt', () => {
  it('creates excerpt for text-only content', () => {
    expect(
      createExcerpt(dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toBe(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
    );
  });

  it('creates excerpt for regular content with regular title', () => {
    expect(
      createExcerpt(dedent`

          # Markdown Regular Title

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toBe(
      // H1 title is skipped on purpose, because we don't want the page to have
      // SEO metadata title === description
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
    );
  });

  it('creates excerpt for regular content with alternate title', () => {
    expect(
      createExcerpt(dedent`

          Markdown Alternate Title
          ================

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toBe(
      // H1 title is skipped on purpose, because we don't want the page to have
      // SEO metadata title === description
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
    );
  });

  it('creates excerpt for content with h2 heading', () => {
    expect(
      createExcerpt(dedent`
          ## Lorem ipsum dolor sit amet

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toBe('Lorem ipsum dolor sit amet');
  });

  it('creates excerpt for content beginning with blockquote', () => {
    expect(
      createExcerpt(dedent`
          > Lorem ipsum dolor sit amet

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toBe('Lorem ipsum dolor sit amet');
  });

  it('creates excerpt for content beginning with image (eg. blog post)', () => {
    expect(
      createExcerpt(dedent`
          ![Lorem ipsum](/img/lorem-ipsum.svg)
        `),
    ).toBe('Lorem ipsum');
  });

  it('creates excerpt for content beginning with admonitions', () => {
    expect(
      createExcerpt(dedent`
          import Component from '@site/src/components/Component'

          :::caution

          Lorem ipsum dolor sit amet, consectetur adipiscing elit.

          :::

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
  });

  it('creates excerpt for content with imports/exports declarations and Markdown markup, as well as Emoji', () => {
    expect(
      createExcerpt(dedent`
          import Component from '@site/src/components/Component';
          import Component from '@site/src/components/Component'
          import './styles.css';

          export function ItemCol(props) {
            return <Item {...props} className={'col col--6 margin-bottom--lg'}/>
          }

          export function ItemCol(props) {
            return <Item {...props} className={'col col--6 margin-bottom--lg'}/>
          };

          Lorem **ipsum** dolor sit \`amet\`[^1], consectetur _adipiscing_ elit. [**Vestibulum**](https://wiktionary.org/wiki/vestibulum) ex urna[^note], ~~molestie~~ et sagittis ut, varius ac justo :wink:.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toBe(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
    );
  });

  it('creates excerpt for content with imports/exports declarations, with CRLF line endings', () => {
    expect(
      createExcerpt(
        dedent`
          import Component from '@site/src/components/Component';

          export function ItemCol(props) {
            return <Item {...props} className={'col col--6 margin-bottom--lg'}/>
          }

          Lorem **ipsum** dolor sit \`amet\`[^1], consectetur _adipiscing_ elit. [**Vestibulum**](https://wiktionary.org/wiki/vestibulum) ex urna[^note], ~~molestie~~ et sagittis ut, varius ac justo :wink:.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `.replace(/\n/g, '\r\n'),
      ),
    ).toBe(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
    );
  });

  it('creates excerpt for heading specified with anchor-id syntax', () => {
    expect(
      createExcerpt(dedent`
          ## Markdown title {#my-anchor-id}
        `),
    ).toBe('Markdown title');
  });

  it('creates excerpt for content with various code blocks', () => {
    expect(
      createExcerpt(dedent`
          \`\`\`jsx
          import React from 'react';
          import Layout from '@theme/Layout';
          \`\`\`

          Lorem \`ipsum\` dolor sit amet, consectetur \`adipiscing elit\`.
        `),
    ).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
  });

  it('creates excerpt after multi-line imports', () => {
    expect(
      createExcerpt(dedent`
          import React, {
            type ReactNode,
          } from 'react';

          Lorem \`ipsum\` dolor sit amet, consectetur \`adipiscing elit\`.
        `),
    ).toBe('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
  });
});

describe('parseMarkdownContentTitle', () => {
  it('parses markdown h1 title at the top', () => {
    const markdown = dedent`

          # Markdown Title

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title at the top and remove it', () => {
    const markdown = dedent`

          # Markdown Title

          Lorem Ipsum

        `;
    expect(
      parseMarkdownContentTitle(markdown, {removeContentTitle: true}),
    ).toEqual({
      content: 'Lorem Ipsum',
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title inside backticks at the top and unwrap inline code block', () => {
    const markdown = dedent`

          # \`Markdown Title\`

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title with interspersed backticks at the top and unwrap inline code block', () => {
    const markdown = dedent`

          # Markdown \`Title\` With \`Many\` Backticks!

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title With Many Backticks!',
    });
  });

  it('parses markdown h1 title and trim content', () => {
    const markdown = `

# Markdown Title

Lorem Ipsum



`;

    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown.trim(),
      contentTitle: 'Markdown Title',
    });
  });

  it('parses not parse markdown h1 title and trim content', () => {
    const markdown = `

Lorem Ipsum

`;

    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown.trim(),
      contentTitle: undefined,
    });
  });

  it('parses markdown h1 title with fixed anchor-id syntax', () => {
    const markdown = dedent`

          # Markdown Title {#my-anchor-id}

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title with CRLF break', () => {
    const markdown = `# Markdown Title\r\n\r\nLorem Ipsum`;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 setext title with CRLF break', () => {
    const markdown = `Markdown Title\r\n=====\r\n\r\nLorem Ipsum`;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title at the top (atx style with closing #)', () => {
    const markdown = dedent`

          # Markdown Title #

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title at the top followed by h2 title', () => {
    const markdown = dedent`

          # Markdown Title

          ## Heading 2

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses only first h1 title', () => {
    const markdown = dedent`

          # Markdown Title

          # Markdown Title 2

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('does not parse title that is not at the top', () => {
    const markdown = dedent`

          Lorem Ipsum

          # Markdown Title 2

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: undefined,
    });
  });

  it('parses markdown h1 alternate title', () => {
    const markdown = dedent`

          Markdown Title
          ================

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 alternate title and remove it', () => {
    const markdown = dedent`

          Markdown Title
          ================

          Lorem Ipsum

        `;
    expect(
      parseMarkdownContentTitle(markdown, {removeContentTitle: true}),
    ).toEqual({
      content: 'Lorem Ipsum',
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title placed after import declarations', () => {
    const markdown = dedent`
          import Component1 from '@site/src/components/Component1';

          import Component2 from '@site/src/components/Component2'
          import Component3 from '@site/src/components/Component3'
          import './styles.css';

          # Markdown Title

          Lorem Ipsum

        `;

    // Remove the useless line breaks? Does not matter too much
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title placed after various import declarations', () => {
    const markdown = `
import DefaultComponent from '@site/src/components/Component1';
import DefaultComponent2 from '../relative/path/Component2';
import * as EntireComponent from './relative/path/Component3';

import { Component4 }   from    "double-quote-module-name";
import { Component51,   Component52, \n Component53, \n\t\t Component54 } from "double-quote-module-name";
import { Component6 as AliasComponent6 } from "module-name";
import DefaultComponent8,   { DefaultComponent81 ,\nDefaultComponent82 } from "module-name";
import DefaultComponent9,    * as EntireComponent9 from "module-name";
import {Component71,\nComponent72 as AliasComponent72,\nComponent73\n} \nfrom "module-name";

import './styles.css';
import _ from 'underscore';
import "module-name"

# Markdown Title

Lorem Ipsum
`;

    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown.trim(),
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title placed after various import declarations and remove it', () => {
    const markdown = `
import DefaultComponent from '@site/src/components/Component1';
import DefaultComponent2 from '../relative/path/Component2';
import * as EntireComponent from './relative/path/Component3';

import { Component4 }   from    "double-quote-module-name";
import { Component51,   Component52, \n Component53, \n\t\t Component54 } from "double-quote-module-name";
import { Component6 as AliasComponent6 } from "module-name";
import DefaultComponent8,   { DefaultComponent81 ,\nDefaultComponent82 } from "module-name";
import DefaultComponent9,    * as EntireComponent9 from "module-name";
import {Component71,\nComponent72 as AliasComponent72,\nComponent73\n} \nfrom "module-name";

import './styles.css';
import _ from 'underscore';
import "module-name"

# Markdown Title

Lorem Ipsum
`;

    expect(
      parseMarkdownContentTitle(markdown, {removeContentTitle: true}),
    ).toEqual({
      content: markdown.trim().replace('# Markdown Title\n', ''),
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 alternate title placed after import declarations', () => {
    const markdown = dedent`

          import Component from '@site/src/components/Component';
          import Component from '@site/src/components/Component'
          import './styles.css';

          Markdown Title
          ==============

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 alternate title placed after import declarations and remove it', () => {
    const markdown = dedent`

          import Component from '@site/src/components/Component';
          import Component from '@site/src/components/Component'
          import './styles.css';

          Markdown Title
          ==============

          Lorem Ipsum

        `;
    expect(
      parseMarkdownContentTitle(markdown, {removeContentTitle: true}),
    ).toEqual({
      content: markdown.replace('Markdown Title\n==============\n', ''),
      contentTitle: 'Markdown Title',
    });
  });

  it('parses title-only', () => {
    const markdown = '# Document With Only A Title';
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Document With Only A Title',
    });
  });

  it('does not parse markdown h1 title in the middle of a doc', () => {
    const markdown = dedent`

          Lorem Ipsum

          # Markdown Title

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: undefined,
    });
  });

  it('does not parse markdown h1 alternate title in the middle of the doc', () => {
    const markdown = dedent`

          Lorem Ipsum

          Markdown Title
          ================

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: undefined,
    });
  });

  it('parses markdown h1 title placed after multiple import declarations', () => {
    const markdown = dedent`
          import Component1 from '@site/src/components/Component1';
          import Component2 from '@site/src/components/Component2';
          import Component3 from '@site/src/components/Component3';
          import Component4 from '@site/src/components/Component4';
          import Component5 from '@site/src/components/Component5';
          import Component6 from '@site/src/components/Component6';
          import Component7 from '@site/src/components/Component7';
          import Component8 from '@site/src/components/Component8';
          import Component9 from '@site/src/components/Component9';
          import Component10 from '@site/src/components/Component10';
          import Component11 from '@site/src/components/Component11';
          import Component12 from '@site/src/components/Component12';
          import Component13 from '@site/src/components/Component13';
          import Component14 from '@site/src/components/Component14';
          import Component15 from '@site/src/components/Component15';

          # Markdown Title

          Lorem Ipsum

        `;

    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  it('parses markdown h1 title placed after multiple import declarations and remove it', () => {
    const markdown = dedent`
          import Component1 from '@site/src/components/Component1';
          import Component2 from '@site/src/components/Component2';
          import Component3 from '@site/src/components/Component3';
          import Component4 from '@site/src/components/Component4';
          import Component5 from '@site/src/components/Component5';
          import Component6 from '@site/src/components/Component6';
          import Component7 from '@site/src/components/Component7';
          import Component8 from '@site/src/components/Component8';
          import Component9 from '@site/src/components/Component9';
          import Component10 from '@site/src/components/Component10';
          import Component11 from '@site/src/components/Component11';
          import Component12 from '@site/src/components/Component12';
          import Component13 from '@site/src/components/Component13';
          import Component14 from '@site/src/components/Component14';
          import Component15 from '@site/src/components/Component15';

          # Markdown Title

          Lorem Ipsum

        `;

    expect(
      parseMarkdownContentTitle(markdown, {removeContentTitle: true}),
    ).toEqual({
      content: markdown.replace('# Markdown Title\n', ''),
      contentTitle: 'Markdown Title',
    });
  });
});

describe('parseFileContentFrontMatter', () => {
  function test(fileContent: string) {
    return parseFileContentFrontMatter(fileContent);
  }

  it('can parse front matter', () => {
    const input = dedent`
        ---
        title: Frontmatter title
        author:
          age: 42
          birth: 2000-07-23
        ---

        Some text
        `;

    const expectedResult = {
      content: 'Some text',
      frontMatter: {
        title: 'Frontmatter title',
        author: {age: 42, birth: new Date('2000-07-23')},
      },
    };

    const result = test(input) as typeof expectedResult;
    expect(result).toEqual(expectedResult);
    expect(result.frontMatter.author.birth).toBeInstanceOf(Date);

    // A regression test, ensure we don't return gray-matter cached objects
    result.frontMatter.title = 'modified';
    // @ts-expect-error: ok
    result.frontMatter.author.age = 53;
    expect(test(input)).toEqual(expectedResult);
  });
});

describe('parseMarkdownFile', () => {
  async function test(
    fileContent: string,
    options?: Partial<Parameters<typeof parseMarkdownFile>>[0],
  ) {
    return parseMarkdownFile({
      fileContent,
      filePath: 'some-file-path.mdx',
      parseFrontMatter: DEFAULT_PARSE_FRONT_MATTER,
      ...options,
    });
  }

  it('parse markdown with front matter', async () => {
    await expect(
      test(dedent`
        ---
        title: Frontmatter title
        ---

        Some text
        `),
    ).resolves.toMatchSnapshot();
  });

  it('parse markdown with custom front matter parser', async () => {
    await expect(
      test(
        dedent`
        ---
        title: Frontmatter title
        age: 42
        ---

        Some text
        `,
        {
          parseFrontMatter: async (params) => {
            const result = await params.defaultParseFrontMatter(params);
            return {
              ...result,
              frontMatter: {
                ...result.frontMatter,
                age: result.frontMatter.age * 2,
                extra: 'value',
                great: true,
              },
            };
          },
        },
      ),
    ).resolves.toMatchSnapshot();
  });

  it('parses first heading as contentTitle', async () => {
    await expect(
      test(dedent`
        # Markdown Title

        Some text
        `),
    ).resolves.toMatchSnapshot();
  });

  it('warns about duplicate titles (front matter + markdown)', async () => {
    await expect(
      test(dedent`
        ---
        title: Frontmatter title
        ---

        # Markdown Title

        Some text
        `),
    ).resolves.toMatchSnapshot();
  });

  it('warns about duplicate titles (front matter + markdown alternate)', async () => {
    await expect(
      test(dedent`
        ---
        title: Frontmatter title
        ---

        Markdown Title alternate
        ================

        Some text
        `),
    ).resolves.toMatchSnapshot();
  });

  it('does not warn for duplicate title if markdown title is not at the top', async () => {
    await expect(
      test(dedent`
        ---
        title: Frontmatter title
        ---

        foo

        # Markdown Title
        `),
    ).resolves.toMatchSnapshot();
  });

  it('deletes only first heading', async () => {
    await expect(
      test(dedent`
        # Markdown Title

        test test test # test bar

        # Markdown Title 2

        ### Markdown Title h3
        `),
    ).resolves.toMatchSnapshot();
  });

  it('parses front-matter and ignore h2', async () => {
    await expect(
      test(
        dedent`
          ---
          title: Frontmatter title
          ---
          ## test
          `,
      ),
    ).resolves.toMatchSnapshot();
  });

  it('reads front matter only', async () => {
    await expect(
      test(dedent`
        ---
        title: test
        ---
        `),
    ).resolves.toMatchSnapshot();
  });

  it('parses title only', async () => {
    await expect(test('# test')).resolves.toMatchSnapshot();
  });

  it('parses title only alternate', async () => {
    await expect(
      test(dedent`
        test
        ===
        `),
    ).resolves.toMatchSnapshot();
  });

  it('warns about duplicate titles', async () => {
    await expect(
      test(dedent`
        ---
        title: Frontmatter title
        ---
        # test
        `),
    ).resolves.toMatchSnapshot();
  });

  it('ignores markdown title if its not a first text', async () => {
    await expect(
      test(dedent`
        foo
        # test
        `),
    ).resolves.toMatchSnapshot();
  });

  it('deletes only first heading 2', async () => {
    await expect(
      test(dedent`
        # test

        test test test test test test
        test test test # test bar
        # test2
        ### test
        test3
        `),
    ).resolves.toMatchSnapshot();
  });

  it('handles code blocks', async () => {
    await expect(
      test(dedent`
        \`\`\`js
        code
        \`\`\`

        Content
      `),
    ).resolves.toMatchSnapshot();
    await expect(
      test(dedent`
        \`\`\`\`js
        Foo
        \`\`\`diff
        code
        \`\`\`
        Bar
        \`\`\`\`

        Content
      `),
    ).resolves.toMatchSnapshot();
    await expect(
      test(dedent`
        \`\`\`\`js
        Foo
        \`\`\`diff
        code
        \`\`\`\`

        Content
      `),
    ).resolves.toMatchSnapshot();
  });

  it('throws for invalid front matter', async () => {
    await expect(
      test(dedent`
      ---
      foo: f: a
      ---
      `),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line at line 2, column 7:
          foo: f: a
                ^"
    `);
  });
});

describe('parseMarkdownHeadingId', () => {
  it('can parse simple heading without id', () => {
    expect(parseMarkdownHeadingId('## Some heading')).toEqual({
      text: '## Some heading',
      id: undefined,
    });
  });

  it('can parse simple heading with id', () => {
    expect(parseMarkdownHeadingId('## Some heading {#custom-_id}')).toEqual({
      text: '## Some heading',
      id: 'custom-_id',
    });
  });

  it('can parse heading not ending with the id', () => {
    expect(parseMarkdownHeadingId('## {#custom-_id} Some heading')).toEqual({
      text: '## {#custom-_id} Some heading',
      id: undefined,
    });
  });

  it('can parse heading with multiple id', () => {
    expect(parseMarkdownHeadingId('## Some heading {#id1} {#id2}')).toEqual({
      text: '## Some heading {#id1}',
      id: 'id2',
    });
  });

  it('can parse heading with link and id', () => {
    expect(
      parseMarkdownHeadingId(
        '## Some heading [facebook](https://facebook.com) {#id}',
      ),
    ).toEqual({
      text: '## Some heading [facebook](https://facebook.com)',
      id: 'id',
    });
  });

  it('can parse heading with only id', () => {
    expect(parseMarkdownHeadingId('## {#id}')).toEqual({
      text: '##',
      id: 'id',
    });
  });

  it('does not parse empty id', () => {
    expect(parseMarkdownHeadingId('## a {#}')).toEqual({
      text: '## a {#}',
      id: undefined,
    });
  });

  it('can parse id with more characters', () => {
    expect(parseMarkdownHeadingId('## a {#你好}')).toEqual({
      text: '## a',
      id: '你好',
    });

    expect(parseMarkdownHeadingId('## a {#2022.1.1}')).toEqual({
      text: '## a',
      id: '2022.1.1',
    });

    expect(parseMarkdownHeadingId('## a {#a#b}')).toEqual({
      text: '## a',
      id: 'a#b',
    });
  });

  // The actual behavior is unspecified, just need to ensure it stays consistent
  it('handles unmatched boundaries', () => {
    expect(parseMarkdownHeadingId('## a {# a {#bcd}')).toEqual({
      text: '## a {# a',
      id: 'bcd',
    });

    expect(parseMarkdownHeadingId('## a {#bcd}}')).toEqual({
      text: '## a {#bcd}}',
      id: undefined,
    });

    expect(parseMarkdownHeadingId('## a {#b{cd}')).toEqual({
      text: '## a',
      id: 'b{cd',
    });

    expect(parseMarkdownHeadingId('## a {#b{#b}')).toEqual({
      text: '## a {#b',
      id: 'b',
    });
  });
});

describe('escapeMarkdownHeadingIds', () => {
  it('can escape simple heading id', () => {
    expect(escapeMarkdownHeadingIds('# title 1 {#id-1}')).toBe(
      '# title 1 \\{#id-1}',
    );
    expect(escapeMarkdownHeadingIds('# title 1    {#id-1}')).toBe(
      '# title 1    \\{#id-1}',
    );
    expect(escapeMarkdownHeadingIds('# title 1{#id-1}')).toBe(
      '# title 1\\{#id-1}',
    );
    expect(escapeMarkdownHeadingIds('# title 1 \\{#id-1}')).toBe(
      '# title 1 \\{#id-1}',
    );
    expect(escapeMarkdownHeadingIds('# title 1\\{#id-1}')).toBe(
      '# title 1\\{#id-1}',
    );
  });

  it('can escape level 1-6 heading ids', () => {
    expect(
      escapeMarkdownHeadingIds(dedent`
        # title 1 {#id-1}

        ## title 2 {#id-2}

        ### title 3 {#id-3}

        #### title 4 {#id-4}

        ##### title 5 {#id-5}

        ###### title 6 {#id-6}
    `),
    ).toEqual(dedent`
        # title 1 \{#id-1}

        ## title 2 \{#id-2}

        ### title 3 \{#id-3}

        #### title 4 \{#id-4}

        ##### title 5 \{#id-5}

        ###### title 6 \{#id-6}
    `);
  });

  it('does not escape level 7 heading id', () => {
    expect(
      escapeMarkdownHeadingIds(dedent`
        ####### title 7 {#id-7}
    `),
    ).toEqual(dedent`
        ####### title 7 {#id-7}
    `);
  });

  it('does not escape non-heading', () => {
    expect(
      escapeMarkdownHeadingIds(dedent`
        some text {#non-id}
    `),
    ).toEqual(dedent`
        some text {#non-id}
    `);
  });

  it('works for realistic example', () => {
    expect(
      escapeMarkdownHeadingIds(dedent`
        # Support

        Docusaurus has a community of thousands of developers.

        On this page we've listed some Docusaurus-related communities that you can be a part of; see the other pages in this section for additional online and in-person learning materials.

        Before participating in Docusaurus' communities, [please read our Code of Conduct](https://engineering.fb.com/codeofconduct/). We have adopted the [Contributor Covenant](https://www.contributor-covenant.org/) and we expect that all community members adhere to the guidelines within.

        ## Stack Overflow {#stack-overflow}

        Stack Overflow is a popular forum to ask code-level questions or if you're stuck with a specific error. Read through the [existing questions](https://stackoverflow.com/questions/tagged/docusaurus) tagged with **docusaurus** or [ask your own](https://stackoverflow.com/questions/ask?tags=docusaurus)!

        ## Discussion forums \{#discussion-forums}

        There are many online forums for discussion about best practices and application architecture as well as the future of Docusaurus. If you have an answerable code-level question, Stack Overflow is usually a better fit.

        - [Docusaurus online chat](https://discord.gg/docusaurus)
          - [#help-and-questions](https://discord.gg/fwbcrQ3dHR) for user help
          - [#contributors](https://discord.gg/6g6ASPA) for contributing help
        - [Reddit's Docusaurus community](https://www.reddit.com/r/docusaurus/)

        ## Feature requests {#feature-requests}

        For new feature requests, you can create a post on our [feature requests board (Canny)](/feature-requests), which is a handy tool for road-mapping and allows for sorting by upvotes, which gives the core team a better indicator of what features are in high demand, as compared to GitHub issues which are harder to triage. Refrain from making a Pull Request for new features (especially large ones) as someone might already be working on it or will be part of our roadmap. Talk to us first!

        ## News {#news}

        For the latest news about Docusaurus, [follow **@docusaurus** on X](https://x.com/docusaurus) and the [official Docusaurus blog](/blog) on this website.
    `),
    ).toEqual(dedent`
        # Support

        Docusaurus has a community of thousands of developers.

        On this page we've listed some Docusaurus-related communities that you can be a part of; see the other pages in this section for additional online and in-person learning materials.

        Before participating in Docusaurus' communities, [please read our Code of Conduct](https://engineering.fb.com/codeofconduct/). We have adopted the [Contributor Covenant](https://www.contributor-covenant.org/) and we expect that all community members adhere to the guidelines within.

        ## Stack Overflow \{#stack-overflow}

        Stack Overflow is a popular forum to ask code-level questions or if you're stuck with a specific error. Read through the [existing questions](https://stackoverflow.com/questions/tagged/docusaurus) tagged with **docusaurus** or [ask your own](https://stackoverflow.com/questions/ask?tags=docusaurus)!

        ## Discussion forums \{#discussion-forums}

        There are many online forums for discussion about best practices and application architecture as well as the future of Docusaurus. If you have an answerable code-level question, Stack Overflow is usually a better fit.

        - [Docusaurus online chat](https://discord.gg/docusaurus)
          - [#help-and-questions](https://discord.gg/fwbcrQ3dHR) for user help
          - [#contributors](https://discord.gg/6g6ASPA) for contributing help
        - [Reddit's Docusaurus community](https://www.reddit.com/r/docusaurus/)

        ## Feature requests \{#feature-requests}

        For new feature requests, you can create a post on our [feature requests board (Canny)](/feature-requests), which is a handy tool for road-mapping and allows for sorting by upvotes, which gives the core team a better indicator of what features are in high demand, as compared to GitHub issues which are harder to triage. Refrain from making a Pull Request for new features (especially large ones) as someone might already be working on it or will be part of our roadmap. Talk to us first!

        ## News \{#news}

        For the latest news about Docusaurus, [follow **@docusaurus** on X](https://x.com/docusaurus) and the [official Docusaurus blog](/blog) on this website.
    `);
  });
});

describe('unwrapMdxCodeBlocks', () => {
  it('can unwrap a simple mdx code block', () => {
    expect(
      unwrapMdxCodeBlocks(dedent`
        # Title

        \`\`\`mdx-code-block
        import Comp, {User} from "@site/components/comp"

        <Comp prop="test">
          <User user={{firstName: "Sébastien"}} />
        </Comp>

        export const age = 36
        \`\`\`

        text
    `),
    ).toEqual(dedent`
        # Title

        import Comp, {User} from "@site/components/comp"

        <Comp prop="test">
          <User user={{firstName: "Sébastien"}} />
        </Comp>

        export const age = 36

        text
    `);
  });

  it('can unwrap a simple mdx code block with CRLF', () => {
    // Note: looks like string dedent mess up with \r
    expect(
      unwrapMdxCodeBlocks(`
# Title\r
\`\`\`mdx-code-block\r
import Comp, {User} from "@site/components/comp"\r
\r
<Comp prop="test">\r
  <User user={{firstName: "Sébastien"}} />\r
</Comp>\r
\r
export const age = 36\r
\`\`\`\r
\r
text\r
`),
    ).toBe(`
# Title\r
import Comp, {User} from "@site/components/comp"\r
\r
<Comp prop="test">\r
  <User user={{firstName: "Sébastien"}} />\r
</Comp>\r
\r
export const age = 36\r
\r
text\r
`);
  });

  it('can unwrap a nested mdx code block', () => {
    expect(
      unwrapMdxCodeBlocks(dedent`
        # Title

        \`\`\`\`mdx-code-block

        some content

        \`\`\`js
        export const age = 36
        \`\`\`

        \`\`\`\`

        text
    `),
    ).toEqual(dedent`
        # Title


        some content

        \`\`\`js
        export const age = 36
        \`\`\`


        text
    `);
  });

  it('can unwrap indented mdx code block', () => {
    expect(
      unwrapMdxCodeBlocks(dedent`
        # Title

        <div>
            \`\`\`mdx-code-block
            content
            \`\`\`
        </div>

          \`\`\`\`mdx-code-block
          content2
          \`\`\`\`

        text
    `),
    ).toEqual(dedent`
      # Title

      <div>
          content
      </div>

        content2

      text
    `);
  });

  it('works for realistic example', () => {
    expect(
      unwrapMdxCodeBlocks(dedent`
        # Canary releases

        \`\`\`mdx-code-block
        import {
          VersionsProvider,
        } from "@site/src/components/Versions";

        <VersionsProvider prop={{attr: 42}} test="yes">
        \`\`\`

        Docusaurus has a canary releases system.

        It permits you to **test new unreleased features** as soon as the pull requests are merged on the [next version](./5-release-process.md#next-version) of Docusaurus.

        It is a good way to **give feedback to maintainers**, ensuring the newly implemented feature works as intended.

        :::note

        Using a canary release in production might seem risky, but in practice, it's not.

        A canary release passes all automated tests and is used in production by the Docusaurus site itself.

        \`\`\`mdx-code-block
        </VersionsProvider>
        \`\`\`
    `),
    ).toEqual(dedent`
        # Canary releases

        import {
          VersionsProvider,
        } from "@site/src/components/Versions";

        <VersionsProvider prop={{attr: 42}} test="yes">

        Docusaurus has a canary releases system.

        It permits you to **test new unreleased features** as soon as the pull requests are merged on the [next version](./5-release-process.md#next-version) of Docusaurus.

        It is a good way to **give feedback to maintainers**, ensuring the newly implemented feature works as intended.

        :::note

        Using a canary release in production might seem risky, but in practice, it's not.

        A canary release passes all automated tests and is used in production by the Docusaurus site itself.

        </VersionsProvider>
    `);
  });

  it('allow spaces before mdx-code-block info string', () => {
    expect(
      unwrapMdxCodeBlocks(dedent`
        # Title

        \`\`\` mdx-code-block
        import Comp, {User} from "@site/components/comp"

        <Comp prop="test">
          <User user={{firstName: "Sébastien"}} />
        </Comp>

        export const age = 36
        \`\`\`

        text
    `),
    ).toEqual(dedent`
        # Title

        import Comp, {User} from "@site/components/comp"

        <Comp prop="test">
          <User user={{firstName: "Sébastien"}} />
        </Comp>

        export const age = 36

        text
    `);
  });
});

describe('admonitionTitleToDirectiveLabel', () => {
  const directives = ['info', 'note', 'tip', 'caution'];

  it('does not transform markdown without any admonition', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        dedent`
        # Title

        intro

        ## Sub Title

        content
    `,
        directives,
      ),
    ).toEqual(dedent`
        # Title

        intro

        ## Sub Title

        content
    `);
  });

  it('transform simple admonition', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        dedent`
        before

        :::note Title

        content

        :::

        after
    `,
        directives,
      ),
    ).toEqual(dedent`
        before

        :::note[Title]

        content

        :::

        after
    `);
  });

  it('does not transform already transformed admonition', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        dedent`
        before

        :::note[Title]

        content

        :::

        after
    `,
        directives,
      ),
    ).toEqual(dedent`
        before

        :::note[Title]

        content

        :::

        after
    `);
  });

  it('does not transform non-container directives', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        dedent`
        before

        ::note Title

        content

        :::

        after
    `,
        directives,
      ),
    ).toEqual(dedent`
        before

        ::note Title

        content

        :::

        after
    `);
  });

  it('transforms space indented directives', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        dedent`
        before

         :::note 1 space

         content

         :::

          :::note 2 spaces

          content

          :::

        after
    `,
        directives,
      ),
    ).toEqual(dedent`
        before

         :::note[1 space]

         content

         :::

          :::note[2 spaces]

          content

          :::

        after
    `);
  });

  it('transforms tab indented directives', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        `
before

\t:::note 1 tab

\tcontent

\t:::

\t\t:::note 2 tabs

\t\tcontent

\t\t:::

after
    `,
        directives,
      ),
    ).toBe(`
before

\t:::note[1 tab]

\tcontent

\t:::

\t\t:::note[2 tabs]

\t\tcontent

\t\t:::

after
    `);
  });

  it('transforms directives in quotes', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        `
before

> :::caution There be dragons
>
> This is the admonition content
>
> :::
>
>> :::caution There be dragons
>>
>> This is the admonition content
>>
>> :::
> > :::caution There be dragons
> >
> > This is the admonition content
> >
> > :::

after
    `,
        directives,
      ),
    ).toBe(`
before

> :::caution[There be dragons]
>
> This is the admonition content
>
> :::
>
>> :::caution[There be dragons]
>>
>> This is the admonition content
>>
>> :::
> > :::caution[There be dragons]
> >
> > This is the admonition content
> >
> > :::

after
    `);
  });

  it('does not transform admonition without title', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        dedent`
        before

        :::note

        content

        :::

        after
    `,
        directives,
      ),
    ).toEqual(dedent`
        before

        :::note

        content

        :::

        after
    `);
  });

  it('does not transform non-admonition directive', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        dedent`
        before

        :::whatever Title

        content

        :::

        after
    `,
        directives,
      ),
    ).toEqual(dedent`
        before

        :::whatever Title

        content

        :::

        after
    `);
  });

  it('transform real-world nested messy admonitions', () => {
    expect(
      admonitionTitleToDirectiveLabel(
        dedent`
        ---
        title: "contains :::note"
        ---

        # Title

        intro

        ::::note note **title**

        note content

        ::::tip tip <span>title</span>

        tip content

        :::whatever whatever title

        whatever content

        :::

        ::::

        :::::

        ## Heading {#my-heading}

        ::::info       weird spaced title

        into content

        :::tip[tip directiveLabel]

        tip content

        ::::

        ## Conclusion

        end
    `,
        directives,
      ),
    ).toEqual(dedent`
        ---
        title: "contains :::note"
        ---

        # Title

        intro

        ::::note[note **title**]

        note content

        ::::tip[tip <span>title</span>]

        tip content

        :::whatever whatever title

        whatever content

        :::

        ::::

        :::::

        ## Heading {#my-heading}

        ::::info[weird spaced title]

        into content

        :::tip[tip directiveLabel]

        tip content

        ::::

        ## Conclusion

        end
    `);
  });
});

describe('writeMarkdownHeadingId', () => {
  it('works for simple level-2 heading', () => {
    expect(writeMarkdownHeadingId('## ABC')).toBe('## ABC {#abc}');
  });

  it('works for simple level-3 heading', () => {
    expect(writeMarkdownHeadingId('### ABC')).toBe('### ABC {#abc}');
  });

  it('works for simple level-4 heading', () => {
    expect(writeMarkdownHeadingId('#### ABC')).toBe('#### ABC {#abc}');
  });

  it('unwraps markdown links', () => {
    const input = `## hello [facebook](https://facebook.com) [crowdin](https://crowdin.com/translate/docusaurus-v2/126/en-fr?filter=basic&value=0)`;
    expect(writeMarkdownHeadingId(input)).toBe(
      `${input} {#hello-facebook-crowdin}`,
    );
  });

  it('can slugify complex headings', () => {
    const input = '## abc [Hello] How are you %Sébastien_-_$)( ## -56756';
    expect(writeMarkdownHeadingId(input)).toBe(
      // cSpell:ignore ébastien
      `${input} {#abc-hello-how-are-you-sébastien_-_---56756}`,
    );
  });

  it('does not duplicate duplicate id', () => {
    expect(writeMarkdownHeadingId('## hello world {#hello-world}')).toBe(
      '## hello world {#hello-world}',
    );
  });

  it('respects existing heading', () => {
    expect(writeMarkdownHeadingId('## New heading {#old-heading}')).toBe(
      '## New heading {#old-heading}',
    );
  });

  it('overwrites heading ID when asked to', () => {
    expect(
      writeMarkdownHeadingId('## New heading {#old-heading}', {
        overwrite: true,
      }),
    ).toBe('## New heading {#new-heading}');
  });

  it('maintains casing when asked to', () => {
    expect(
      writeMarkdownHeadingId('## getDataFromAPI()', {
        maintainCase: true,
      }),
    ).toBe('## getDataFromAPI() {#getDataFromAPI}');
  });

  it('transform the headings', () => {
    const input = `

# Ignored title

## abc

### Hello world

\`\`\`
# Heading in code block
\`\`\`

## Hello world

    \`\`\`
    # Heading in escaped code block
    \`\`\`

### abc {#abc}

    `;

    const expected = `

# Ignored title

## abc {#abc-1}

### Hello world {#hello-world}

\`\`\`
# Heading in code block
\`\`\`

## Hello world {#hello-world-1}

    \`\`\`
    # Heading in escaped code block
    \`\`\`

### abc {#abc}

    `;

    expect(writeMarkdownHeadingId(input)).toEqual(expected);
  });
});
