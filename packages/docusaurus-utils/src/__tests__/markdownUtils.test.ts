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
  parseMarkdownString,
  parseMarkdownHeadingId,
  writeMarkdownHeadingId,
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

describe('parseMarkdownString', () => {
  it('parse markdown with front matter', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---

        Some text
        `),
    ).toMatchSnapshot();
  });

  it('parses first heading as contentTitle', () => {
    expect(
      parseMarkdownString(dedent`
        # Markdown Title

        Some text
        `),
    ).toMatchSnapshot();
  });

  it('warns about duplicate titles (front matter + markdown)', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---

        # Markdown Title

        Some text
        `),
    ).toMatchSnapshot();
  });

  it('warns about duplicate titles (front matter + markdown alternate)', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---

        Markdown Title alternate
        ================

        Some text
        `),
    ).toMatchSnapshot();
  });

  it('does not warn for duplicate title if markdown title is not at the top', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---

        foo

        # Markdown Title
        `),
    ).toMatchSnapshot();
  });

  it('deletes only first heading', () => {
    expect(
      parseMarkdownString(dedent`
        # Markdown Title

        test test test # test bar

        # Markdown Title 2

        ### Markdown Title h3
        `),
    ).toMatchSnapshot();
  });

  it('parses front-matter and ignore h2', () => {
    expect(
      parseMarkdownString(
        dedent`
          ---
          title: Frontmatter title
          ---
          ## test
          `,
      ),
    ).toMatchSnapshot();
  });

  it('reads front matter only', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: test
        ---
        `),
    ).toMatchSnapshot();
  });

  it('parses title only', () => {
    expect(parseMarkdownString('# test')).toMatchSnapshot();
  });

  it('parses title only alternate', () => {
    expect(
      parseMarkdownString(dedent`
        test
        ===
        `),
    ).toMatchSnapshot();
  });

  it('warns about duplicate titles', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---
        # test
        `),
    ).toMatchSnapshot();
  });

  it('ignores markdown title if its not a first text', () => {
    expect(
      parseMarkdownString(dedent`
        foo
        # test
        `),
    ).toMatchSnapshot();
  });

  it('deletes only first heading 2', () => {
    expect(
      parseMarkdownString(dedent`
        # test

        test test test test test test
        test test test # test bar
        # test2
        ### test
        test3
        `),
    ).toMatchSnapshot();
  });

  it('handles code blocks', () => {
    expect(
      parseMarkdownString(dedent`
        \`\`\`js
        code
        \`\`\`

        Content
      `),
    ).toMatchSnapshot();
    expect(
      parseMarkdownString(dedent`
        \`\`\`\`js
        Foo
        \`\`\`diff
        code
        \`\`\`
        Bar
        \`\`\`\`

        Content
      `),
    ).toMatchSnapshot();
    expect(
      parseMarkdownString(dedent`
        \`\`\`\`js
        Foo
        \`\`\`diff
        code
        \`\`\`\`

        Content
      `),
    ).toMatchSnapshot();
  });

  it('throws for invalid front matter', () => {
    expect(() =>
      parseMarkdownString(dedent`
      ---
      foo: f: a
      ---
      `),
    ).toThrowErrorMatchingInlineSnapshot(`
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
