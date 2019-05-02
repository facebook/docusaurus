/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '@babel/polyfill';
import path from 'path';
import processMetadata from '../metadata';
import loadSetup from '../../../docusaurus/lib/server/load/__tests__/loadSetup';

describe('processMetadata', () => {
  test('normal docs', async () => {
    const props = await loadSetup('simple');
    const {siteDir, env, siteConfig} = props;
    const docsDir = path.resolve(siteDir, '..', 'docs');
    const sourceA = path.join('foo', 'bar.md');
    const sourceB = path.join('hello.md');
    const dataA = await processMetadata(
      sourceA,
      docsDir,
      env,
      {},
      siteConfig,
      'docs',
    );
    const dataB = await processMetadata(
      sourceB,
      docsDir,
      env,
      {},
      siteConfig,
      'docs',
    );
    expect(dataA).toEqual({
      id: 'foo/bar',
      language: null,
      localized_id: 'foo/bar',
      permalink: '/docs/foo/bar',
      source: path.join(docsDir, sourceA),
      title: 'Bar',
      version: null,
    });
    expect(dataB).toEqual({
      id: 'hello',
      language: null,
      localized_id: 'hello',
      permalink: '/docs/hello',
      source: path.join(docsDir, sourceB),
      title: 'Hello, World !',
      version: null,
    });
  });

  test('docs with custom permalink', async () => {
    const props = await loadSetup('simple');
    const {siteDir, env, siteConfig} = props;
    const docsDir = path.resolve(siteDir, '..', 'docs');
    const source = path.join('permalink.md');
    const data = await processMetadata(
      source,
      docsDir,
      env,
      {},
      siteConfig,
      'docs',
    );
    expect(data).toEqual({
      id: 'permalink',
      language: null,
      localized_id: 'permalink',
      permalink: '/docs/endiliey/permalink',
      source: path.join(docsDir, source),
      title: 'Permalink',
      version: null,
    });
  });
});
