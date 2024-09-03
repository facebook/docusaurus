/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import vfile from 'to-vfile';
import plugin, {type PluginOptions} from '../index';

const processFixture = async (
  name: string,
  options: Partial<PluginOptions>,
) => {
  const {remark} = await import('remark');
  const {default: mdx} = await import('remark-mdx');
  const filePath = path.join(__dirname, `__fixtures__/${name}.md`);
  const file = await vfile.read(filePath);

  const result = await remark()
    .use(mdx)
    .use(plugin, {siteDir: __dirname, staticDirs: [], ...options})
    .process(file);

  return result.value;
};

const staticDirs = [
  path.join(__dirname, '__fixtures__/static'),
  path.join(__dirname, '__fixtures__/static2'),
];

const siteDir = path.join(__dirname, '__fixtures__');

describe('transformImage plugin', () => {
  it('fail if image does not exist', async () => {
    await expect(
      processFixture('fail', {staticDirs}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
  it('fail if image relative path does not exist', async () => {
    await expect(
      processFixture('fail2', {staticDirs}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
  it('fail if image url is absent', async () => {
    await expect(
      processFixture('noUrl', {staticDirs}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('transform md images to <img />', async () => {
    const result = await processFixture('img', {staticDirs, siteDir});
    expect(result).toMatchSnapshot();
  });

  it('pathname protocol', async () => {
    const result = await processFixture('pathname', {staticDirs});
    expect(result).toMatchSnapshot();
  });

  it('does not choke on invalid image', async () => {
    const errorMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await processFixture('invalid-img', {staticDirs});
    expect(result).toMatchSnapshot();
    expect(errorMock).toHaveBeenCalledTimes(1);
  });
});
