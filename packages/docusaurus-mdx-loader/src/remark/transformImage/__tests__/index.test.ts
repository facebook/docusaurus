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
import plugin from '../index';
import headings from '../../headings/index';

const staticDirs = [
  path.join(__dirname, '__fixtures__/static'),
  path.join(__dirname, '__fixtures__/static2'),
];

const siteDir = path.join(__dirname, '__fixtures__');

const processFixture = async (name, options) => {
  const filePath = path.join(__dirname, `__fixtures__/${name}.md`);
  const file = await vfile.read(filePath);
  const result = await remark()
    .use(headings)
    .use(mdx)
    .use(plugin, {
      staticDirs,
      siteDir,
      filePath,
      onBrokenMarkdownAssets: 'throw',
      ...options,
    })
    .process(file);

  return result
    .toString()
    .replace(/\\\\/g, '/')
    .replace(new RegExp(process.cwd().replace(/\\/g, '/'), 'g'), '[CWD]');
};

describe('transformImage plugin', () => {
  test('fail if image does not exist', async () => {
    await expect(
      processFixture('fail', {}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
  test('fail if image relative path does not exist', async () => {
    await expect(
      processFixture('fail2', {}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
  test('fail if image url is absent', async () => {
    await expect(
      processFixture('noUrl', {}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
  test("fail if image with site alias does not exist even when broken assets don't throw", async () => {
    await expect(
      processFixture('nonExistentSiteAlias', {onBrokenMarkdownAssets: 'warn'}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
  test("succeeds if image is bad but broken assets don't throw", async () => {
    const consoleMock = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    await expect(
      processFixture('fail', {onBrokenMarkdownAssets: 'warn'}),
    ).resolves.toMatchSnapshot();
    await expect(
      processFixture('fail2', {onBrokenMarkdownAssets: 'warn'}),
    ).resolves.toMatchSnapshot();
    await expect(
      processFixture('noUrl', {onBrokenMarkdownAssets: 'warn'}),
    ).resolves.toMatchSnapshot();
    expect(consoleMock).toBeCalledTimes(3);
  });

  test('transform md images to <img />', async () => {
    const result = await processFixture('img', {});
    expect(result).toMatchSnapshot();
  });

  test('pathname protocol', async () => {
    const result = await processFixture('pathname', {});
    expect(result).toMatchSnapshot();
  });
});
