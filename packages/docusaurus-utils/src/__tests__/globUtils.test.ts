/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  GlobExcludeDefault,
  createMatcher,
  createAbsoluteFilePathMatcher,
} from '../globUtils';

describe('createMatcher', () => {
  const matcher = createMatcher(GlobExcludeDefault);

  test('match default exclude MD/MDX partials correctly', () => {
    expect(matcher('doc.md')).toEqual(false);
    expect(matcher('category/doc.md')).toEqual(false);
    expect(matcher('category/subcategory/doc.md')).toEqual(false);
    //
    expect(matcher('doc.mdx')).toEqual(false);
    expect(matcher('category/doc.mdx')).toEqual(false);
    expect(matcher('category/subcategory/doc.mdx')).toEqual(false);
    //
    expect(matcher('_doc.md')).toEqual(true);
    expect(matcher('category/_doc.md')).toEqual(true);
    expect(matcher('category/subcategory/_doc.md')).toEqual(true);
    expect(matcher('_category/doc.md')).toEqual(true);
    expect(matcher('_category/subcategory/doc.md')).toEqual(true);
    expect(matcher('category/_subcategory/doc.md')).toEqual(true);
  });

  test('match default exclude tests correctly', () => {
    expect(matcher('xyz.js')).toEqual(false);
    expect(matcher('xyz.ts')).toEqual(false);
    expect(matcher('xyz.jsx')).toEqual(false);
    expect(matcher('xyz.tsx')).toEqual(false);
    expect(matcher('folder/xyz.js')).toEqual(false);
    expect(matcher('folder/xyz.ts')).toEqual(false);
    expect(matcher('folder/xyz.jsx')).toEqual(false);
    expect(matcher('folder/xyz.tsx')).toEqual(false);
    //
    expect(matcher('xyz.test.js')).toEqual(true);
    expect(matcher('xyz.test.ts')).toEqual(true);
    expect(matcher('xyz.test.jsx')).toEqual(true);
    expect(matcher('xyz.test.tsx')).toEqual(true);
    expect(matcher('folder/xyz.test.js')).toEqual(true);
    expect(matcher('folder/xyz.test.ts')).toEqual(true);
    expect(matcher('folder/xyz.test.jsx')).toEqual(true);
    expect(matcher('folder/xyz.test.tsx')).toEqual(true);
    expect(matcher('folder/subfolder/xyz.test.js')).toEqual(true);
    expect(matcher('folder/subfolder/xyz.test.ts')).toEqual(true);
    expect(matcher('folder/subfolder/xyz.test.jsx')).toEqual(true);
    expect(matcher('folder/subfolder/xyz.test.tsx')).toEqual(true);
    //
    expect(matcher('__tests__/subfolder/xyz.js')).toEqual(true);
    expect(matcher('__tests__/subfolder/xyz.ts')).toEqual(true);
    expect(matcher('__tests__/subfolder/xyz.jsx')).toEqual(true);
    expect(matcher('__tests__/subfolder/xyz.tsx')).toEqual(true);
    expect(matcher('folder/__tests__/xyz.js')).toEqual(true);
    expect(matcher('folder/__tests__/xyz.ts')).toEqual(true);
    expect(matcher('folder/__tests__/xyz.jsx')).toEqual(true);
    expect(matcher('folder/__tests__/xyz.tsx')).toEqual(true);
  });
});

describe('createAbsoluteFilePathMatcher', () => {
  const rootFolders = ['/_root/docs', '/root/_docs/', '/__test__/website/src'];

  const matcher = createAbsoluteFilePathMatcher(
    GlobExcludeDefault,
    rootFolders,
  );

  test('match default exclude MD/MDX partials correctly', () => {
    expect(matcher('/_root/docs/myDoc.md')).toEqual(false);
    expect(matcher('/_root/docs/myDoc.mdx')).toEqual(false);
    expect(matcher('/root/_docs/myDoc.md')).toEqual(false);
    expect(matcher('/root/_docs/myDoc.mdx')).toEqual(false);
    expect(matcher('/_root/docs/category/myDoc.md')).toEqual(false);
    expect(matcher('/_root/docs/category/myDoc.mdx')).toEqual(false);
    expect(matcher('/root/_docs/category/myDoc.md')).toEqual(false);
    expect(matcher('/root/_docs/category/myDoc.mdx')).toEqual(false);
    //
    expect(matcher('/_root/docs/_myDoc.md')).toEqual(true);
    expect(matcher('/_root/docs/_myDoc.mdx')).toEqual(true);
    expect(matcher('/root/_docs/_myDoc.md')).toEqual(true);
    expect(matcher('/root/_docs/_myDoc.mdx')).toEqual(true);
    expect(matcher('/_root/docs/_category/myDoc.md')).toEqual(true);
    expect(matcher('/_root/docs/_category/myDoc.mdx')).toEqual(true);
    expect(matcher('/root/_docs/_category/myDoc.md')).toEqual(true);
    expect(matcher('/root/_docs/_category/myDoc.mdx')).toEqual(true);
  });

  test('match default exclude tests correctly', () => {
    expect(matcher('/__test__/website/src/xyz.js')).toEqual(false);
    expect(matcher('/__test__/website/src/__test__/xyz.js')).toEqual(true);
    expect(matcher('/__test__/website/src/xyz.test.js')).toEqual(true);
  });

  test('throw if file is not contained in any root doc', () => {
    expect(() =>
      matcher('/bad/path/myDoc.md'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"createAbsoluteFilePathMatcher unexpected error, absoluteFilePath=/bad/path/myDoc.md was not contained in any of the root folders [\\"/_root/docs\\",\\"/root/_docs/\\",\\"/__test__/website/src\\"]"`,
    );
  });
});
