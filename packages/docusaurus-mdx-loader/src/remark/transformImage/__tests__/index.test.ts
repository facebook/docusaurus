/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import * as path from 'path';
import vfile from 'to-vfile';
import plugin, {type PluginOptions} from '../index';

const siteDir = path.join(__dirname, '__fixtures__');

const staticDirs = [
  path.join(__dirname, '__fixtures__/static'),
  path.join(__dirname, '__fixtures__/static2'),
];

const getProcessor = async (options?: Partial<PluginOptions>) => {
  const {remark} = await import('remark');
  const {default: mdx} = await import('remark-mdx');
  return remark()
    .use(mdx)
    .use(plugin, {
      siteDir,
      staticDirs,
      onBrokenMarkdownImages: 'throw',
      ...options,
    });
};

const processFixture = async (
  name: string,
  options?: Partial<PluginOptions>,
) => {
  const filePath = path.join(__dirname, `__fixtures__/${name}.md`);
  const file = await vfile.read(filePath);
  const processor = await getProcessor(options);
  const result = await processor.process(file);
  return result.value;
};

const processContent = async (
  content: string,
  options?: Partial<PluginOptions>,
) => {
  const processor = await getProcessor(options);
  const result = await processor.process({
    value: content,
    path: path.posix.join(siteDir, 'docs', 'myFile.mdx'),
  });
  return result.value;
};

describe('transformImage plugin', () => {
  it('transform md images to <img />', async () => {
    // TODO split that large fixture into many smaller test cases?
    const result = await processFixture('img');
    expect(result).toMatchSnapshot();
  });

  it('pathname protocol', async () => {
    const result = await processContent(
      `![img](pathname:///img/unchecked.png)`,
    );
    expect(result).toMatchSnapshot();
  });

  it('does not choke on invalid image', async () => {
    const errorMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = await processContent(`![invalid image](/invalid.png)`);
    expect(result).toMatchSnapshot();
    expect(errorMock).toHaveBeenCalledTimes(1);
  });

  describe('errors', () => {
    it('fail if image does not exist', async () => {
      await expect(
        processContent(`![img](/img/doesNotExist.png)`),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Image packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/static/img/doesNotExist.png or packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/static2/img/doesNotExist.png used in packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx not found."`,
      );
    });

    it('fail if image relative path does not exist', async () => {
      await expect(
        processContent(`![img](./notFound.png)`),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Image packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/notFound.png used in packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx not found."`,
      );
    });

    it('fail if image url is absent', async () => {
      await expect(
        processContent(`![img]()`),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Markdown image URL is mandatory in "packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/docs/myFile.mdx" file"`,
      );
    });
  });

  describe('warnings', () => {
    it('fail if image does not exist', async () => {
      await expect(
        processFixture('fail'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"ENOENT: no such file or directory, open '<PROJECT_ROOT>/packages/docusaurus-mdx-loader/src/remark/transformImage/__tests__/__fixtures__/fail.md'"`,
      );
    });
  });
});
