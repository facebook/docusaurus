/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadContext} from '@docusaurus/core/src/server/index';
import processMetadata from '../metadata';

describe('processMetadata', () => {
  const fixtureDir = path.join(__dirname, '__fixtures__');
  const simpleSiteDir = path.join(fixtureDir, 'simple-site');
  const context = loadContext(simpleSiteDir);
  const pluginPath = 'docs';
  const docsDir = path.resolve(simpleSiteDir, pluginPath);

  test('normal docs', async () => {
    const sourceA = path.join('foo', 'bar.md');
    const sourceB = path.join('hello.md');

    const [dataA, dataB] = await Promise.all([
      processMetadata({
        source: sourceA,
        refDir: docsDir,
        context,
        docsBasePath: pluginPath,
      }),
      processMetadata({
        source: sourceB,
        refDir: docsDir,
        context,
        docsBasePath: pluginPath,
      }),
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

  test('docs with editUrl', async () => {
    const editUrl =
      'https://github.com/facebook/docusaurus/edit/master/website';
    const source = path.join('foo', 'baz.md');
    const data = await processMetadata({
      source,
      refDir: docsDir,
      context,
      docsBasePath: pluginPath,
      editUrl,
    });

    expect(data).toEqual({
      id: 'foo/baz',
      permalink: '/docs/foo/baz',
      source: path.join('@site', pluginPath, source),
      title: 'baz',
      editUrl:
        'https://github.com/facebook/docusaurus/edit/master/website/docs/foo/baz.md',
      description: '## Images',
    });
  });

  test('docs with custom editUrl', async () => {
    const source = 'lorem.md';
    const data = await processMetadata({
      source,
      refDir: docsDir,
      context,
      docsBasePath: pluginPath,
    });

    expect(data).toEqual({
      id: 'lorem',
      permalink: '/docs/lorem',
      source: path.join('@site', pluginPath, source),
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
    });
  });

  test('docs with last update time and author', async () => {
    const source = 'lorem.md';
    const data = await processMetadata({
      source,
      refDir: docsDir,
      context,
      docsBasePath: pluginPath,
      showLastUpdateAuthor: true,
      showLastUpdateTime: true,
    });

    expect(data).toEqual({
      id: 'lorem',
      permalink: '/docs/lorem',
      source: path.join('@site', pluginPath, source),
      title: 'lorem',
      editUrl: 'https://github.com/customUrl/docs/lorem.md',
      description: 'Lorem ipsum.',
      lastUpdatedAt: 1539502055,
      lastUpdatedBy: 'Author',
    });
  });

  test('docs with invalid id', async () => {
    const badSiteDir = path.join(fixtureDir, 'bad-site');

    return processMetadata({
      source: 'invalid-id.md',
      refDir: path.join(badSiteDir, 'docs'),
      context,
      docsBasePath: 'docs',
    }).catch(e =>
      expect(e).toMatchInlineSnapshot(
        `[Error: Document id cannot include "/".]`,
      ),
    );
  });

  // TODO: docs for versioning
});
