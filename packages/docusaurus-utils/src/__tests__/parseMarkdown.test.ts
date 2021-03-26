/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {parseMarkdownString, readFrontMatter} from '../index';
import dedent from 'dedent';

describe('load utils: parseMarkdown', () => {
  describe('readFrontMatter', () => {
    test('should read front matter', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        readFrontMatter(dedent`
        ---
        title: test
        ---
        `),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
    test('should parse first heading as title', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        readFrontMatter(dedent`
        # test
        `),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
    test('should preserve front-matter title and warn about duplication', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        readFrontMatter(dedent`
        ---
        title: title
        ---
        # test
        `),
      ).toMatchSnapshot();
      expect(warn).toBeCalledWith('Duplicate title detected in `this` file');
      warn.mockReset();
    });
    test('should ignore heading if its not a first text', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        readFrontMatter(dedent`
        foo
        # test
        `),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
    test('should parse first heading as title and keep it in content', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        readFrontMatter(
          dedent`
          # test
          `,
          undefined,
          {},
          false,
        ),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
    test('should delete only first heading', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        readFrontMatter(dedent`
        # test
        test test test # test bar
        # test
        ### test
        `),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
    test('should parse front-matter and ignore h2', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        readFrontMatter(
          dedent`
          ---
          title: title
          ---
          ## test
          `,
          undefined,
          {},
          false,
        ),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
    test('should not warn about duplicated title', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        readFrontMatter(
          dedent`
          ---
          title: title
          ---
          # test
          `,
          undefined,
          {},
          false,
        ),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
  });

  describe('parseMarkdownString', () => {
    test('should read front matter', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        parseMarkdownString(dedent`
        ---
        title: test
        ---
        `),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
    test('should parse first heading as title', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        parseMarkdownString(dedent`
        # test
        `),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
    test('should preserve front-matter title and warn about duplication', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        parseMarkdownString(dedent`
        ---
        title: title
        ---
        # test
        `),
      ).toMatchSnapshot();
      expect(warn).toBeCalledWith('Duplicate title detected in `this` file');
      warn.mockReset();
    });
    test('should ignore heading if its not a first text', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        parseMarkdownString(dedent`
        foo
        # test
        `),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
    test('should delete only first heading', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(
        parseMarkdownString(dedent`
        # test

        test test test test test test
        test test test # test bar
        # test
        ### test
        `),
      ).toMatchSnapshot();
      expect(warn).not.toBeCalled();
    });
  });
});
