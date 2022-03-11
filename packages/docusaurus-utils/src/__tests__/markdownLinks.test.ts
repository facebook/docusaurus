/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {replaceMarkdownLinks} from '../markdownLinks';

describe('replaceMarkdownLinks', () => {
  it('does basic replace', () => {
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
    ).toMatchSnapshot();
  });

  it('replaces reference style Markdown links', () => {
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
    ).toMatchSnapshot();
  });

  // TODO bad
  it('ignores links in HTML comments', () => {
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
    ).toMatchSnapshot();
  });

  it('ignores links in fenced blocks', () => {
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
    ).toMatchSnapshot();
  });

  // TODO bad
  it('ignores links in inline code', () => {
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
    ).toMatchSnapshot();
  });

  // TODO bad
  it('replaces links with same title as URL', () => {
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
    ).toMatchSnapshot();
  });

  it('replaces multiple links on same line', () => {
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
    ).toMatchSnapshot();
  });
});
