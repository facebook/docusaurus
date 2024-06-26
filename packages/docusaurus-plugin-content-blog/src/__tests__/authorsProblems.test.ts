/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {reportAuthorsProblems} from '../authorsProblems';
import type {Author} from '@docusaurus/plugin-content-blog';

describe('reportAuthorsProblems', () => {
  const blogSourceRelative = 'doc.md';

  type Options = Parameters<typeof reportAuthorsProblems>[0]['options'];

  describe('duplicate authors', () => {
    const options: Options = {
      onInlineAuthors: 'ignore',
      authorsMapPath: 'authors.yml',
    };

    function testReport({authors}: {authors: Author[]}) {
      reportAuthorsProblems({
        authors,
        options,
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
        "Duplicate blog authors found in blog post doc.md front matter:
        - {"key":"slorber","name":"Sébastien Lorber 2","imageURL":"/slorber.png"}"
      `);
    });
  });

  describe('inline authors', () => {
    const options: Options = {
      onInlineAuthors: 'throw',
      authorsMapPath: 'authors.yml',
    };

    function testReport({authors}: {authors: Author[]}) {
      reportAuthorsProblems({
        authors,
        options,
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
        "Some blog authors used in doc.md are not defined in authors.yml:
        - {"name":"Inline author 1"}
        - {"imageURL":"/inline-author2.png"}

        Note: if you want to allow inline blog authors, ignore this warning by setting onInlineAuthors: 'ignore' in your blog plugin options.
        "
      `);
    });
  });
});
