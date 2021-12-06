/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import remark from 'remark';
import mdx from 'remark-mdx';
import vfile from 'to-vfile';
import plugin from '..';
import transformImage from '../../transformImage';
import {posixPath} from '@docusaurus/utils';

const processFixture = async (name: string, options?) => {
  const filePath = path.join(__dirname, `__fixtures__/${name}.md`);
  const staticDirs = [
    path.join(__dirname, '__fixtures__/static'),
    path.join(__dirname, '__fixtures__/static2'),
  ];
  const file = await vfile.read(filePath);
  const result = await remark()
    .use(mdx)
    .use(transformImage, {...options, filePath, staticDirs})
    .use(plugin, {
      ...options,
      filePath,
      staticDirs,
      siteDir: path.join(__dirname, '__fixtures__'),
    })
    .process(file);

  return result
    .toString()
    .replace(new RegExp(posixPath(process.cwd()), 'g'), '[CWD]');
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
