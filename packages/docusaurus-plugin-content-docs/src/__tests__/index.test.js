/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import '@babel/polyfill';
import path from 'path';
import loadSetup from '../../../docusaurus/test/loadSetup';
import DocusaurusPluginContentDocs from '../index';

describe('loadDocs', () => {
  test('simple website', async () => {
    const {env, siteDir, siteConfig} = await loadSetup('simple');
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const plugin = new DocusaurusPluginContentDocs(
      {
        path: '../docs',
        sidebarPath,
      },
      {
        env,
        siteDir,
        siteConfig,
      },
    );
    const {docs: docsMetadata} = await plugin.loadContent();
    const docsDir = plugin.contentPath;

    expect(docsMetadata.hello).toEqual({
      category: 'Guides',
      id: 'hello',
      language: null,
      localized_id: 'hello',
      permalink: '/docs/hello',
      previous: 'foo/baz',
      previous_id: 'foo/baz',
      previous_title: 'baz',
      sidebar: 'docs',
      source: path.join(docsDir, 'hello.md'),
      title: 'Hello, World !',
      version: null,
    });
    expect(docsMetadata['foo/bar']).toEqual({
      category: 'Test',
      id: 'foo/bar',
      language: null,
      localized_id: 'foo/bar',
      next: 'foo/baz',
      next_id: 'foo/baz',
      next_title: 'baz',
      permalink: '/docs/foo/bar',
      sidebar: 'docs',
      source: path.join(docsDir, 'foo', 'bar.md'),
      title: 'Bar',
      version: null,
    });
  });

  test('versioned website', async () => {
    const {env, siteDir, siteConfig, versionedDir} = await loadSetup(
      'versioned',
    );
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const plugin = new DocusaurusPluginContentDocs(
      {
        path: '../docs',
        sidebarPath,
      },
      {
        env,
        siteDir,
        siteConfig,
      },
    );
    const {docs: docsMetadata} = await plugin.loadContent();
    const docsDir = plugin.contentPath;

    expect(docsMetadata['version-1.0.0-foo/bar']).toEqual({
      category: 'Test',
      id: 'version-1.0.0-foo/bar',
      language: null,
      localized_id: 'version-1.0.0-foo/bar',
      next: 'version-1.0.0-foo/baz',
      next_id: 'version-1.0.0-foo/baz',
      next_title: 'Baz',
      permalink: '/docs/1.0.0/foo/bar',
      sidebar: 'version-1.0.0-docs',
      source: path.join(versionedDir, 'version-1.0.0/foo/bar.md'),
      title: 'Bar',
      version: '1.0.0',
    });
    expect(docsMetadata['foo/bar']).toEqual({
      category: 'Test',
      id: 'foo/bar',
      language: null,
      localized_id: 'foo/bar',
      next: 'foo/baz',
      next_id: 'foo/baz',
      next_title: 'baz',
      permalink: '/docs/next/foo/bar',
      sidebar: 'docs',
      source: path.join(docsDir, 'foo/bar.md'),
      title: 'Bar',
      version: 'next',
    });
  });

  test('versioned & translated website', async () => {
    const {
      env,
      siteDir,
      siteConfig,
      translatedDir,
      versionedDir,
    } = await loadSetup('transversioned');
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const plugin = new DocusaurusPluginContentDocs(
      {
        path: '../docs',
        sidebarPath,
      },
      {
        env,
        siteDir,
        siteConfig,
      },
    );
    const {docs: docsMetadata} = await plugin.loadContent();
    const docsDir = plugin.contentPath;

    expect(docsMetadata['ko-version-1.0.0-foo/bar']).toEqual({
      category: 'Test',
      id: 'ko-version-1.0.0-foo/bar',
      language: 'ko',
      localized_id: 'version-1.0.0-foo/bar',
      next: 'ko-version-1.0.0-foo/baz',
      next_id: 'version-1.0.0-foo/baz',
      next_title: 'baz',
      permalink: '/docs/ko/1.0.0/foo/bar',
      sidebar: 'version-1.0.0-docs',
      source: path.join(translatedDir, '/ko/version-1.0.0/foo/bar.md'),
      title: 'Bar',
      version: '1.0.0',
    });
    expect(docsMetadata['en-version-1.0.0-foo/baz']).toEqual({
      category: 'Test',
      id: 'en-version-1.0.0-foo/baz',
      language: 'en',
      localized_id: 'version-1.0.0-foo/baz',
      next: 'en-version-1.0.0-hello',
      next_id: 'version-1.0.0-hello',
      next_title: 'Hello, World !',
      permalink: '/docs/en/1.0.0/foo/baz',
      previous: 'en-version-1.0.0-foo/bar',
      previous_id: 'version-1.0.0-foo/bar',
      previous_title: 'Bar',
      sidebar: 'version-1.0.0-docs',
      source: path.join(versionedDir, 'version-1.0.0/foo/baz.md'),
      title: 'Baz',
      version: '1.0.0',
    });
    expect(docsMetadata['en-hello']).toEqual({
      category: 'Guides',
      id: 'en-hello',
      language: 'en',
      localized_id: 'hello',
      permalink: '/docs/en/next/hello',
      previous: 'en-foo/baz',
      previous_id: 'foo/baz',
      previous_title: 'baz',
      sidebar: 'docs',
      source: path.join(docsDir, 'hello.md'),
      title: 'Hello, World !',
      version: 'next',
    });
  });

  test('translated website', async () => {
    const {env, siteDir, siteConfig, translatedDir} = await loadSetup(
      'translated',
    );
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const plugin = new DocusaurusPluginContentDocs(
      {
        path: '../docs',
        sidebarPath,
      },
      {
        env,
        siteDir,
        siteConfig,
      },
    );
    const {docs: docsMetadata} = await plugin.loadContent();
    const docsDir = plugin.contentPath;

    expect(docsMetadata['ko-foo/baz']).toEqual({
      category: 'Test',
      id: 'ko-foo/baz',
      language: 'ko',
      localized_id: 'foo/baz',
      next: 'ko-hello',
      next_id: 'hello',
      next_title: 'Hello, World !',
      permalink: '/docs/ko/foo/baz',
      previous: 'ko-foo/bar',
      previous_id: 'foo/bar',
      previous_title: 'Bar',
      sidebar: 'docs',
      source: path.join(translatedDir, 'ko', 'foo', 'baz.md'),
      title: 'baz',
      version: null,
    });
    expect(docsMetadata['en-foo/bar']).toEqual({
      category: 'Test',
      id: 'en-foo/bar',
      language: 'en',
      localized_id: 'foo/bar',
      next: 'en-foo/baz',
      next_id: 'foo/baz',
      next_title: 'baz',
      permalink: '/docs/en/foo/bar',
      sidebar: 'docs',
      source: path.join(docsDir, 'foo', 'bar.md'),
      title: 'Bar',
      version: null,
    });
  });

  test('versioned website with skip next release', async () => {
    const {env, siteDir, siteConfig, versionedDir} = await loadSetup(
      'versioned',
    );
    const sidebarPath = path.join(siteDir, 'sidebars.json');
    const plugin = new DocusaurusPluginContentDocs(
      {
        path: '../docs',
        sidebarPath,
        skipNextRelease: true,
      },
      {
        env,
        siteDir,
        siteConfig,
      },
    );
    const {docs: docsMetadata} = await plugin.loadContent();

    expect(docsMetadata['version-1.0.0-foo/bar']).toEqual({
      category: 'Test',
      id: 'version-1.0.0-foo/bar',
      language: null,
      localized_id: 'version-1.0.0-foo/bar',
      next: 'version-1.0.0-foo/baz',
      next_id: 'version-1.0.0-foo/baz',
      next_title: 'Baz',
      permalink: '/docs/1.0.0/foo/bar',
      sidebar: 'version-1.0.0-docs',
      source: path.join(versionedDir, 'version-1.0.0/foo/bar.md'),
      title: 'Bar',
      version: '1.0.0',
    });
    expect(docsMetadata['foo/bar']).toBeUndefined();
  });
});
