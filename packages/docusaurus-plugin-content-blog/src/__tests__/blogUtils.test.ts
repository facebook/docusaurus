/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {fromPartial} from '@total-typescript/shoehorn';
import {
  truncate,
  parseBlogFileName,
  paginateBlogPosts,
  applyProcessBlogPosts,
  reportUntruncatedBlogPosts,
} from '../blogUtils';
import type {BlogPost} from '@docusaurus/plugin-content-blog';

describe('truncate', () => {
  it('truncates texts', () => {
    expect(
      truncate('aaa\n<!-- truncate -->\nbbb\n ccc', /<!-- truncate -->/),
    ).toBe('aaa\n');
    expect(
      truncate('\n<!-- truncate -->\nbbb\n ccc', /<!-- truncate -->/),
    ).toBe('\n');
  });

  it('leaves texts without markers', () => {
    expect(truncate('aaa\nbbb\n ccc', /<!-- truncate -->/)).toBe(
      'aaa\nbbb\n ccc',
    );
    expect(truncate('', /<!-- truncate -->/)).toBe('');
  });
});

describe('reportUntruncatedBlogPosts', () => {
  function testPost({
    source,
    hasTruncateMarker,
  }: {
    source: string;
    hasTruncateMarker: boolean;
  }): BlogPost {
    return fromPartial({
      metadata: {
        source,
        hasTruncateMarker,
      },
    });
  }

  it('throw for untruncated blog posts', () => {
    const blogPosts = [
      testPost({source: '@site/blog/post1.md', hasTruncateMarker: false}),
      testPost({source: '@site/blog/post2.md', hasTruncateMarker: true}),
      testPost({
        source: '@site/blog/subDir/post3.md',
        hasTruncateMarker: false,
      }),
    ];
    expect(() =>
      reportUntruncatedBlogPosts({blogPosts, onUntruncatedBlogPosts: 'throw'}),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Docusaurus found blog posts without truncation markers:
      - "blog/post1.md"
      - "blog/subDir/post3.md"

      We recommend using truncation markers (\`<!-- truncate -->\` or \`{/* truncate */}\`) in blog posts to create shorter previews on blog paginated lists.
      Tip: turn this security off with the \`onUntruncatedBlogPosts: 'ignore'\` blog plugin option."
    `);
  });

  it('warn for untruncated blog posts', () => {
    const consoleMock = jest.spyOn(console, 'warn');

    const blogPosts = [
      testPost({source: '@site/blog/post1.md', hasTruncateMarker: false}),
      testPost({source: '@site/blog/post2.md', hasTruncateMarker: true}),
      testPost({
        source: '@site/blog/subDir/post3.md',
        hasTruncateMarker: false,
      }),
    ];
    expect(() =>
      reportUntruncatedBlogPosts({blogPosts, onUntruncatedBlogPosts: 'warn'}),
    ).not.toThrow();

    expect(consoleMock.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "[WARNING] Docusaurus found blog posts without truncation markers:
      - "blog/post1.md"
      - "blog/subDir/post3.md"

      We recommend using truncation markers (\`<!-- truncate -->\` or \`{/* truncate */}\`) in blog posts to create shorter previews on blog paginated lists.
      Tip: turn this security off with the \`onUntruncatedBlogPosts: 'ignore'\` blog plugin option.",
        ],
      ]
    `);
    consoleMock.mockRestore();
  });

  it('ignore untruncated blog posts', () => {
    const logMock = jest.spyOn(console, 'log');
    const warnMock = jest.spyOn(console, 'warn');
    const errorMock = jest.spyOn(console, 'error');

    const blogPosts = [
      testPost({source: '@site/blog/post1.md', hasTruncateMarker: false}),
      testPost({source: '@site/blog/post2.md', hasTruncateMarker: true}),
      testPost({
        source: '@site/blog/subDir/post3.md',
        hasTruncateMarker: false,
      }),
    ];
    expect(() =>
      reportUntruncatedBlogPosts({blogPosts, onUntruncatedBlogPosts: 'ignore'}),
    ).not.toThrow();

    expect(logMock).not.toHaveBeenCalled();
    expect(warnMock).not.toHaveBeenCalled();
    expect(errorMock).not.toHaveBeenCalled();
    logMock.mockRestore();
    warnMock.mockRestore();
    errorMock.mockRestore();
  });

  it('does not throw for truncated posts', () => {
    const blogPosts = [
      testPost({source: '@site/blog/post1.md', hasTruncateMarker: true}),
      testPost({source: '@site/blog/post2.md', hasTruncateMarker: true}),
    ];
    expect(() =>
      reportUntruncatedBlogPosts({blogPosts, onUntruncatedBlogPosts: 'throw'}),
    ).not.toThrow();
  });
});

describe('paginateBlogPosts', () => {
  const blogPosts = [
    {id: 'post1', metadata: {}, content: 'Foo 1'},
    {id: 'post2', metadata: {}, content: 'Foo 2'},
    {id: 'post3', metadata: {}, content: 'Foo 3'},
    {id: 'post4', metadata: {}, content: 'Foo 4'},
    {id: 'post5', metadata: {}, content: 'Foo 5'},
  ] as BlogPost[];

  it('generates pages', () => {
    expect(
      paginateBlogPosts({
        blogPosts,
        basePageUrl: '/blog',
        blogTitle: 'Blog Title',
        blogDescription: 'Blog Description',
        postsPerPageOption: 2,
        pageBasePath: 'page',
      }),
    ).toMatchSnapshot();
  });

  it('generates pages - 0 blog post', () => {
    const pages = paginateBlogPosts({
      blogPosts: [],
      basePageUrl: '/blog',
      blogTitle: 'Blog Title',
      blogDescription: 'Blog Description',
      postsPerPageOption: 2,
      pageBasePath: 'page',
    });
    // As part ot https://github.com/facebook/docusaurus/pull/10216
    // it was decided that authors with "page: true" that haven't written any
    // blog posts yet should still have a dedicated author page
    // For this purpose, we generate an empty first page
    expect(pages).toHaveLength(1);
    expect(pages[0]!.items).toHaveLength(0);
    expect(pages).toMatchSnapshot();
  });

  it('generates pages at blog root', () => {
    expect(
      paginateBlogPosts({
        blogPosts,
        basePageUrl: '/',
        blogTitle: 'Blog Title',
        blogDescription: 'Blog Description',
        postsPerPageOption: 2,
        pageBasePath: 'page',
      }),
    ).toMatchSnapshot();
  });

  it('generates a single page', () => {
    expect(
      paginateBlogPosts({
        blogPosts,
        basePageUrl: '/',
        blogTitle: 'Blog Title',
        blogDescription: 'Blog Description',
        postsPerPageOption: 10,
        pageBasePath: 'page',
      }),
    ).toMatchSnapshot();
  });

  it('generates pages with custom pageBasePath', () => {
    expect(
      paginateBlogPosts({
        blogPosts,
        basePageUrl: '/blog',
        blogTitle: 'Blog Title',
        blogDescription: 'Blog Description',
        postsPerPageOption: 2,
        pageBasePath: 'customPageBasePath',
      }),
    ).toMatchSnapshot();
  });
});

describe('parseBlogFileName', () => {
  it('parses file', () => {
    expect(parseBlogFileName('some-post.md')).toEqual({
      date: undefined,
      text: 'some-post',
      slug: '/some-post',
    });
  });

  it('parses folder', () => {
    expect(parseBlogFileName('some-post/index.md')).toEqual({
      date: undefined,
      text: 'some-post',
      slug: '/some-post',
    });
  });

  it('parses nested file', () => {
    expect(parseBlogFileName('some-post/some-file.md')).toEqual({
      date: undefined,
      text: 'some-post/some-file',
      slug: '/some-post/some-file',
    });
  });

  it('parses nested folder', () => {
    expect(parseBlogFileName('some-post/some-subfolder/index.md')).toEqual({
      date: undefined,
      text: 'some-post/some-subfolder',
      slug: '/some-post/some-subfolder',
    });
  });

  it('parses file respecting date convention', () => {
    expect(
      parseBlogFileName('2021-05-12-announcing-docusaurus-two-beta.md'),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta',
      slug: '/2021/05/12/announcing-docusaurus-two-beta',
    });
  });

  it('parses folder name respecting date convention', () => {
    expect(
      parseBlogFileName('2021-05-12-announcing-docusaurus-two-beta/index.md'),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta',
      slug: '/2021/05/12/announcing-docusaurus-two-beta',
    });
  });

  it('parses folder tree respecting date convention', () => {
    expect(
      parseBlogFileName('2021/05/12/announcing-docusaurus-two-beta/index.md'),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta',
      slug: '/2021/05/12/announcing-docusaurus-two-beta',
    });
  });

  it('parses folder name/tree (mixed) respecting date convention', () => {
    expect(
      parseBlogFileName('2021/05-12-announcing-docusaurus-two-beta/index.md'),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta',
      slug: '/2021/05/12/announcing-docusaurus-two-beta',
    });
  });

  it('parses nested folder tree respecting date convention', () => {
    expect(
      parseBlogFileName(
        '2021/05/12/announcing-docusaurus-two-beta/subfolder/file.md',
      ),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta/subfolder/file',
      slug: '/2021/05/12/announcing-docusaurus-two-beta/subfolder/file',
    });
  });

  it('parses date in the middle of path', () => {
    expect(
      parseBlogFileName('team-a/2021/05/12/announcing-docusaurus-two-beta.md'),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'announcing-docusaurus-two-beta',
      slug: '/2021/05/12/team-a/announcing-docusaurus-two-beta',
    });
  });

  it('parses date in the middle of a folder name', () => {
    expect(
      parseBlogFileName(
        'team-a-2021-05-12-hey/announcing-docusaurus-two-beta.md',
      ),
    ).toEqual({
      date: new Date('2021-05-12Z'),
      text: 'hey/announcing-docusaurus-two-beta',
      slug: '/2021/05/12/team-a-hey/announcing-docusaurus-two-beta',
    });
  });
});

describe('processBlogPosts', () => {
  const blogPost2022: BlogPost = fromPartial({
    metadata: {date: new Date('2022-01-01')},
  });
  const blogPost2023: BlogPost = fromPartial({
    metadata: {date: new Date('2023-01-01')},
  });
  const blogPost2024: BlogPost = fromPartial({
    metadata: {date: new Date('2024-01-01')},
  });

  it('filter blogs only from 2024', async () => {
    const processedBlogPosts = await applyProcessBlogPosts({
      blogPosts: [blogPost2022, blogPost2023, blogPost2024],
      processBlogPosts: async ({blogPosts}: {blogPosts: BlogPost[]}) =>
        blogPosts.filter(
          (blogPost) => blogPost.metadata.date.getFullYear() === 2024,
        ),
    });

    expect(processedBlogPosts).toEqual([blogPost2024]);
  });

  it('sort blogs by date in ascending order', async () => {
    const processedBlogPosts = await applyProcessBlogPosts({
      blogPosts: [blogPost2023, blogPost2022, blogPost2024],
      processBlogPosts: async ({blogPosts}: {blogPosts: BlogPost[]}) =>
        blogPosts.sort(
          (a, b) => a.metadata.date.getTime() - b.metadata.date.getTime(),
        ),
    });

    expect(processedBlogPosts).toEqual([
      blogPost2022,
      blogPost2023,
      blogPost2024,
    ]);
  });

  it('sort blogs by date in descending order', async () => {
    const processedBlogPosts = await applyProcessBlogPosts({
      blogPosts: [blogPost2023, blogPost2022, blogPost2024],
      processBlogPosts: async ({blogPosts}: {blogPosts: BlogPost[]}) =>
        blogPosts.sort(
          (a, b) => b.metadata.date.getTime() - a.metadata.date.getTime(),
        ),
    });

    expect(processedBlogPosts).toEqual([
      blogPost2024,
      blogPost2023,
      blogPost2022,
    ]);
  });

  it('processBlogPosts return 2022 only', async () => {
    const processedBlogPosts = await applyProcessBlogPosts({
      blogPosts: [blogPost2023, blogPost2022, blogPost2024],
      processBlogPosts: async () => [blogPost2022],
    });

    expect(processedBlogPosts).toEqual([blogPost2022]);
  });

  it('processBlogPosts return undefined', async () => {
    const processedBlogPosts = await applyProcessBlogPosts({
      blogPosts: [blogPost2023, blogPost2022, blogPost2024],
      processBlogPosts: async () => {},
    });

    expect(processedBlogPosts).toEqual([
      blogPost2023,
      blogPost2022,
      blogPost2024,
    ]);
  });
});
