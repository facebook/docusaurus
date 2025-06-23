/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as path from 'path';
import vfile from 'to-vfile';
import plugin from '..';
import transformImage, {type PluginOptions} from '../../transformImage';

const siteDir = path.join(__dirname, `__fixtures__`);

const staticDirs = [
  path.join(siteDir, 'static'),
  path.join(siteDir, 'static2'),
];

const getProcessor = async (options?: Partial<PluginOptions>) => {
  const {remark} = await import('remark');
  const {default: mdx} = await import('remark-mdx');
  return remark()
    .use(mdx)
    .use(transformImage, {
      siteDir,
      staticDirs,
      onBrokenMarkdownImages: 'throw',
    })
    .use(plugin, {
      staticDirs,
      siteDir,
      onBrokenMarkdownLinks: 'throw',
      ...options,
    });
};

const processFixture = async (
  name: string,
  options?: Partial<PluginOptions>,
) => {
  const processor = await getProcessor(options);
  const file = await vfile.read(path.join(siteDir, `${name}.md`));
  const result = await processor.process(file);
  return result.value.toString().trim();
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
  return result.value.toString().trim();
};

describe('transformAsset plugin', () => {
  it('transform md links to <a />', async () => {
    // TODO split fixture in many smaller test cases
    const result = await processFixture('asset');
    expect(result).toMatchSnapshot();
  });

  it('pathname protocol', async () => {
    const result = await processContent(
      `[asset](pathname:///asset/unchecked.pdf)`,
    );
    expect(result).toMatchInlineSnapshot(
      `"[asset](pathname:///asset/unchecked.pdf)"`,
    );
  });

  describe('throws', () => {
    it('fail if asset url is absent', async () => {
      await expect(
        processContent(`[asset]()`),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Markdown link URL is mandatory in "packages/docusaurus-mdx-loader/src/remark/transformLinks/__tests__/__fixtures__/docs/myFile.mdx" file (title: asset, line: 1)."`,
      );
    });

    it('fail if asset with site alias does not exist', async () => {
      await expect(
        processContent(`[nonexistent](@site/foo.pdf)`),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Asset packages/docusaurus-mdx-loader/src/remark/transformLinks/__tests__/__fixtures__/foo.pdf used in packages/docusaurus-mdx-loader/src/remark/transformLinks/__tests__/__fixtures__/docs/myFile.mdx not found."`,
      );
    });
  });
});
