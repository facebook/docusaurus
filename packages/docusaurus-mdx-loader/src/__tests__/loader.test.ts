/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it, vi} from 'vitest';
import {mdxLoader} from '../loader';
import {DefaultMarkdownConfig} from './testUtils';
import type {Options} from '../options';
import type {WebpackCompilerName} from '@docusaurus/utils';
import type {Root} from 'mdast';
import type {Plugin} from 'unified';
import type {LoaderContext} from 'webpack';

const warningPlugin: Plugin<[], Root> = () => (_tree, file) => {
  file.message('This is a Remark plugin warning');
};

async function runLoader({
  fileContent,
  remarkPlugins,
  compilerName = 'client',
}: {
  fileContent: string;
  remarkPlugins?: Options['remarkPlugins'];
  compilerName?: WebpackCompilerName;
}): Promise<string> {
  const options: Options = {
    markdownConfig: DefaultMarkdownConfig,
    staticDirs: [],
    siteDir: '/site',
    remarkPlugins,
  };
  const filePath = '/site/docs/test.md';

  return new Promise<string>((resolve, reject) => {
    const context = {
      resource: filePath,
      resourcePath: filePath,
      _compiler: {name: compilerName},
      getOptions: () => options,
      addDependency: () => {},
      async: () => (error: Error | null, result?: string) =>
        error ? reject(error) : resolve(result!),
    } as unknown as LoaderContext<Options>;

    mdxLoader.call(context, fileContent);
  });
}

describe('mdxLoader', () => {
  it('warns about messages reported by Remark plugins', async () => {
    using warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await runLoader({
      fileContent: '# Title',
      remarkPlugins: [warningPlugin],
    });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0]![0]).toContain('This is a Remark plugin warning');
  });

  it('does not warn when Remark plugins report nothing', async () => {
    using warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await runLoader({fileContent: '# Title'});

    expect(warn).not.toHaveBeenCalled();
  });
});
