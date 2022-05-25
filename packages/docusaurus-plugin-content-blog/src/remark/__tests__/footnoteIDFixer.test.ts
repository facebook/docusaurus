/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {simpleHash} from '@docusaurus/utils';
import mdx from '@mdx-js/mdx';
import footnoteIDFixer from '../footnoteIDFixer';

const processFixture = async (name: string) => {
  const filepath = path.join(__dirname, `__fixtures__/${name}.md`);
  const result = await mdx(await fs.readFile(filepath, 'utf8'), {
    filepath,
    remarkPlugins: [footnoteIDFixer],
  });

  return result.toString();
};

describe('footnoteIDFixer remark plugin', () => {
  it('appends a hash to each footnote def/ref', async () => {
    const hash = simpleHash(path.join(__dirname, `__fixtures__/post.md`), 6);
    expect(
      (await processFixture('post')).replace(new RegExp(hash, 'g'), '[HASH]'),
    ).toMatchSnapshot();
  });

  it('produces different hashes for different posts but same hash for the same path', async () => {
    const file1 = await processFixture('post');
    const file1again = await processFixture('post');
    const file2 = await processFixture('post2');
    expect(file1).toBe(file1again);
    expect(file1).not.toBe(file2);
  });
});
