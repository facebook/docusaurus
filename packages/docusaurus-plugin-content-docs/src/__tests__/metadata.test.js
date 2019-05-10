/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '@babel/polyfill';
import path from 'path';
import processMetadata from '../metadata';

describe('processMetadata', () => {
  const siteDir = path.join(__dirname, '__fixtures__', 'website');
  const siteConfig = {
    title: 'Hello',
    baseUrl: '/',
    url: 'https://docusaurus.io',
  };
  const docsDir = path.resolve(siteDir, 'docs');

  test('normal docs', async () => {
    const sourceA = path.join('foo', 'bar.md');
    const sourceB = path.join('hello.md');
    const dataA = await processMetadata(
      sourceA,
      docsDir,
      {},
      siteConfig,
      'docs',
    );
    const dataB = await processMetadata(
      sourceB,
      docsDir,
      {},
      siteConfig,
      'docs',
    );
    expect(dataA).toEqual({
      id: 'foo/bar',
      permalink: '/docs/foo/bar',
      source: path.join(docsDir, sourceA),
      title: 'Bar',
      description: 'This is custom description',
    });
    expect(dataB).toEqual({
      id: 'hello',
      permalink: '/docs/hello',
      source: path.join(docsDir, sourceB),
      title: 'Hello, World !',
      description: `Hi, Endilie here :)`,
    });
  });

  test('docs with custom permalink', async () => {
    const source = path.join('permalink.md');
    const data = await processMetadata(source, docsDir, {}, siteConfig, 'docs');
    expect(data).toEqual({
      id: 'permalink',
      permalink: '/docs/endiliey/permalink',
      source: path.join(docsDir, source),
      title: 'Permalink',
      description: 'This has a different permalink',
    });
  });
});
