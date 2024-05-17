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
import {getTagsFile, processFileTagsPath} from '../docs';
import {validateDocFrontMatter} from '../frontMatter';

const createTest = async ({
  filePath,
  onUnknownTags,
}: {
  filePath: string;
  onUnknownTags: 'ignore' | 'log' | 'warn' | 'throw';
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
  const definedTags = await getTagsFile(
    fromPartial({
      onUnknownTags,
      tagsFilePath,
    }),
    contentPath,
  );

  return processFileTagsPath({
    tagsFile: definedTags,
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
      `"Tags [hello, world] used in <PROJECT_ROOT>/packages/docusaurus-plugin-content-docs/src/__tests__/__fixtures__/simple-tags/wrong.md are not defined in tags.yml"`,
    );
  });

  it('warns when docs has invalid tags', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    await createTest({
      filePath: path.join(testFolder, 'wrong.md'),
      onUnknownTags: 'warn',
    });

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/.*\[WARNING\].*Tags.*/),
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
