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

describe('processFileTagsPath', () => {
  it('docs with valid tags', async () => {
    const contentPath = path.join(
      __dirname,
      '__fixtures__',
      'simple-tags',
      'docs',
    );

    const tagsFilePath = 'tags.yml';
    const filePath = path.join(contentPath, 'hello.md');
    const {frontMatter: unsafeFrontMatter} = await parseMarkdownFile({
      filePath,
      fileContent: await fs.readFile(filePath, 'utf-8'),
      parseFrontMatter: async (params) => {
        const result = await params.defaultParseFrontMatter(params);
        return {
          ...result,
        };
      },
    });
    const frontMatter = validateDocFrontMatter(unsafeFrontMatter);

    const process = processFileTagsPath({
      contentPath,
      options: fromPartial({
        tagsFilePath,
        onBrokenTags: 'throw',
      }),
      source: filePath,
      versionTagsPath: '/processFileTagsPath/tags',
      frontMatterTags: frontMatter.tags,
    });
    await expect(process).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Broken tags found in <PROJECT_ROOT>/packages/docusaurus-plugin-content-docs/src/__tests__/__fixtures__/simple-tags/docs/hello.md [hello,world] : "[0]" must be [open]"`,
    );
  });
});
