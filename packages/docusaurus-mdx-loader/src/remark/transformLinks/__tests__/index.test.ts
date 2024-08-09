/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import vfile from 'to-vfile';
import plugin from '..';
import transformImage, {type PluginOptions} from '../../transformImage';

const processFixture = async (name: string, options?: PluginOptions) => {
  const {remark} = await import('remark');
  const {default: mdx} = await import('remark-mdx');
  const siteDir = path.join(__dirname, `__fixtures__`);
  const staticDirs = [
    path.join(siteDir, 'static'),
    path.join(siteDir, 'static2'),
  ];
  const file = await vfile.read(path.join(siteDir, `${name}.md`));
  const result = await remark()
    .use(mdx)
    .use(transformImage, {...options, siteDir, staticDirs})
    .use(plugin, {
      ...options,
      staticDirs,
      siteDir: path.join(__dirname, '__fixtures__'),
    })
    .process(file);

  return result.value;
};

describe('transformAsset plugin', () => {
  it('fail if asset url is absent', async () => {
    await expect(
      processFixture('noUrl'),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('fail if asset with site alias does not exist', async () => {
    await expect(
      processFixture('nonexistentSiteAlias'),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('transform md links to <a />', async () => {
    const result = await processFixture('asset');
    expect(result).toMatchSnapshot();
  });

  it('pathname protocol', async () => {
    const result = await processFixture('pathname');
    expect(result).toMatchSnapshot();
  });
});
