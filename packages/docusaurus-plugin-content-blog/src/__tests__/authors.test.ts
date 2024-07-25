/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {fromPartial, type PartialDeep} from '@total-typescript/shoehorn';
import {getBlogPostAuthors, groupBlogPostsByAuthorKey} from '../authors';
import type {AuthorsMap, BlogPost} from '@docusaurus/plugin-content-blog';

function post(partial: PartialDeep<BlogPost>): BlogPost {
  return fromPartial(partial);
}

describe('getBlogPostAuthors', () => {
  it('can read no authors', () => {
    expect(
      getBlogPostAuthors({
        frontMatter: {},
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toEqual([]);
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authors: [],
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toEqual([]);
  });

  it('can read author from legacy front matter', () => {
    expect(
      getBlogPostAuthors({
        frontMatter: {
          author: 'Sébastien Lorber',
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toEqual([
      {
        name: 'Sébastien Lorber',
        imageURL: undefined,
        key: null,
        page: null,
        title: undefined,
      },
    ]);
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authorTitle: 'maintainer',
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toEqual([
      {
        title: 'maintainer',
        imageURL: undefined,
        key: null,
        name: undefined,
        page: null,
      },
    ]);
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authorImageURL: 'https://github.com/slorber.png',
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toEqual([
      {
        imageURL: 'https://github.com/slorber.png',
        key: null,
        name: undefined,
        page: null,
      },
    ]);
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authorImageURL: '/img/slorber.png',
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toEqual([
      {
        imageURL: '/img/slorber.png',
        key: null,
        name: undefined,
        page: null,
      },
    ]);
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authorImageURL: '/img/slorber.png',
        },
        authorsMap: undefined,
        baseUrl: '/baseURL',
      }),
    ).toEqual([
      {
        imageURL: '/baseURL/img/slorber.png',

        key: null,
        name: undefined,
        page: null,
      },
    ]);
    expect(
      getBlogPostAuthors({
        frontMatter: {
          author: 'Sébastien Lorber',
          author_title: 'maintainer1',
          authorTitle: 'maintainer2',
          author_image_url: 'https://github.com/slorber1.png',
          authorImageURL: 'https://github.com/slorber2.png',
          author_url: 'https://github.com/slorber1',
          authorURL: 'https://github.com/slorber2',
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toEqual([
      {
        name: 'Sébastien Lorber',
        title: 'maintainer1',
        imageURL: 'https://github.com/slorber1.png',
        url: 'https://github.com/slorber1',
        key: null,
        page: null,
      },
    ]);
  });

  it('can read authors string', () => {
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authors: 'slorber',
        },
        authorsMap: {
          slorber: {name: 'Sébastien Lorber', key: 'slorber', page: null},
        },
        baseUrl: '/',
      }),
    ).toEqual([
      {
        key: 'slorber',
        name: 'Sébastien Lorber',
        imageURL: undefined,
        page: null,
      },
    ]);
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authors: 'slorber',
        },
        authorsMap: {
          slorber: {
            name: 'Sébastien Lorber',
            imageURL: 'https://github.com/slorber.png',
            key: 'slorber',
            page: null,
          },
        },
        baseUrl: '/',
      }),
    ).toEqual([
      {
        key: 'slorber',
        name: 'Sébastien Lorber',
        imageURL: 'https://github.com/slorber.png',
        page: null,
      },
    ]);
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authors: 'slorber',
        },
        authorsMap: {
          slorber: {
            name: 'Sébastien Lorber',
            imageURL: '/img/slorber.png',
            key: 'slorber',
            page: null,
          },
        },
        baseUrl: '/',
      }),
    ).toEqual([
      {
        key: 'slorber',
        name: 'Sébastien Lorber',
        imageURL: '/img/slorber.png',
        page: null,
      },
    ]);
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authors: 'slorber',
        },
        authorsMap: {
          slorber: {
            name: 'Sébastien Lorber',
            imageURL: '/img/slorber.png',
            key: 'slorber',
            page: null,
          },
        },
        baseUrl: '/baseUrl',
      }),
    ).toEqual([
      {
        key: 'slorber',
        name: 'Sébastien Lorber',
        imageURL: '/baseUrl/img/slorber.png',
        page: null,
      },
    ]);
  });

  it('can read authors string[]', () => {
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authors: ['slorber', 'yangshun'],
        },
        authorsMap: {
          slorber: {
            name: 'Sébastien Lorber',
            title: 'maintainer',
            key: 'slorber',
            page: null,
          },
          yangshun: {name: 'Yangshun Tay', key: 'yangshun', page: null},
        },
        baseUrl: '/',
      }),
    ).toEqual([
      {
        key: 'slorber',
        name: 'Sébastien Lorber',
        title: 'maintainer',
        imageURL: undefined,
        page: null,
      },
      {
        key: 'yangshun',
        name: 'Yangshun Tay',
        imageURL: undefined,

        page: null,
      },
    ]);
  });

  it('can read authors Author', () => {
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authors: {name: 'Sébastien Lorber', title: 'maintainer'},
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toEqual([
      {
        name: 'Sébastien Lorber',
        title: 'maintainer',
        imageURL: undefined,
        key: null,
        page: null,
      },
    ]);
  });

  it('can read authors Author[]', () => {
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authors: [
            {name: 'Sébastien Lorber', title: 'maintainer'},
            {name: 'Yangshun Tay'},
          ],
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toEqual([
      {
        name: 'Sébastien Lorber',
        title: 'maintainer',
        imageURL: undefined,
        key: null,
        page: null,
      },
      {name: 'Yangshun Tay', imageURL: undefined, key: null, page: null},
    ]);
  });

  it('can read authors complex (string | Author)[] setup with keys and local overrides', () => {
    expect(
      getBlogPostAuthors({
        frontMatter: {
          authors: [
            'slorber',
            {
              key: 'yangshun',
              title: 'Yangshun title local override',
              extra: 42,
            },
            {name: 'Alexey'},
          ],
        },
        authorsMap: {
          slorber: {
            name: 'Sébastien Lorber',
            title: 'maintainer',
            key: 'slorber',
            page: null,
          },
          yangshun: {
            name: 'Yangshun Tay',
            title: 'Yangshun title original',
            key: 'yangshun',
            page: null,
          },
        },
        baseUrl: '/',
      }),
    ).toEqual([
      {
        key: 'slorber',
        name: 'Sébastien Lorber',
        title: 'maintainer',
        imageURL: undefined,
        page: null,
      },
      {
        key: 'yangshun',
        name: 'Yangshun Tay',
        title: 'Yangshun title local override',
        extra: 42,
        imageURL: undefined,
        page: null,
      },
      {name: 'Alexey', imageURL: undefined, key: null, page: null},
    ]);
  });

  it('throw when using author key with no authorsMap', () => {
    expect(() =>
      getBlogPostAuthors({
        frontMatter: {
          authors: 'slorber',
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Can't reference blog post authors by a key (such as 'slorber') because no authors map file could be loaded.
      Please double-check your blog plugin config (in particular 'authorsMapPath'), ensure the file exists at the configured path, is not empty, and is valid!"
    `);
  });

  it('throw when using author key with empty authorsMap', () => {
    expect(() =>
      getBlogPostAuthors({
        frontMatter: {
          authors: 'slorber',
        },
        authorsMap: {},
        baseUrl: '/',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Can't reference blog post authors by a key (such as 'slorber') because no authors map file could be loaded.
      Please double-check your blog plugin config (in particular 'authorsMapPath'), ensure the file exists at the configured path, is not empty, and is valid!"
    `);
  });

  it('throw when using bad author key in string', () => {
    expect(() =>
      getBlogPostAuthors({
        frontMatter: {
          authors: 'slorber',
        },

        authorsMap: {
          yangshun: {name: 'Yangshun Tay', key: 'yangshun', page: null},
          jmarcey: {name: 'Joel Marcey', key: 'jmarcey', page: null},
        },
        baseUrl: '/',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Blog author with key "slorber" not found in the authors map file.
      Valid author keys are:
      - yangshun
      - jmarcey"
    `);
  });

  it('throw when using bad author key in string[]', () => {
    expect(() =>
      getBlogPostAuthors({
        frontMatter: {
          authors: ['yangshun', 'jmarcey', 'slorber'],
        },

        authorsMap: {
          yangshun: {name: 'Yangshun Tay', key: 'yangshun', page: null},
          jmarcey: {name: 'Joel Marcey', key: 'jmarcey', page: null},
        },
        baseUrl: '/',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Blog author with key "slorber" not found in the authors map file.
      Valid author keys are:
      - yangshun
      - jmarcey"
    `);
  });

  it('throw when using bad author key in Author[].key', () => {
    expect(() =>
      getBlogPostAuthors({
        frontMatter: {
          authors: [{key: 'yangshun'}, {key: 'jmarcey'}, {key: 'slorber'}],
        },

        authorsMap: {
          yangshun: {name: 'Yangshun Tay', key: 'yangshun', page: null},
          jmarcey: {name: 'Joel Marcey', key: 'jmarcey', page: null},
        },
        baseUrl: '/',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Blog author with key "slorber" not found in the authors map file.
      Valid author keys are:
      - yangshun
      - jmarcey"
    `);
  });

  it('throw when mixing legacy/new authors front matter', () => {
    expect(() =>
      getBlogPostAuthors({
        frontMatter: {
          authors: [{name: 'Sébastien Lorber'}],
          author: 'Yangshun Tay',
        },
        authorsMap: undefined,
        baseUrl: '/',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "To declare blog post authors, use the 'authors' front matter in priority.
      Don't mix 'authors' with other existing 'author_*' front matter. Choose one or the other, not both at the same time."
    `);

    expect(() =>
      getBlogPostAuthors({
        frontMatter: {
          authors: [{key: 'slorber'}],
          author_title: 'legacy title',
        },
        authorsMap: {
          slorber: {name: 'Sébastien Lorber', key: 'slorber', page: null},
        },
        baseUrl: '/',
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "To declare blog post authors, use the 'authors' front matter in priority.
      Don't mix 'authors' with other existing 'author_*' front matter. Choose one or the other, not both at the same time."
    `);
  });
});

describe('groupBlogPostsByAuthorKey', () => {
  const authorsMap: AuthorsMap = fromPartial({
    ozaki: {},
    slorber: {},
    keyWithNoPost: {},
  });

  it('can group blog posts', () => {
    const post1 = post({metadata: {authors: [{key: 'ozaki'}]}});
    const post2 = post({
      metadata: {authors: [{key: 'slorber'}, {key: 'ozaki'}]},
    });
    const post3 = post({metadata: {authors: [{key: 'slorber'}]}});
    const post4 = post({
      metadata: {authors: [{name: 'Inline author 1'}, {key: 'slorber'}]},
    });
    const post5 = post({
      metadata: {authors: [{name: 'Inline author 2'}]},
    });
    const post6 = post({
      metadata: {authors: [{key: 'unknownKey'}]},
    });

    const blogPosts = [post1, post2, post3, post4, post5, post6];

    expect(groupBlogPostsByAuthorKey({authorsMap, blogPosts})).toEqual({
      ozaki: [post1, post2],
      slorber: [post2, post3, post4],
      keyWithNoPost: [],
      // We don't care about this edge case, it doesn't happen in practice
      unknownKey: undefined,
    });
  });
});
