/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import processMetadata from '../metadata';

describe('processMetadata', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'website');
  const siteConfig = {
    title: 'Hello',
    baseUrl: '/',
    url: 'https://docusaurus.io',
  };
  const pluginPath = 'docs';
  const docsDir = path.resolve(siteDir, pluginPath);

  test('normal docs', async () => {
    const sourceA = path.join('foo', 'bar.md');
    const sourceB = path.join('hello.md');

    const [dataA, dataB] = await Promise.all([
      processMetadata(sourceA, docsDir, {}, siteConfig, pluginPath, siteDir),
      processMetadata(sourceB, docsDir, {}, siteConfig, pluginPath, siteDir),
    ]);
    expect(dataA).toEqual({
      id: 'foo/bar',
      permalink: '/docs/foo/bar',
      source: path.join('@site', pluginPath, sourceA),
      title: 'Bar',
      description: 'This is custom description',
    });
    expect(dataB).toEqual({
      id: 'hello',
      permalink: '/docs/hello',
      source: path.join('@site', pluginPath, sourceB),
      title: 'Hello, World !',
      description: `Hi, Endilie here :)`,
    });
  });

  test('docs with custom permalink', async () => {
    const source = path.join('permalink.md');
    const data = await processMetadata(
      source,
      docsDir,
      {},
      siteConfig,
      pluginPath,
      siteDir,
    );
    expect(data).toEqual({
      id: 'permalink',
      permalink: '/docs/endiliey/permalink',
      source: path.join('@site', pluginPath, source),
      title: 'Permalink',
      description: 'This has a different permalink',
    });
  });
});
