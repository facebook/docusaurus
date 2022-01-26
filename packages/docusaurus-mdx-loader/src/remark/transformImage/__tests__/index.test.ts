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

const processFixture = async (name, options) => {
  const filePath = path.join(__dirname, `__fixtures__/${name}.md`);
  const file = await vfile.read(filePath);
  const result = await remark()
    .use(headings)
    .use(mdx)
    .use(plugin, {...options, filePath})
    .process(file);

  return result
    .toString()
    .replace(/\\\\/g, '/')
    .replace(new RegExp(process.cwd().replace(/\\/g, '/'), 'g'), '[CWD]');
};

const staticDirs = [
  path.join(__dirname, '__fixtures__/static'),
  path.join(__dirname, '__fixtures__/static2'),
];

const siteDir = path.join(__dirname, '__fixtures__');

describe('transformImage plugin', () => {
  test('fail if image does not exist', async () => {
    await expect(
      processFixture('fail', {staticDirs}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
  test('fail if image relative path does not exist', async () => {
    await expect(
      processFixture('fail2', {staticDirs}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });
  test('fail if image url is absent', async () => {
    await expect(
      processFixture('noUrl', {staticDirs}),
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  test('transform md images to <img />', async () => {
    const result = await processFixture('img', {staticDirs, siteDir});
    expect(result).toMatchSnapshot();
  });

  test('pathname protocol', async () => {
    const result = await processFixture('pathname', {staticDirs});
    expect(result).toMatchSnapshot();
  });
});
