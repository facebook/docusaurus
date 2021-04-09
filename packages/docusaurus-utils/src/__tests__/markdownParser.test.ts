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
});

describe('parseMarkdownContentTitle', () => {
  test('Should parse markdown h1 title at the top', () => {
    const markdown = dedent`

          # Markdown Title

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: 'Lorem Ipsum',
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse markdown h1 title at the top (atx style with closing #)', () => {
    const markdown = dedent`

          # Markdown Title #

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: 'Lorem Ipsum',
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse markdown h1 alternate title', () => {
    const markdown = dedent`

          Markdown Title
          ================

          Lorem Ipsum

        `;
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: 'Lorem Ipsum',
      contentTitle: 'Markdown Title',
    });
  });

  test('Should parse title-only', () => {
    const markdown = '# Document With Only A Title ';
    expect(parseMarkdownContentTitle(markdown)).toEqual({
      content: '',
      contentTitle: 'Document With Only A Title',
    });
  });

  test('Should parse markdown h1 title at the top but keep it in content', () => {
    const markdown = dedent`

          # Markdown Title

          Lorem Ipsum

        `;
    expect(
      parseMarkdownContentTitle(markdown, {keepContentTitle: true}),
    ).toEqual({
      content: markdown.trim(),
      contentTitle: 'Markdown Title',
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
});

describe('parseMarkdownString', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  beforeEach(() => {
    warn.mockReset();
  });

  function expectDuplicateTitleWarning() {
    expect(warn).toBeCalledWith(
      expect.stringMatching(/Duplicate title found in this file/),
    );
  }
  function expectNoWarning() {
    expect(warn).not.toBeCalled();
  }

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
    expectNoWarning();
  });

  test('should parse first heading as contentTitle', () => {
    expect(
      parseMarkdownString(dedent`
        # Markdown Title

        Some text
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "Some text",
        "contentTitle": "Markdown Title",
        "excerpt": "Some text",
        "frontMatter": Object {},
      }
    `);
    expectNoWarning();
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
        "content": "Some text",
        "contentTitle": "Markdown Title",
        "excerpt": "Some text",
        "frontMatter": Object {
          "title": "Frontmatter title",
        },
      }
    `);
    expectDuplicateTitleWarning();
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
        "content": "Some text",
        "contentTitle": "Markdown Title alternate",
        "excerpt": "Some text",
        "frontMatter": Object {
          "title": "Frontmatter title",
        },
      }
    `);
    expectDuplicateTitleWarning();
  });

  test('should not warn for duplicate title if keepContentTitle=true', () => {
    expect(
      parseMarkdownString(
        dedent`
        ---
        title: Frontmatter title
        ---

        # Markdown Title

        Some text
        `,
        {keepContentTitle: true},
      ),
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
    expectNoWarning();
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
    expectNoWarning();
  });

  test('should parse markdown title and keep it in content', () => {
    expect(
      parseMarkdownString(
        dedent`
          # Markdown Title
          `,
        {keepContentTitle: true},
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "# Markdown Title",
        "contentTitle": "Markdown Title",
        "excerpt": undefined,
        "frontMatter": Object {},
      }
    `);
    expectNoWarning();
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
        "content": "test test test # test bar

      # Markdown Title 2

      ### Markdown Title h3",
        "contentTitle": "Markdown Title",
        "excerpt": "test test test # test bar",
        "frontMatter": Object {},
      }
    `);
    expectNoWarning();
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
    expectNoWarning();
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
    expectNoWarning();
  });

  test('should parse title only', () => {
    expect(parseMarkdownString('# test')).toMatchInlineSnapshot(`
      Object {
        "content": "",
        "contentTitle": "test",
        "excerpt": undefined,
        "frontMatter": Object {},
      }
    `);
    expectNoWarning();
  });

  test('should parse title only alternate', () => {
    expect(
      parseMarkdownString(dedent`
        test
        ===
        `),
    ).toMatchInlineSnapshot(`
      Object {
        "content": "",
        "contentTitle": "test",
        "excerpt": undefined,
        "frontMatter": Object {},
      }
    `);
    expectNoWarning();
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
        "content": "",
        "contentTitle": "test",
        "excerpt": undefined,
        "frontMatter": Object {
          "title": "Frontmatter title",
        },
      }
    `);
    expectDuplicateTitleWarning();
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
    expectNoWarning();
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
        "content": "test test test test test test
      test test test # test bar
      # test2
      ### test
      test3",
        "contentTitle": "test",
        "excerpt": "test test test test test test",
        "frontMatter": Object {},
      }
    `);
    expectNoWarning();
  });
});
