/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {fromPartial} from '@total-typescript/shoehorn';
import {processFileTagsPath} from '../docs';

describe('processFileTagsPath', () => {
  it('docs with valid tags', async () => {
    // const siteDir = path.join(__dirname, '__fixtures__', 'simple-tags');
    // const context = await loadContext({siteDir});
    // console.log('context:', context);

    const contentPath = path.join(
      __dirname,
      '__fixtures__',
      'simple-tags',
      'docs',
    );

    const tagsFilePath = 'tags.yml';

    const process = processFileTagsPath({
      contentPath,
      options: fromPartial({
        tagsFilePath,
        onBrokenTags: 'throw',
      }),
      source: path.join(contentPath, 'hello.md'),
      versionTagsPath: '/processFileTagsPath/tags',
      frontMatterTags: ['tag1', 'tag2'],
    });
    console.log('process:', process);
    await expect(process).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Broken tags found in <PROJECT_ROOT>/packages/docusaurus-plugin-content-docs/src/__tests__/__fixtures__/simple-tags/docs/hello.md [tag1,tag2] : "[0]" must be [open]"`,
    );
  });
});
