/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {fromPartial} from '@total-typescript/shoehorn';
import {parseMarkdownFile} from '@docusaurus/utils';
import {processFileTagsPath} from '../docs';
import {validateDocFrontMatter} from '../frontMatter';

const createTest = async ({
  filePath,
  onUnknownTags,
}: {
  filePath: string;
  onUnknownTags: 'ignore' | 'log' | 'warn' | 'throw' | undefined;
}) => {
  const contentPath = path.join(__dirname, '__fixtures__', 'simple-tags');
  const tagsFilePath = 'tags.yml';

  const {frontMatter: unsafeFrontMatter} = await parseMarkdownFile({
    filePath,
    fileContent: await fs.readFile(filePath, 'utf-8'),
    parseFrontMatter: async (params) => {
      const result = await params.defaultParseFrontMatter(params);
      return {...result};
    },
  });
  const frontMatter = validateDocFrontMatter(unsafeFrontMatter);

  return processFileTagsPath({
    contentPath,
    options: fromPartial({
      tagsFilePath,
      onUnknownTags,
    }),
    source: filePath,
    versionTagsPath: '/processFileTagsPath/tags',
    frontMatterTags: frontMatter.tags,
  });
};

describe('processFileTagsPath', () => {
  const testFolder = path.join(__dirname, '__fixtures__', 'simple-tags');

  it('throw when docs has invalid tags', async () => {
    const process = createTest({
      filePath: path.join(testFolder, 'wrong.md'),
      onUnknownTags: 'throw',
    });

    await expect(process).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Broken tags found in <PROJECT_ROOT>/packages/docusaurus-plugin-content-docs/src/__tests__/__fixtures__/simple-tags/wrong.md [hello,world] : "[0]" must be [open]"`,
    );
  });

  it('warns when docs has invalid tags', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const process = createTest({
      filePath: path.join(testFolder, 'wrong.md'),
      onUnknownTags: 'warn',
    });

    await process;

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /.*\[WARNING\].*Broken tags found in .*wrong\.md.*\[hello,world\] : "\[0\]" must be \[open\].*/,
      ),
    );
    consoleWarnSpy.mockRestore();
  });

  it('ignore when docs has invalid tags', async () => {
    const process = createTest({
      filePath: path.join(testFolder, 'wrong.md'),
      onUnknownTags: 'ignore',
    });
    await expect(process).resolves.toBeDefined();
  });

  it('does not throw when docs has valid tags', async () => {
    const process = createTest({
      filePath: path.join(testFolder, 'good.md'),
      onUnknownTags: 'throw',
    });
    await expect(process).resolves.toBeDefined();
  });
});
