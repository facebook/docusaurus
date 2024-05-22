/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {fromPartial} from '@total-typescript/shoehorn';
import {normalizeTags} from '@docusaurus/utils/lib/tags';
import {getTagsFile, processFileTagsPath} from '../docs';
import {validateFrontMatterTags} from '../tags';
import type {PluginOptions} from '@docusaurus/plugin-content-docs';
import type {FrontMatterTag} from '@docusaurus/utils';

async function getTagsFileDefinition(options: PluginOptions) {
  const contentPath = path.join(__dirname, '__fixtures__', 'simple-tags');

  return getTagsFile(
    fromPartial({
      onUnknownTags: options.onUnknownTags,
      tagsFilePath: options.tagsFilePath,
    }),
    contentPath,
  );
}

const createTest = async ({
  onUnknownTags,
  tags,
}: {
  onUnknownTags: PluginOptions['onUnknownTags'];
  tags: FrontMatterTag[];
}) => {
  const tagsFilePath = 'tags.yml';

  const definedTags = await getTagsFileDefinition(
    fromPartial({
      onUnknownTags,
      tagsFilePath,
    }),
  );

  return processFileTagsPath({
    tagsFile: definedTags,
    options: fromPartial({
      tagsFilePath,
      onUnknownTags,
    }),
    source: 'default.md',
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
      tags: ['unknownTag'],
      onUnknownTags: 'ignore',
    });
    await expect(process).resolves.toBeDefined();
  });

  it('throw for unknown string and object tag', async () => {
    const process = createTest({
      tags: [
        'open',
        'world',
        {label: 'hello', permalink: 'hello'},
        {label: 'open', permalink: 'open'},
      ],
      onUnknownTags: 'throw',
    });
    await expect(process).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Tags [world, hello, open] used in default.md are not defined in tags.yml"`,
    );
  });

  it('does not throw when docs has valid tags', async () => {
    const process = createTest({
      tags: ['open'],
      onUnknownTags: 'throw',
    });
    await expect(process).resolves.toBeDefined();
  });
});

describe('normalize tags', () => {
  it('normalize tags', async () => {
    const tagsFile = await getTagsFileDefinition(
      fromPartial({
        onUnknownTags: 'throw',
        tagsFilePath: 'tags.yml',
      }),
    );

    const tags = [
      'hello',
      'world',
      {label: 'hello', permalink: 'hello'},
      {label: 'world', permalink: 'world'},
      'hello',
      'open',
      {label: 'open', permalink: 'open'},
      'test',
    ];

    const normalizedTags = normalizeTags({
      versionTagsPath: '/tags',
      tagsFile,
      frontMatterTags: tags,
    });

    expect(normalizedTags).toEqual([
      {
        label: 'hello',
        permalink: '/tags/hello',
        inline: true,
      },
      {
        label: 'world',
        permalink: '/tags/world',
        inline: true,
      },
      {
        label: 'Open Source',
        permalink: '/tags/open-source',
        inline: false,
      },
      {
        inline: true,
        label: 'open',
        permalink: '/tags/open',
      },
      {
        label: 'Test',
        permalink: '/tags/custom-test',
        inline: false,
      },
    ]);
  });
});
