/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  createExcerpt,
  parseMarkdownContentTitle,
  parseMarkdownString,
} from '../markdownParser';
import dedent from 'dedent';

describe('createExcerpt', () => {
  test('should create excerpt for text-only content', () => {
    expect(
      createExcerpt(dedent`
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toEqual(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
    );
  });

  test('should create excerpt for regular content with regular title', () => {
    expect(
      createExcerpt(dedent`

          # Markdown Regular Title

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toEqual(
      // h1 title is skipped on purpose, because we don't want the page to have SEO metadatas title === description
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
    );
  });

  test('should create excerpt for regular content with alternate title', () => {
    expect(
      createExcerpt(dedent`

          Markdown Alternate Title
          ================

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toEqual(
      // h1 title is skipped on purpose, because we don't want the page to have SEO metadatas title === description
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
    );
  });

  test('should create excerpt for content with h2 heading', () => {
    expect(
      createExcerpt(dedent`
          ## Lorem ipsum dolor sit amet

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toEqual('Lorem ipsum dolor sit amet');
  });

  test('should create excerpt for content beginning with blockquote', () => {
    expect(
      createExcerpt(dedent`
          > Lorem ipsum dolor sit amet

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toEqual('Lorem ipsum dolor sit amet');
  });

  test('should create excerpt for content beginning with image (eg. blog post)', () => {
    expect(
      createExcerpt(dedent`
          ![Lorem ipsum](/img/lorem-ipsum.svg)
        `),
    ).toEqual('Lorem ipsum');
  });

  test('should create excerpt for content beginning with admonitions', () => {
    expect(
      createExcerpt(dedent`
          import Component from '@site/src/components/Component'

          :::caution

          Lorem ipsum dolor sit amet, consectetur adipiscing elit.

          :::

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
  });

  test('should create excerpt for content with imports/exports declarations and Markdown markup, as well as Emoji', () => {
    expect(
      createExcerpt(dedent`
          import Component from '@site/src/components/Component';
          import Component from '@site/src/components/Component'
          import './styles.css';

          export function ItemCol(props) { return <Item {...props} className={'col col--6 margin-bottom--lg'}/> }

          export function ItemCol(props) { return <Item {...props} className={'col col--6 margin-bottom--lg'}/> };

          Lorem **ipsum** dolor sit \`amet\`[^1], consectetur _adipiscing_ elit. [**Vestibulum**](https://wiktionary.org/wiki/vestibulum) ex urna[^bignote], ~molestie~ et sagittis ut, varius ac justo :wink:.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `),
    ).toEqual(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
    );
  });

  test('should create excerpt for heading specified with anchor-id syntax', () => {
    expect(
      createExcerpt(dedent`
          ## Markdown title {#my-anchor-id}
        `),
    ).toEqual('Markdown title');
  });

  test('should create excerpt for content with various code blocks', () => {
    expect(
      createExcerpt(dedent`
          \`\`\`jsx
          import React from 'react';
          import Layout from '@theme/Layout';
          \`\`\`

          Lorem \`ipsum\` dolor sit amet, consectetur \`adipiscing elit\`.
        `),
    ).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
  });
});

describe('parseMarkdownContentTitle', () => {
  test('Should parse markdown h1 title at the top', () => {
    const markdown = dedent`

          # Markdown Title

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse markdown h1 title at the top and remove it', () => {
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

  test('Should parse markdown h1 title at the top and unwrap inline code block', () => {
    const markdown = dedent`

          # \`Markdown Title\`

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse markdown h1 title and trim content', () => {
    const markdown = `

# Markdown Title

Lorem Ipsum



`;

    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown.trim(),
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse not parse markdown h1 title and trim content', () => {
    const markdown = `

Lorem Ipsum

`;

    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown.trim(),
      contentTitle: undefined,
    });
  });

  test('Should parse markdown h1 title with fixed anchor-id syntax', () => {
    const markdown = dedent`

          # Markdown Title {#my-anchor-id}

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse markdown h1 title at the top (atx style with closing #)', () => {
    const markdown = dedent`

          # Markdown Title #

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse markdown h1 title at the top  followed by h2 title', () => {
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

  test('Should parse only first h1 title', () => {
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

  test('Should not parse title that is not at the top', () => {
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

  test('Should parse markdown h1 alternate title', () => {
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

  test('Should parse markdown h1 alternate title and remove it', () => {
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

  test('Should parse markdown h1 title placed after import declarations', () => {
    const markdown = dedent`
          import Component1 from '@site/src/components/Component1';

          import Component2 from '@site/src/components/Component2'
          import Component3 from '@site/src/components/Component3'
          import './styles.css';

          # Markdown Title

          Lorem Ipsum

        `;

    // remove the useless line breaks? Does not matter too much
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse markdown h1 title placed after various import declarations', () => {
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

  test('Should parse markdown h1 title placed after various import declarations and remove it', () => {
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
      content: markdown.trim().replace('# Markdown Title', ''),
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse markdown h1 alternate title placed after import declarations', () => {
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

  test('Should parse markdown h1 alternate title placed after import declarations and remove it', () => {
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
      content: markdown.replace('Markdown Title\n==============\n\n', ''),
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse title-only', () => {
    const markdown = '# Document With Only A Title';
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: markdown,
      contentTitle: 'Document With Only A Title',
    });
  });

  test('Should not parse markdown h1 title in the middle of a doc', () => {
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

  test('Should not parse markdown h1 alternate title in the middle of the doc', () => {
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

  test('Should parse markdown h1 title placed after multiple import declarations', () => {
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

  test('Should parse markdown h1 title placed after multiple import declarations and remove it', () => {
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
      content: markdown.replace('# Markdown Title', ''),
      contentTitle: 'Markdown Title',
    });
  });
});

describe('parseMarkdownString', () => {
  test('parse markdown with frontmatter', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---

        Some text
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "Some text",
        "contentTitle": undefined,
        "excerpt": "Some text",
        "frontMatter": Object {
          "title": "Frontmatter title",
        },
      }
    `);
  });

  test('should parse first heading as contentTitle', () => {
    expect(
      parseMarkdownString(dedent`
        # Markdown Title

        Some text
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "# Markdown Title

      Some text",
        "contentTitle": "Markdown Title",
        "excerpt": "Some text",
        "frontMatter": Object {},
      }
    `);
  });

  test('should warn about duplicate titles (frontmatter + markdown)', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---

        # Markdown Title

        Some text
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "# Markdown Title

      Some text",
        "contentTitle": "Markdown Title",
        "excerpt": "Some text",
        "frontMatter": Object {
          "title": "Frontmatter title",
        },
      }
    `);
  });

  test('should warn about duplicate titles (frontmatter + markdown alternate)', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---

        Markdown Title alternate
        ================

        Some text
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "Markdown Title alternate
      ================

      Some text",
        "contentTitle": "Markdown Title alternate",
        "excerpt": "Some text",
        "frontMatter": Object {
          "title": "Frontmatter title",
        },
      }
    `);
  });

  test('should not warn for duplicate title if markdown title is not at the top', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---

        foo

        # Markdown Title
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "foo

      # Markdown Title",
        "contentTitle": undefined,
        "excerpt": "foo",
        "frontMatter": Object {
          "title": "Frontmatter title",
        },
      }
    `);
  });

  test('should delete only first heading', () => {
    expect(
      parseMarkdownString(dedent`
        # Markdown Title

        test test test # test bar

        # Markdown Title 2

        ### Markdown Title h3
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "# Markdown Title

      test test test # test bar

      # Markdown Title 2

      ### Markdown Title h3",
        "contentTitle": "Markdown Title",
        "excerpt": "test test test # test bar",
        "frontMatter": Object {},
      }
    `);
  });

  test('should parse front-matter and ignore h2', () => {
    expect(
      parseMarkdownString(
        dedent`
          ---
          title: Frontmatter title
          ---
          ## test
          `,
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "## test",
        "contentTitle": undefined,
        "excerpt": "test",
        "frontMatter": Object {
          "title": "Frontmatter title",
        },
      }
    `);
  });

  test('should read front matter only', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: test
        ---
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "",
        "contentTitle": undefined,
        "excerpt": undefined,
        "frontMatter": Object {
          "title": "test",
        },
      }
    `);
  });

  test('should parse title only', () => {
    expect(parseMarkdownString('# test')).toMatchInlineSnapshot(`
      Object {
        "content": "# test",
        "contentTitle": "test",
        "excerpt": undefined,
        "frontMatter": Object {},
      }
    `);
  });

  test('should parse title only alternate', () => {
    expect(
      parseMarkdownString(dedent`
        test
        ===
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "test
      ===",
        "contentTitle": "test",
        "excerpt": undefined,
        "frontMatter": Object {},
      }
    `);
  });

  test('should warn about duplicate titles', () => {
    expect(
      parseMarkdownString(dedent`
        ---
        title: Frontmatter title
        ---
        # test
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "# test",
        "contentTitle": "test",
        "excerpt": undefined,
        "frontMatter": Object {
          "title": "Frontmatter title",
        },
      }
    `);
  });

  test('should ignore markdown title if its not a first text', () => {
    expect(
      parseMarkdownString(dedent`
        foo
        # test
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "foo
      # test",
        "contentTitle": undefined,
        "excerpt": "foo",
        "frontMatter": Object {},
      }
    `);
  });

  test('should delete only first heading', () => {
    expect(
      parseMarkdownString(dedent`
        # test

        test test test test test test
        test test test # test bar
        # test2
        ### test
        test3
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "# test

      test test test test test test
      test test test # test bar
      # test2
      ### test
      test3",
        "contentTitle": "test",
        "excerpt": "test test test test test test",
        "frontMatter": Object {},
      }
    `);
  });
});
