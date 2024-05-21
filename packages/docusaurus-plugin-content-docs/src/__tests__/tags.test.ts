/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {fromPartial} from '@total-typescript/shoehorn';
import {getTagsFile, processFileTagsPath} from '../docs';
import {validateFrontMatterTags} from '../tags';
import type {PluginOptions} from '@docusaurus/plugin-content-docs';
import type {FrontMatterTag} from '@docusaurus/utils';

const createTest = async ({
  filePath,
  onUnknownTags,
  tags,
}: {
  filePath: string;
  onUnknownTags: PluginOptions['onUnknownTags'];
  tags: FrontMatterTag[];
}) => {
  const contentPath = path.join(__dirname, '__fixtures__', 'simple-tags');
  const tagsFilePath = 'tags.yml';

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
    frontMatterTags: tags,
  });
};

describe('processFileTagsPath', () => {
  it('throw when docs has invalid tags', async () => {
    const testFn = () =>
      validateFrontMatterTags(
        fromPartial({
          tags: [
            {
              label: 'hello',
              permalink: 'hello',
              inline: true,
            },
            {
              label: 'world',
              permalink: 'world',
              inline: true,
            },
          ],
          source: 'wrong.md',
          options: {onUnknownTags: 'throw', tagsFilePath: 'tags.yml'},
        }),
      );

    expect(testFn).toThrowErrorMatchingInlineSnapshot(
      `"Tags [hello, world] used in wrong.md are not defined in tags.yml"`,
    );
  });

  it('warns when docs has invalid tags', async () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    validateFrontMatterTags(
      fromPartial({
        tags: [
          {
            label: 'hello',
            permalink: 'hello',
            inline: true,
          },
          {
            label: 'world',
            permalink: 'world',
            inline: true,
          },
        ],
        options: {onUnknownTags: 'warn', tagsFilePath: 'tags.yml'},
      }),
    );

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringMatching(/.*\[WARNING\].*Tags.*/),
    );
    consoleWarnSpy.mockRestore();
  });

  it('ignore when docs has invalid tags', async () => {
    const process = createTest({
      filePath: 'wrong.md',
      tags: ['hello', 'world'],
      onUnknownTags: 'ignore',
    });
    await expect(process).resolves.toBeDefined();
  });

  it('does not throw when docs has valid tags', async () => {
    const process = createTest({
      filePath: 'good.md',
      tags: ['open'],
      onUnknownTags: 'throw',
    });
    await expect(process).resolves.toBeDefined();
  });
});
