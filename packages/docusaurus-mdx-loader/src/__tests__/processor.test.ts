/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {createProcessorUncached} from '../processor';
import {DefaultMarkdownConfig} from './testUtils';
import type {Options} from '../options';
import type {Root} from 'mdast';
import type {Plugin} from 'unified';

async function process({
  content,
  remarkPlugins,
}: {
  content: string;
  remarkPlugins?: Options['remarkPlugins'];
}) {
  const processor = await createProcessorUncached({
    options: {
      markdownConfig: DefaultMarkdownConfig,
      staticDirs: [],
      siteDir: '/site',
      remarkPlugins,
    },
    format: 'md',
  });
  return processor.process({
    content,
    filePath: '/site/docs/test.md',
    frontMatter: {},
    compilerName: 'client',
  });
}

describe('mdx processor', () => {
  it('returns messages reported by Remark plugins', async () => {
    const reportingPlugin: Plugin<[], Root> = () => (_tree, file) => {
      file.message('This is a Remark plugin warning');
    };

    const result = await process({
      content: '# Title',
      remarkPlugins: [reportingPlugin],
    });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0]!.reason).toBe('This is a Remark plugin warning');
  });

  it('returns no messages when Remark plugins report nothing', async () => {
    const result = await process({content: '# Title'});

    expect(result.messages).toEqual([]);
  });
});
