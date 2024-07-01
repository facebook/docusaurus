/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import {reportDuplicateAuthors, reportInlineAuthors} from '../authorsProblems';
import type {Author} from '@docusaurus/plugin-content-blog';

const blogSourceRelative = 'doc.md';

describe('duplicate authors', () => {
  function testReport({authors}: {authors: Author[]}) {
    reportDuplicateAuthors({
      authors,
      blogSourceRelative,
    });
  }

  it('allows duplicated inline authors', () => {
    const authors: Author[] = [
      {
        name: 'Sébastien Lorber',
      },
      {
        name: 'Sébastien Lorber',
      },
    ];

    expect(() =>
      testReport({
        authors,
      }),
    ).not.toThrow();
  });

  it('rejects duplicated key authors', () => {
    const authors: Author[] = [
      {
        key: 'slorber',
        name: 'Sébastien Lorber 1',
        title: 'some title',
      },
      {
        key: 'slorber',
        name: 'Sébastien Lorber 2',
        imageURL: '/slorber.png',
      },
    ];

    expect(() =>
      testReport({
        authors,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Duplicate blog post authors were found in blog post "doc.md" front matter:
      - {"key":"slorber","name":"Sébastien Lorber 2","imageURL":"/slorber.png"}"
    `);
  });
});

describe('inline authors', () => {
  type Options = Parameters<typeof reportInlineAuthors>[0]['options'];

  function testReport({
    authors,
    options = {},
  }: {
    authors: Author[];
    options?: Partial<Options>;
  }) {
    const defaultOptions: Options = {
      onInlineAuthors: 'throw',
      authorsMapPath: 'authors.yml',
    };

    reportInlineAuthors({
      authors,
      options: {
        ...defaultOptions,
        ...options,
      },
      blogSourceRelative,
    });
  }

  it('allows predefined authors', () => {
    const authors: Author[] = [
      {
        key: 'slorber',
        name: 'Sébastien Lorber',
      },
      {
        key: 'ozaki',
        name: 'Clément Couriol',
      },
    ];

    expect(() =>
      testReport({
        authors,
      }),
    ).not.toThrow();
  });

  it('rejects inline authors', () => {
    const authors: Author[] = [
      {
        key: 'slorber',
        name: 'Sébastien Lorber',
      },
      {name: 'Inline author 1'},
      {
        key: 'ozaki',
        name: 'Clément Couriol',
      },
      {imageURL: '/inline-author2.png'},
    ];

    expect(() =>
      testReport({
        authors,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      "Some blog authors used in "doc.md" are not defined in "authors.yml":
      - {"name":"Inline author 1"}
      - {"imageURL":"/inline-author2.png"}

      Note that we recommend to declare authors once in a "authors.yml" file and reference them by key in blog posts front matter to avoid author info duplication.
      But if you want to allow inline blog authors, you can disable this message by setting onInlineAuthors: 'ignore' in your blog plugin options.
      More info at https://docusaurus.io/docs/blog
      "
    `);
  });

  it('warn inline authors', () => {
    const authors: Author[] = [
      {
        key: 'slorber',
        name: 'Sébastien Lorber',
      },
      {name: 'Inline author 1'},
      {
        key: 'ozaki',
        name: 'Clément Couriol',
      },
      {imageURL: '/inline-author2.png'},
    ];

    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    expect(() =>
      testReport({
        authors,
        options: {
          onInlineAuthors: 'warn',
        },
      }),
    ).not.toThrow();
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "[WARNING] Some blog authors used in "doc.md" are not defined in "authors.yml":
      - {"name":"Inline author 1"}
      - {"imageURL":"/inline-author2.png"}

      Note that we recommend to declare authors once in a "authors.yml" file and reference them by key in blog posts front matter to avoid author info duplication.
      But if you want to allow inline blog authors, you can disable this message by setting onInlineAuthors: 'ignore' in your blog plugin options.
      More info at https://docusaurus.io/docs/blog
      ",
      ]
    `);
  });
});
