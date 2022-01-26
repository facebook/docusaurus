/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {loadContext} from '@docusaurus/core/lib/server';

import pluginContentPages from '../index';
import {PluginOptionSchema} from '../pluginOptionSchema';

describe('docusaurus-plugin-content-pages', () => {
  test('simple pages', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const context = await loadContext(siteDir);
    const pluginPath = 'src/pages';
    const plugin = await pluginContentPages(
      context,
      PluginOptionSchema.validate({
        path: pluginPath,
      }).value,
    );
    const pagesMetadata = await plugin.loadContent?.();

    expect(pagesMetadata).toEqual([
      {
        type: 'jsx',
        permalink: '/',
        source: path.posix.join('@site', pluginPath, 'index.js'),
      },
      {
        type: 'jsx',
        permalink: '/typescript',
        source: path.posix.join('@site', pluginPath, 'typescript.tsx'),
      },
      {
        type: 'mdx',
        permalink: '/hello/',
        source: path.posix.join('@site', pluginPath, 'hello', 'index.md'),
        description: 'Markdown index page',
        frontMatter: {},
        title: 'Index',
      },
      {
        type: 'mdx',
        permalink: '/hello/mdxPage',
        source: path.posix.join('@site', pluginPath, 'hello', 'mdxPage.mdx'),
        description: 'my mdx page',
        title: 'mdx page',
        frontMatter: {
          description: 'my mdx page',
          title: 'mdx page',
        },
      },
      {
        type: 'jsx',
        permalink: '/hello/translatedJs',
        source: path.posix.join(
          '@site',
          pluginPath,
          'hello',
          'translatedJs.js',
        ),
      },
      {
        type: 'mdx',
        permalink: '/hello/translatedMd',
        source: path.posix.join(
          '@site',
          pluginPath,
          'hello',
          'translatedMd.md',
        ),
        description: 'translated markdown page',
        frontMatter: {},
        title: undefined,
      },
      {
        type: 'jsx',
        permalink: '/hello/world',
        source: path.posix.join('@site', pluginPath, 'hello', 'world.js'),
      },
    ]);
  });

  test('simple pages with french translations', async () => {
    const siteDir = path.join(__dirname, '__fixtures__', 'website');
    const context = await loadContext(siteDir);
    const pluginPath = 'src/pages';
    const plugin = await pluginContentPages(
      {
        ...context,
        i18n: {
          ...context.i18n,
          currentLocale: 'fr',
        },
      },
      PluginOptionSchema.validate({
        path: pluginPath,
      }).value,
    );
    const pagesMetadata = await plugin.loadContent?.();

    const frTranslationsPath = path.posix.join(
      '@site',
      'i18n',
      'fr',
      'docusaurus-plugin-content-pages',
    );

    expect(pagesMetadata).toEqual([
      {
        type: 'jsx',
        permalink: '/',
        source: path.posix.join('@site', pluginPath, 'index.js'),
      },
      {
        type: 'jsx',
        permalink: '/typescript',
        source: path.posix.join('@site', pluginPath, 'typescript.tsx'),
      },
      {
        type: 'mdx',
        permalink: '/hello/',
        source: path.posix.join('@site', pluginPath, 'hello', 'index.md'),
        description: 'Markdown index page',
        frontMatter: {},
        title: 'Index',
      },
      {
        type: 'mdx',
        permalink: '/hello/mdxPage',
        source: path.posix.join('@site', pluginPath, 'hello', 'mdxPage.mdx'),
        description: 'my mdx page',
        title: 'mdx page',
        frontMatter: {
          description: 'my mdx page',
          title: 'mdx page',
        },
      },
      {
        type: 'jsx',
        permalink: '/hello/translatedJs',
        source: path.posix.join(frTranslationsPath, 'hello', 'translatedJs.js'),
      },
      {
        type: 'mdx',
        permalink: '/hello/translatedMd',
        source: path.posix.join(frTranslationsPath, 'hello', 'translatedMd.md'),
        description: 'translated markdown page (fr)',
        frontMatter: {},
        title: undefined,
      },
      {
        type: 'jsx',
        permalink: '/hello/world',
        source: path.posix.join('@site', pluginPath, 'hello', 'world.js'),
      },
    ]);
  });
});
