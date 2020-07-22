/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {join} from 'path';
import remark from 'remark';
import mdx from 'remark-mdx';
import rehype from 'remark-rehype';
import markdown from 'rehype-remark';
import vfile from 'to-vfile';
import plugin from '..';
import slug from '../../../remark/slug';

const processFixture = async (name, options) => {
  const path = join(__dirname, 'fixtures', `${name}.md`);
  const file = await vfile.read(path);
  const result = await remark()
    .use(slug)
    .use(mdx)
    .use(rehype)
    .use(plugin, {...options, filePath: path})
    .use(markdown)
    .process(file);

  return result.toString();
};

describe('transformAsset plugin', () => {
  test('fail if asset does not exist', async () => {
    await expect(processFixture('fail')).rejects.toThrowErrorMatchingSnapshot();
  });
  test('fail if asset url is absent', async () => {
    await expect(
      processFixture('noUrl'),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  test('transform md links to <img />', async () => {
    const result = await processFixture('asset');
    expect(result).toMatchSnapshot();
  });

  test('pathname protocol', async () => {
    const result = await processFixture('pathname');
    expect(result).toMatchSnapshot();
  });
});
