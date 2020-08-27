/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {join} from 'path';
import remark from 'remark';
import mdx from 'remark-mdx';
import vfile from 'to-vfile';
import plugin from '..';
import slug from '../../slug';

const processFixture = async (name, options) => {
  const path = join(__dirname, 'fixtures', `${name}.md`);
  const staticDir = join(__dirname, 'fixtures', 'static');
  const file = await vfile.read(path);
  const result = await remark()
    .use(slug)
    .use(mdx)
    .use(plugin, {...options, filePath: path, staticDir})
    .process(file);

  return result.toString();
};

describe('transformAsset plugin', () => {
  test('fail if asset url is absent', async () => {
    await expect(
      processFixture('noUrl'),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  test('transform md links to <a />', async () => {
    const result = await processFixture('asset');
    expect(result).toMatchSnapshot();
  });

  test('pathname protocol', async () => {
    const result = await processFixture('pathname');
    expect(result).toMatchSnapshot();
  });
});
