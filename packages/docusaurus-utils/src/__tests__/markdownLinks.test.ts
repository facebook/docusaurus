/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {replaceMarkdownLinks} from '../markdownLinks';

describe('replaceMarkdownLinks', () => {
  test('basic replace', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/intro.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/intro.md': '/docs/intro',
          '@site/docs/foo.md': '/doc/foo',
          '@site/docs/bar/baz.md': '/doc/baz',
          '@site/docs/http.foo.md': '/doc/http',
        },
        fileString: `
[foo](./foo.md)
[baz](./bar/baz.md)
[foo](foo.md)
[http](http://github.com/facebook/docusaurus/README.md)
[https](https://github.com/facebook/docusaurus/README.md)
[asset](./foo.js)
[asset as well](@site/docs/_partial.md)
[looks like http...](http.foo.md)
[nonexistent](hmmm.md)
`,
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "brokenMarkdownLinks": Array [
          Object {
            "contentPaths": Object {
              "contentPath": "docs",
              "contentPathLocalized": "i18n/docs-localized",
            },
            "filePath": "docs/intro.md",
            "link": "hmmm.md",
          },
        ],
        "newContent": "
      [foo](/doc/foo)
      [baz](/doc/baz)
      [foo](/doc/foo)
      [http](http://github.com/facebook/docusaurus/README.md)
      [https](https://github.com/facebook/docusaurus/README.md)
      [asset](./foo.js)
      [asset as well](@site/docs/_partial.md)
      [looks like http...](/doc/http)
      [nonexistent](hmmm.md)
      ",
      }
    `);
  });

  test('reference style Markdown links', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/intro/intro.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },

        sourceToPermalink: {
          '@site/docs/intro/intro.md': '/docs/intro',
          '@site/docs/api/classes/divine_uri.URI.md': '/docs/api/classes/uri',
        },

        fileString: `
The following operations are defined for [URI]s:

* [info]: Returns metadata about the resource,
* [list]: Returns metadata about the resource's children (like getting the content of a local directory).

[URI]:    ../api/classes/divine_uri.URI.md
[info]:   ../api/classes/divine_uri.URI.md#info
[list]:   ../api/classes/divine_uri.URI.md#list
      `,
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "brokenMarkdownLinks": Array [],
        "newContent": "
      The following operations are defined for [URI]s:

      * [info]: Returns metadata about the resource,
      * [list]: Returns metadata about the resource's children (like getting the content of a local directory).

      [URI]:    /docs/api/classes/uri
      [info]:   /docs/api/classes/uri#info
      [list]:   /docs/api/classes/uri#list
            ",
      }
    `);
  });

  // TODO bad
  test('links in HTML comments', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/intro.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/intro.md': '/docs/intro',
        },
        fileString: `
<!-- [foo](./foo.md) -->
<!--
[foo](./foo.md)
-->
`,
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "brokenMarkdownLinks": Array [
          Object {
            "contentPaths": Object {
              "contentPath": "docs",
              "contentPathLocalized": "i18n/docs-localized",
            },
            "filePath": "docs/intro.md",
            "link": "./foo.md",
          },
          Object {
            "contentPaths": Object {
              "contentPath": "docs",
              "contentPathLocalized": "i18n/docs-localized",
            },
            "filePath": "docs/intro.md",
            "link": "./foo.md",
          },
        ],
        "newContent": "
      <!-- [foo](./foo.md) -->
      <!--
      [foo](./foo.md)
      -->
      ",
      }
    `);
  });

  test('links in fenced blocks', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/intro.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/intro.md': '/docs/intro',
        },
        fileString: `
\`\`\`
[foo](foo.md)
\`\`\`

\`\`\`\`js
[foo](foo.md)
\`\`\`
[foo](foo.md)
\`\`\`
[foo](foo.md)
\`\`\`\`

\`\`\`\`js
[foo](foo.md)
\`\`\`
[foo](foo.md)
\`\`\`\`
`,
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "brokenMarkdownLinks": Array [],
        "newContent": "
      \`\`\`
      [foo](foo.md)
      \`\`\`

      \`\`\`\`js
      [foo](foo.md)
      \`\`\`
      [foo](foo.md)
      \`\`\`
      [foo](foo.md)
      \`\`\`\`

      \`\`\`\`js
      [foo](foo.md)
      \`\`\`
      [foo](foo.md)
      \`\`\`\`
      ",
      }
    `);
  });

  // TODO bad
  test('links in inline code', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/intro.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/intro.md': '/docs/intro',
        },
        fileString: `
\`[foo](foo.md)\`
`,
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "brokenMarkdownLinks": Array [
          Object {
            "contentPaths": Object {
              "contentPath": "docs",
              "contentPathLocalized": "i18n/docs-localized",
            },
            "filePath": "docs/intro.md",
            "link": "foo.md",
          },
        ],
        "newContent": "
      \`[foo](foo.md)\`
      ",
      }
    `);
  });

  // TODO bad
  test('links with same title as URL', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/intro.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/intro.md': '/docs/intro',
          '@site/docs/foo.md': '/docs/foo',
        },
        fileString: `
[foo.md](foo.md)
[./foo.md](./foo.md)
[foo.md](./foo.md)
[./foo.md](foo.md)
`,
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "brokenMarkdownLinks": Array [],
        "newContent": "
      [/docs/foo](foo.md)
      [/docs/foo](./foo.md)
      [foo.md](/docs/foo)
      [.//docs/foo](foo.md)
      ",
      }
    `);
  });

  test('multiple links on same line', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/intro.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/intro.md': '/docs/intro',
          '@site/docs/a.md': '/docs/a',
          '@site/docs/b.md': '/docs/b',
          '@site/docs/c.md': '/docs/c',
        },
        fileString: `
[a](a.md), [a](a.md), [b](b.md), [c](c.md)
`,
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "brokenMarkdownLinks": Array [],
        "newContent": "
      [a](/docs/a), [a](/docs/a), [b](/docs/b), [c](/docs/c)
      ",
      }
    `);
  });
});
