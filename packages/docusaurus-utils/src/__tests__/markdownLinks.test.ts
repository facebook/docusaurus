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

  it('replaces two links on the same line', () => {
    // cSpell:ignore Goooooooooo
    // This is a very arcane bug: if we continue matching using the previous
    // matching index (as is the behavior of RegExp#exec), it will go right over
    // the next Markdown link and fail to match the "Go" link. This only happens
    // when: (1) the replaced link is much shorter than the Markdown path, (2)
    // the next link is very close to the current one (e.g. here if it's not
    // "Go" but "Goooooooooo", or if every link has the /docs/ prefix, the bug
    // will not trigger because it won't overshoot)
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/intro.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/intro.md': '/',
          '@site/docs/programming-languages/typescript/typescript.md':
            '/programming-languages/typescript/',
          '@site/docs/programming-languages/go/go.md':
            '/programming-languages/go/',
        },
        fileString: `[TypeScript](programming-languages/typescript/typescript.md) and [Go](programming-languages/go/go.md)`,
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

  it('resolves absolute and relative links differently', () => {
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
          '@site/docs/intro/another.md': '/docs/another',
          '@site/docs/api/classes/divine_uri.URI.md': '/docs/api/classes/uri',
        },

        fileString: `
[Relative link](./another.md)
[Relative link 2](../api/classes/divine_uri.URI.md)
[Relative link that should be absolute](./api/classes/divine_uri.URI.md)
[Absolute link](/api/classes/divine_uri.URI.md)
[Absolute link from site dir](/docs/api/classes/divine_uri.URI.md)
[Absolute link that should be relative](/another.md)
[Relative link that acts as absolute](api/classes/divine_uri.URI.md)
[Relative link that acts as relative](another.md)
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

~~~js
[foo](foo.md)
~~~

~~~js
[foo](foo.md)
\`\`\`
[foo](foo.md)
\`\`\`
[foo](foo.md)
~~~
`,
      }),
    ).toMatchSnapshot();
  });

  // FIXME
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

  it('replaces Markdown links with spaces', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/intro.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/doc a.md': '/docs/doc%20a',
          '@site/docs/my docs/doc b.md': '/docs/my%20docs/doc%20b',
        },
        fileString: `
[doc a](./doc%20a.md)
[doc a](<./doc a.md>)
[doc b](./my%20docs/doc%20b.md)
[doc b](<./my docs/doc b.md>)
[doc]: <./my docs/doc b.md>
`,
      }),
    ).toMatchSnapshot();
  });

  it('does not replace non-Markdown links', () => {
    const input = `
[asset](./file.md_asset/1.png)
[URL](<https://example.com/file_(1).md>)
[not a link]((foo)
[not a link](foo bar)
[not a link]: foo bar
[not a link]: (foo
[not a link]: bar)
`;
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/file.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/file.md': '/docs/file',
        },
        fileString: input,
      }),
    ).toEqual({
      newContent: input,
      brokenMarkdownLinks: [],
    });
  });

  it('handles stray spaces', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/file.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/file.md': '/docs/file',
        },
        fileString: `
[URL]( ./file.md )
[ref]:  ./file.md
`,
      }),
    ).toMatchSnapshot();
  });

  it('handles link titles', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/file.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/file.md': '/docs/file',
        },
        fileString: `
[URL](./file.md "title")
[URL](./file.md 'title')
[URL](./file.md (title))
`,
      }),
    ).toMatchSnapshot();
  });

  it('preserves query/hash', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/file.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/file.md': '/docs/file',
        },
        fileString: `
[URL](./file.md?foo=bar#baz)
[URL](./file.md#a)
[URL](./file.md?c)
`,
      }),
    ).toMatchSnapshot();
  });

  it('handles unpaired fences', () => {
    expect(
      replaceMarkdownLinks({
        siteDir: '.',
        filePath: 'docs/file.md',
        contentPaths: {
          contentPath: 'docs',
          contentPathLocalized: 'i18n/docs-localized',
        },
        sourceToPermalink: {
          '@site/docs/file.md': '/docs/file',
        },
        fileString: `
\`\`\`foo
hello

\`\`\`foo
hello
\`\`\`

A [link](./file.md)
`,
      }),
    ).toMatchSnapshot();
  });
});
