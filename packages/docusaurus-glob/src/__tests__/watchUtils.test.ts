/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, it} from 'vitest';
import path from 'node:path';
import {
  createTestWatcher,
  posixPath,
  retry,
  WatchModes,
} from './watchTestUtils';
import type {WatchOptions} from '../watchUtils';

// These tests document the behavior of watch() for all the path patterns that
// Docusaurus core and the ecosystem pass to it (see watch.md).
// They use the real file system: the goal is to detect behavior changes when
// upgrading or swapping the underlying watcher lib (Chokidar).

describe.concurrent.each(WatchModes)('watch() - $name', {retry}, (mode) => {
  const {backend} = mode;
  const isFsEvents = backend === 'fsevents';
  const isWindows = process.platform === 'win32';

  describe('file paths', () => {
    describe('absolute paths', () => {
      // Core: siteConfigPath
      // Ecosystem: redocusaurus spec file, docusaurus-plugin-glossary...
      const files = ['docusaurus.config.js', 'other.js'];
      const paths = ({siteDir}: {siteDir: string}) =>
        path.join(siteDir, 'docusaurus.config.js');

      it('watches file - change', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.change('docusaurus.config.js', 'other.js'),
          ['change docusaurus.config.js'],
        );
        await w.expectEvents(
          () => w.atomicChange('docusaurus.config.js'),
          ['change docusaurus.config.js'],
        );
      });

      it('watches file - remove', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.remove('docusaurus.config.js', 'other.js'),
          ['unlink docusaurus.config.js'],
        );
        await w.expectEvents(
          () => w.add('docusaurus.config.js', 'other.js'),
          ['add docusaurus.config.js'],
        );
      });

      it('watches file - rename', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.rename('docusaurus.config.js', 'renamed.js'),
          ['unlink docusaurus.config.js'],
        );
        await w.expectEvents(
          () => w.rename('renamed.js', 'docusaurus.config.js'),
          ['add docusaurus.config.js'],
        );
      });

      it('watches missing file', async ({expect}) => {
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['glossary/other.json'],
          paths: ({siteDir}) => path.join(siteDir, 'glossary/glossary.json'),
        });
        await w.expectEvents(
          () => w.add('glossary/glossary.json', 'glossary/other2.json'),
          ['add glossary/glossary.json'],
        );
      });

      it('watches missing file in missing dir', async ({expect}) => {
        await using w = await createTestWatcher({
          expect,
          mode,
          paths: ({siteDir}) => path.join(siteDir, 'glossary/glossary.json'),
        });
        await w.expectEvents(
          () => w.add('glossary/glossary.json', 'glossary/other.json'),
          // TODO Chokidar v3 limitation: when the parent dir does not exist,
          //  creating the file is only detected with FSEvents
          isFsEvents ? ['add glossary/glossary.json'] : [],
        );
      });
    });

    describe('relative paths', () => {
      // Core: sidebars.json, blog/authors.yml, docs/tags.yml...
      const files = ['docs/tags.yml', 'docs/other.yml', 'sidebars.json'];
      const paths = () => 'docs/tags.yml';

      it('watches file - change', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.change('docs/tags.yml', 'docs/other.yml', 'sidebars.json'),
          ['change docs/tags.yml'],
        );
        await w.expectEvents(
          () => w.atomicChange('docs/tags.yml'),
          ['change docs/tags.yml'],
        );
      });

      it('watches file - remove', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.remove('docs/tags.yml', 'docs/other.yml', 'sidebars.json'),
          ['unlink docs/tags.yml'],
        );
        await w.expectEvents(
          () => w.add('docs/tags.yml', 'docs/other.yml', 'sidebars.json'),
          ['add docs/tags.yml'],
        );
      });

      it('watches file - rename', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.rename('docs/tags.yml', 'docs/renamed.yml'),
          ['unlink docs/tags.yml'],
        );
        await w.expectEvents(
          () => w.rename('docs/renamed.yml', 'docs/tags.yml'),
          ['add docs/tags.yml'],
        );
      });

      it('watches file - remove parent dir', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        // TODO Chokidar v3 inconsistency: FSEvents may not report it, and
        //  "unlinkDir" is not always emitted
        await w.expectEvents(
          () => w.remove('docs'),
          isFsEvents ? [] : ['unlink docs/tags.yml'],
          {optional: ['unlink docs/tags.yml', 'unlinkDir docs']},
        );
        // TODO Chokidar v3 limitation: once the parent dir is removed,
        //  re-creating the file is only detected with FSEvents
        //  FSEvents may report it as "add" or "change"
        await w.expectEvents(() => w.add('docs/tags.yml'), [], {
          optional: isFsEvents
            ? ['add docs/tags.yml', 'change docs/tags.yml']
            : [],
        });
      });

      it('watches missing file', async ({expect}) => {
        // Core: docs/tags.yml is watched even if it doesn't exist yet
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['docs/intro.md'],
          paths: () => ['docs/tags.yml'],
        });
        await w.expectEvents(
          () => w.add('docs/tags.yml', 'docs/other.yml'),
          ['add docs/tags.yml'],
        );
      });

      it('watches missing file in missing dir', async ({expect}) => {
        await using w = await createTestWatcher({
          expect,
          mode,
          paths: () => ['blog/authors.yml'],
        });
        await w.expectEvents(
          () => w.add('blog/authors.yml', 'blog/other.yml'),
          // TODO Chokidar v3 limitation: when the parent dir does not exist,
          //  creating the file is only detected with FSEvents
          isFsEvents ? ['add blog/authors.yml'] : [],
        );
      });

      it('watches file outside siteDir', async ({expect}) => {
        // Ecosystem: absolute plugin paths are made relative to siteDir
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['../api/openapi.yaml', '../api/other.yaml'],
          paths: () => ['../api/openapi.yaml'],
        });
        await w.expectEvents(
          () => w.change('../api/openapi.yaml', '../api/other.yaml'),
          ['change ../api/openapi.yaml'],
        );
        await w.expectEvents(
          () => w.rename('../api/openapi.yaml', '../api/renamed.yaml'),
          ['unlink ../api/openapi.yaml'],
        );
      });

      it('watches file in node_modules', async ({expect}) => {
        // Ecosystem: @easyops-cn/docusaurus-search-local watches its own
        // theme component file, that is usually inside node_modules
        await using w = await createTestWatcher({
          expect,
          mode,
          files: [
            'node_modules/search/theme/SearchPage/index.js',
            'node_modules/search/theme/SearchBar/index.js',
          ],
          paths: () => ['node_modules/search/theme/SearchPage/index.js'],
        });
        await w.expectEvents(
          () =>
            w.change(
              'node_modules/search/theme/SearchPage/index.js',
              'node_modules/search/theme/SearchBar/index.js',
            ),
          ['change node_modules/search/theme/SearchPage/index.js'],
        );
      });
    });
  });

  describe('directory paths', () => {
    describe('absolute paths', () => {
      // Core: localizationDir
      // Ecosystem: docusaurus-plugin-openapi (spec dir)...
      const files = [
        'i18n/fr/code.json',
        'i18n/fr/docs/intro.md',
        'i18n/fr/docs/other.md',
        'outside/de/code.json',
      ];
      const paths = ({siteDir}: {siteDir: string}) =>
        path.join(siteDir, 'i18n');

      it('watches dir recursively - add / change', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.change('i18n/fr/code.json', 'outside/de/code.json'),
          ['change i18n/fr/code.json'],
        );
        // The atomic write temp file is in the watched dir: its events may be
        // emitted (seen on Linux and Windows)
        await w.expectEvents(
          () => w.atomicChange('i18n/fr/docs/intro.md'),
          ['change i18n/fr/docs/intro.md'],
          {
            optional: [
              'add i18n/fr/docs/intro.md.tmp',
              'change i18n/fr/docs/intro.md.tmp',
              'unlink i18n/fr/docs/intro.md.tmp',
            ],
          },
        );
        await w.expectEvents(
          () => w.add('i18n/de/deep/code.json', 'i18n/x.md', 'x.md'),
          [
            'addDir i18n/de',
            'addDir i18n/de/deep',
            'add i18n/de/deep/code.json',
            'add i18n/x.md',
          ],
        );
      });

      it('watches dir recursively - remove', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.remove('i18n/fr/code.json', 'outside/de/code.json'),
          ['unlink i18n/fr/code.json'],
        );
        await w.expectEvents(
          () => w.remove('i18n/fr/docs'),
          [
            'unlink i18n/fr/docs/intro.md',
            'unlink i18n/fr/docs/other.md',
            'unlinkDir i18n/fr/docs',
          ],
        );
      });

      it('watches dir recursively - rename', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.rename('i18n/fr/code.json', 'i18n/fr/renamed.json'),
          ['unlink i18n/fr/code.json', 'add i18n/fr/renamed.json'],
        );
        await w.expectEvents(
          () => w.rename('i18n/fr/docs', 'i18n/fr/docs2'),
          [
            'unlink i18n/fr/docs/intro.md',
            'unlink i18n/fr/docs/other.md',
            'unlinkDir i18n/fr/docs',
            'addDir i18n/fr/docs2',
            'add i18n/fr/docs2/intro.md',
            'add i18n/fr/docs2/other.md',
          ],
        );
        await w.expectEvents(
          () => w.rename('i18n/fr/docs2', 'outside/docs2'),
          [
            'unlink i18n/fr/docs2/intro.md',
            'unlink i18n/fr/docs2/other.md',
            'unlinkDir i18n/fr/docs2',
          ],
        );
        await w.expectEvents(
          () => w.rename('outside/de', 'i18n/de'),
          ['addDir i18n/de', 'add i18n/de/code.json'],
        );
      });

      it('watches dir - remove and re-create', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        // Linux does not always emit "unlinkDir" for the watched dir
        await w.expectEvents(
          () => w.remove('i18n'),
          [
            'unlink i18n/fr/code.json',
            'unlink i18n/fr/docs/intro.md',
            'unlink i18n/fr/docs/other.md',
            ...(backend === 'linux' ? [] : ['unlinkDir i18n']),
            'unlinkDir i18n/fr',
            'unlinkDir i18n/fr/docs',
          ],
          {optional: ['unlinkDir i18n']},
        );
        // TODO Chokidar v3 limitation: once the watched dir is removed,
        //  re-creating it is only detected with FSEvents and on Windows
        function getRecreateEvents(): string[] {
          if (isFsEvents) {
            return ['addDir i18n', 'addDir i18n/it', 'add i18n/it/code.json'];
          }
          if (isWindows) {
            return ['addDir i18n/it', 'add i18n/it/code.json'];
          }
          return [];
        }
        await w.expectEvents(
          () => w.add('i18n/it/code.json'),
          getRecreateEvents(),
          {optional: isWindows ? ['addDir i18n'] : []},
        );
      });

      it('watches missing dir', async ({expect}) => {
        // Core: localizationDir does not exist for most sites
        await using w = await createTestWatcher({expect, mode, paths});
        await w.expectEvents(
          () => w.add('i18n/fr/code.json', 'other/code.json'),
          ['addDir i18n', 'addDir i18n/fr', 'add i18n/fr/code.json'],
        );
      });
    });

    describe('relative paths', () => {
      const files = ['api/spec.yaml', 'api/v1/spec.yaml', 'other/spec.yaml'];
      const paths = () => ['api'];

      it('watches dir recursively - add / change', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.change('api/spec.yaml', 'other/spec.yaml'),
          ['change api/spec.yaml'],
        );
        await w.expectEvents(
          () => w.add('api/v2/spec.yaml'),
          ['addDir api/v2', 'add api/v2/spec.yaml'],
        );
      });

      it('watches dir recursively - remove / rename', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.rename('api/v1', 'api/v2'),
          [
            'unlink api/v1/spec.yaml',
            'unlinkDir api/v1',
            'addDir api/v2',
            'add api/v2/spec.yaml',
          ],
        );
        await w.expectEvents(
          () => w.remove('api/spec.yaml', 'other/spec.yaml'),
          ['unlink api/spec.yaml'],
        );
      });
    });
  });

  describe('glob patterns', () => {
    describe('relative globs', () => {
      // Core: docs/blog/pages plugins "include" option
      const files = [
        'docs/a.md',
        'docs/b.mdx',
        'docs/c.txt',
        'docs/sub/d.md',
        'docs/sub/e.js',
        'other/sub/f.md',
      ];
      const paths = () => ['docs/**/*.{md,mdx}'];

      it('watches docs/**/*.{md,mdx} - add', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () =>
            w.add(
              'docs/new.md',
              'docs/new.mdx',
              'docs/new-dir/deep/new.mdx',
              // The "exclude" option is not applied to watched paths
              'docs/_partial.md',
              'docs/_dir/partial.md',
              'docs/.dotfile.md',
              'docs/.hidden/file.md',
              // Not matched
              'docs/new.txt',
              'docs/new.md.bak',
              'docs/new-dir2/file.js',
              'other/new.md',
              'docs.md',
            ),
          [
            'add docs/new.md',
            'add docs/new.mdx',
            'add docs/new-dir/deep/new.mdx',
            'add docs/_partial.md',
            'add docs/_dir/partial.md',
            'add docs/.dotfile.md',
            'add docs/.hidden/file.md',
          ],
        );
      });

      it('watches docs/**/*.{md,mdx} - change', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () =>
            w.change(
              'docs/a.md',
              'docs/b.mdx',
              'docs/c.txt',
              'docs/sub/d.md',
              'docs/sub/e.js',
              'other/sub/f.md',
            ),
          ['change docs/a.md', 'change docs/b.mdx', 'change docs/sub/d.md'],
        );
        await w.expectEvents(
          () => w.atomicChange('docs/sub/d.md'),
          ['change docs/sub/d.md'],
        );
      });

      it('watches docs/**/*.{md,mdx} - remove', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.remove('docs/a.md', 'docs/c.txt', 'other/sub/f.md'),
          ['unlink docs/a.md'],
        );
        await w.expectEvents(
          () => w.remove('docs/sub'),
          [
            'unlink docs/sub/d.md',
            // TODO Chokidar v3 inconsistency: unlinkDir not emitted by FSEvents
            ...(isFsEvents ? [] : ['unlinkDir docs/sub']),
          ],
        );
      });

      it('watches docs/**/*.{md,mdx} - rename files', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        await w.expectEvents(
          () => w.rename('docs/a.md', 'docs/sub/a2.md'),
          ['unlink docs/a.md', 'add docs/sub/a2.md'],
        );
        await w.expectEvents(
          () => w.rename('docs/b.mdx', 'docs/b.txt'),
          ['unlink docs/b.mdx'],
        );
        await w.expectEvents(
          () => w.rename('docs/c.txt', 'docs/c.md'),
          ['add docs/c.md'],
        );
        await w.expectEvents(
          () => w.rename('other/sub/f.md', 'docs/f.md'),
          ['add docs/f.md'],
        );
      });

      it('watches docs/**/*.{md,mdx} - rename dirs', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        // TODO Chokidar v3 limitation: dir renames are not reported by FSEvents
        //  Linux and Windows don't reliably report files of the old dir
        const oldDirEvents = ['unlink docs/sub/d.md', 'unlinkDir docs/sub'];
        const renameEvents = {
          fsevents: [],
          linux: ['add docs/sub2/d.md'],
          windows: ['add docs/sub2/d.md'],
          polling: [...oldDirEvents, 'add docs/sub2/d.md'],
        };
        await w.expectEvents(
          () => w.rename('docs/sub', 'docs/sub2'),
          renameEvents[backend],
          {optional: oldDirEvents},
        );
        await w.expectEvents(
          () => w.rename('other/sub', 'docs/moved-in'),
          isFsEvents ? [] : ['add docs/moved-in/f.md'],
        );
      });

      it('watches docs/**/*.{md,mdx} - remove base dir', async ({expect}) => {
        await using w = await createTestWatcher({expect, mode, files, paths});
        const unlinkEvents = [
          'unlink docs/a.md',
          'unlink docs/b.mdx',
          'unlink docs/sub/d.md',
          'unlinkDir docs',
          'unlinkDir docs/sub',
        ];
        // TODO Chokidar v3 limitation: FSEvents may not report it
        await w.expectEvents(
          () => w.remove('docs'),
          isFsEvents ? [] : unlinkEvents,
          {optional: unlinkEvents},
        );
        // TODO Chokidar v3 limitation: once the glob base dir is removed,
        //  re-creating files is not detected on Linux
        //  FSEvents may report re-created files as "change"
        const recreateEvents = {
          fsevents: ['add docs/new/b.md'],
          linux: [],
          windows: ['add docs/a.md', 'add docs/new/b.md'],
          polling: ['add docs/a.md', 'add docs/new/b.md'],
        };
        await w.expectEvents(
          () => w.add('docs/a.md', 'docs/new/b.md'),
          recreateEvents[backend],
          {
            optional: isFsEvents ? ['add docs/a.md', 'change docs/a.md'] : [],
          },
        );
      });

      it('watches src/pages/**/*.{js,jsx,ts,tsx,md,mdx}', async ({expect}) => {
        // Core: pages plugin default "include" option
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['src/pages/index.tsx', 'src/pages/styles.module.css'],
          paths: () => ['src/pages/**/*.{js,jsx,ts,tsx,md,mdx}'],
        });
        await w.expectEvents(
          () => w.change('src/pages/index.tsx', 'src/pages/styles.module.css'),
          ['change src/pages/index.tsx'],
        );
        await w.expectEvents(
          () =>
            w.add(
              'src/pages/a.js',
              'src/pages/b.jsx',
              'src/pages/c.ts',
              'src/pages/sub/d.tsx',
              'src/pages/sub/e.md',
              'src/pages/sub/f.mdx',
              'src/pages/g.css',
              'src/components/h.tsx',
            ),
          [
            'add src/pages/a.js',
            'add src/pages/b.jsx',
            'add src/pages/c.ts',
            'add src/pages/sub/d.tsx',
            'add src/pages/sub/e.md',
            'add src/pages/sub/f.mdx',
          ],
        );
      });

      it('watches docs/**/_category_.{json,yml,yaml}', async ({expect}) => {
        // Core: docs plugin category metadata files
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['docs/sub/_category_.json', 'docs/a.md'],
          paths: () => ['docs/**/_category_.{json,yml,yaml}'],
        });
        await w.expectEvents(
          () => w.change('docs/sub/_category_.json', 'docs/a.md'),
          ['change docs/sub/_category_.json'],
        );
        await w.expectEvents(
          () =>
            w.add(
              'docs/_category_.yml',
              'docs/new/_category_.yaml',
              'docs/new/_category_.js',
              'docs/new/category.yml',
            ),
          ['add docs/_category_.yml', 'add docs/new/_category_.yaml'],
        );
        await w.expectEvents(
          () => w.remove('docs/sub/_category_.json'),
          ['unlink docs/sub/_category_.json'],
        );
      });

      it('watches docs/*.md', async ({expect}) => {
        // Users can customize the plugins "include" option
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['docs/a.md', 'docs/sub/b.md'],
          paths: () => ['docs/*.md'],
        });
        await w.expectEvents(
          () => w.change('docs/a.md', 'docs/sub/b.md'),
          ['change docs/a.md'],
        );
        await w.expectEvents(
          () => w.add('docs/c.md', 'docs/sub/d.md', 'docs/e.mdx'),
          ['add docs/c.md'],
        );
      });

      it('watches other "include" glob syntaxes', async ({expect}) => {
        // Users can customize the plugins "include" option
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['docs/a.md', 'docs/sub/index.md'],
          paths: () => [
            'docs/**/index.md',
            'docs/**/*.markdown',
            'docs/**/[0-9]*.md',
            'docs/**/@(foo|bar).md',
          ],
        });
        await w.expectEvents(
          () => w.change('docs/a.md', 'docs/sub/index.md'),
          ['change docs/sub/index.md'],
        );
        await w.expectEvents(
          () =>
            w.add(
              'docs/new/index.md',
              'docs/new/x.markdown',
              'docs/new/1-x.md',
              'docs/new/foo.md',
              'docs/new/bar.md',
              'docs/new/baz.md',
            ),
          [
            'add docs/new/index.md',
            'add docs/new/x.markdown',
            'add docs/new/1-x.md',
            'add docs/new/foo.md',
            'add docs/new/bar.md',
          ],
        );
      });

      it('watches glob with missing base dir', async ({expect}) => {
        // Core: localized content, i18n/<locale>/<plugin>/**/*.{md,mdx}
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['docs/a.md'],
          paths: () => [
            'i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}',
          ],
        });
        await w.expectEvents(
          () =>
            w.add(
              'i18n/fr/docusaurus-plugin-content-docs/current/a.md',
              'i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
            ),
          // TODO Chokidar v3 limitation: when the glob base dir does not
          //  exist, creating files is only detected with FSEvents
          isFsEvents
            ? [
                'add i18n/fr/docusaurus-plugin-content-docs/current/a.md',
                'add i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
              ]
            : [],
        );
      });

      it('watches glob with missing base dir, existing parent', async ({
        expect,
      }) => {
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['i18n/fr/docusaurus-plugin-content-docs/current.json'],
          paths: () => [
            'i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}',
          ],
        });
        await w.expectEvents(
          () =>
            w.add(
              'i18n/fr/docusaurus-plugin-content-docs/current/a.md',
              'i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
            ),
          // TODO Chokidar v3 limitation: when the glob base dir does not
          //  exist, creating files is only detected with FSEvents
          isFsEvents
            ? [
                'add i18n/fr/docusaurus-plugin-content-docs/current/a.md',
                'add i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
              ]
            : [],
        );
      });

      it('watches glob with existing empty base dir', async ({expect}) => {
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['i18n/fr/docusaurus-plugin-content-docs/current/sub/x.json'],
          paths: () => [
            'i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}',
          ],
        });
        await w.expectEvents(
          () =>
            w.add(
              'i18n/fr/docusaurus-plugin-content-docs/current/a.md',
              'i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
              'i18n/fr/docusaurus-plugin-content-docs/current/sub2/c.md',
            ),
          [
            'add i18n/fr/docusaurus-plugin-content-docs/current/a.md',
            'add i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
            'add i18n/fr/docusaurus-plugin-content-docs/current/sub2/c.md',
          ],
        );
      });
    });

    describe('absolute globs', () => {
      it('watches absolute glob', async ({expect}) => {
        // Ecosystem: @aldridged/docusaurus-plugin-lunr...
        // Note: core makes absolute plugin paths relative to siteDir
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['docs/a.md', 'docs/b.md', 'docs/sub/c.md'],
          paths: ({siteDir}) => [`${posixPath(siteDir)}/docs/**/*.{md,mdx}`],
        });
        await w.expectEvents(() => w.change('docs/a.md'), ['change docs/a.md']);
        await w.expectEvents(
          () => w.add('docs/sub/d.md', 'docs/e.js'),
          ['add docs/sub/d.md'],
        );
        await w.expectEvents(
          () => w.rename('docs/b.md', 'docs/b2.md'),
          ['unlink docs/b.md', 'add docs/b2.md'],
        );
        await w.expectEvents(
          () => w.remove('docs/sub/c.md'),
          ['unlink docs/sub/c.md'],
        );
      });
    });

    describe('globs outside siteDir', () => {
      it('watches glob outside siteDir', async ({expect}) => {
        // Core: docs plugin with path: '../docs' (monorepo setups)
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['../docs/a.md', '../docs/b.md', '../docs/sub/c.md'],
          paths: () => ['../docs/**/*.{md,mdx}'],
        });
        await w.expectEvents(
          () => w.change('../docs/a.md'),
          ['change ../docs/a.md'],
        );
        await w.expectEvents(
          () => w.add('../docs/sub/d.md', '../docs/d.js', 'e.md'),
          ['add ../docs/sub/d.md'],
        );
        await w.expectEvents(
          () => w.rename('../docs/b.md', '../docs/b2.md'),
          ['unlink ../docs/b.md', 'add ../docs/b2.md'],
        );
        await w.expectEvents(
          () => w.remove('../docs/a.md'),
          ['unlink ../docs/a.md'],
        );
      });

      it('watches glob outside siteDir - rename dir', async ({expect}) => {
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['../docs/sub/a.md'],
          paths: () => ['../docs/**/*.{md,mdx}'],
        });
        // TODO Chokidar v3 limitation: dir renames not reported by FSEvents
        //  Linux and Windows don't reliably report files of the old dir
        const oldDirEvents = [
          'unlink ../docs/sub/a.md',
          'unlinkDir ../docs/sub',
        ];
        await w.expectEvents(
          () => w.rename('../docs/sub', '../docs/sub2'),
          isFsEvents
            ? []
            : [
                ...(backend === 'polling' ? oldDirEvents : []),
                'add ../docs/sub2/a.md',
              ],
          {optional: oldDirEvents},
        );
      });

      it('watches glob outside siteDir - many extensions', async ({expect}) => {
        // Ecosystem: @vantagecompute/docusaurus-theme watches its theme dir
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['../theme/src/theme/Navbar/index.tsx'],
          paths: () => ['../theme/src/theme/**/*.{js,jsx,ts,tsx,css}'],
        });
        await w.expectEvents(
          () => w.change('../theme/src/theme/Navbar/index.tsx'),
          ['change ../theme/src/theme/Navbar/index.tsx'],
        );
        await w.expectEvents(
          () =>
            w.add(
              '../theme/src/theme/Navbar/styles.css',
              '../theme/src/theme/Footer/index.js',
              '../theme/src/theme/Footer/README.md',
              '../theme/src/other.js',
            ),
          [
            'add ../theme/src/theme/Navbar/styles.css',
            'add ../theme/src/theme/Footer/index.js',
          ],
        );
      });

      it('watches glob outside siteDir - missing base dir', async ({
        expect,
      }) => {
        await using w = await createTestWatcher({
          expect,
          mode,
          paths: () => ['../docs/**/*.{md,mdx}'],
        });
        await w.expectEvents(
          () => w.add('../docs/a.md', '../docs/sub/b.md'),
          // TODO Chokidar v3 limitation: when the glob base dir does not
          //  exist, creating files is only detected with FSEvents
          isFsEvents ? ['add ../docs/a.md', 'add ../docs/sub/b.md'] : [],
        );
      });
    });

    describe('negated globs', () => {
      it('ignores negated relative globs', async ({expect}) => {
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['docs/a.md', 'docs/_b.md', 'docs/_dir/c.md'],
          paths: () => ['docs/**/*.md', '!docs/**/_*.md'],
        });
        await w.expectEvents(
          () => w.change('docs/a.md', 'docs/_b.md', 'docs/_dir/c.md'),
          ['change docs/a.md', 'change docs/_dir/c.md'],
        );
        await w.expectEvents(
          () => w.add('docs/d.md', 'docs/_e.md'),
          ['add docs/d.md'],
        );
      });

      it('ignores negated absolute globs without cwd', async ({expect}) => {
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['arch/a.dsl', 'arch/include.b.dsl'],
          paths: ({siteDir}) => [
            `${posixPath(siteDir)}/arch/**/*.dsl`,
            `!${posixPath(siteDir)}/**/include.*.dsl`,
          ],
          options: () => ({cwd: undefined}),
        });
        await w.expectEvents(
          () => w.change('arch/a.dsl', 'arch/include.b.dsl'),
          [`change ${posixPath(path.join(w.siteDir, 'arch/a.dsl'))}`],
          {
            // TODO Chokidar v3 inconsistency: on Windows, the negated glob
            //  does not reliably ignore the file (in native and polling modes)
            optional: isWindows
              ? [
                  `change ${posixPath(path.join(w.siteDir, 'arch/include.b.dsl'))}`,
                ]
              : [],
          },
        );
      });

      it('does not ignore negated absolute globs with cwd', async ({
        expect,
      }) => {
        // Ecosystem: docusaurus-plugin-structurizr
        // Note: core does not make negated absolute paths relative to siteDir
        // TODO Chokidar v3 bug: with the "cwd" option, negated absolute globs
        //  are resolved against cwd ("!<cwd>/<abs>") and have no effect
        await using w = await createTestWatcher({
          expect,
          mode,
          files: ['arch/a.dsl', 'arch/include.b.dsl'],
          paths: ({siteDir}) => [
            'arch/**/*.dsl',
            `!${posixPath(siteDir)}/**/include.*.dsl`,
          ],
        });
        await w.expectEvents(
          () => w.change('arch/a.dsl', 'arch/include.b.dsl'),
          ['change arch/a.dsl', 'change arch/include.b.dsl'],
        );
        await w.expectEvents(
          () => w.add('arch/sub/c.dsl', 'arch/sub/include.d.dsl'),
          ['add arch/sub/c.dsl', 'add arch/sub/include.d.dsl'],
        );
      });
    });
  });

  describe('multiple paths', () => {
    it('watches overlapping paths', async ({expect}) => {
      await using w = await createTestWatcher({
        expect,
        mode,
        files: ['docs/a.md', 'docs/tags.yml'],
        paths: () => [
          'docs/**/*.{md,mdx}',
          'docs/**/*.md',
          'docs/tags.yml',
          'docs',
        ],
      });
      await w.expectEvents(
        () => w.change('docs/a.md', 'docs/tags.yml'),
        ['change docs/a.md', 'change docs/tags.yml'],
      );
      await w.expectEvents(() => w.add('docs/b.js'), ['add docs/b.js']);
      await w.expectEvents(() => w.remove('docs/a.md'), ['unlink docs/a.md']);
    });

    it('watches site paths - re-create file', async ({expect}) => {
      // Core: site watcher [siteConfigPath, localizationDir]
      await using w = await createTestWatcher({
        expect,
        mode,
        files: ['docusaurus.config.js', 'i18n/fr/code.json'],
        paths: ({siteDir}) => [
          path.join(siteDir, 'docusaurus.config.js'),
          path.join(siteDir, 'i18n'),
        ],
      });
      await w.expectEvents(
        () => w.remove('docusaurus.config.js'),
        ['unlink docusaurus.config.js'],
      );
      await w.expectEvents(
        () => w.add('docusaurus.config.js'),
        // TODO Chokidar v3 bug: when watching multiple paths, re-creating a
        //  removed file path is only detected with FSEvents
        isFsEvents ? ['add docusaurus.config.js'] : [],
      );
    });

    it('watches file and glob paths - re-create file', async ({expect}) => {
      // Core: docs plugin [sidebarPath, 'docs/**/*.{md,mdx}', ...]
      await using w = await createTestWatcher({
        expect,
        mode,
        files: ['sidebars.js', 'docs/a.md'],
        paths: () => ['sidebars.js', 'docs/**/*.{md,mdx}'],
      });
      await w.expectEvents(
        () => w.rename('sidebars.js', 'sidebars.js.bak'),
        ['unlink sidebars.js'],
      );
      await w.expectEvents(
        () => w.rename('sidebars.js.bak', 'sidebars.js'),
        // TODO Chokidar v3 bug: when watching multiple paths, re-creating a
        //  removed file path is only detected with FSEvents
        isFsEvents ? ['add sidebars.js'] : [],
      );
      // Files matched by globs are not affected
      await w.expectEvents(() => w.remove('docs/a.md'), ['unlink docs/a.md']);
      await w.expectEvents(() => w.add('docs/a.md'), ['add docs/a.md']);
    });

    it('watches docs plugin paths', async ({expect}) => {
      // Core: docs plugin getPathsToWatch() with i18n and versions
      await using w = await createTestWatcher({
        expect,
        mode,
        files: [
          'sidebars.js',
          'docs/intro.md',
          'docs/tags.yml',
          'docs/category/_category_.json',
          'i18n/fr/docusaurus-plugin-content-docs/current/intro.md',
          'versioned_sidebars/version-1.0.0-sidebars.json',
          'versioned_docs/version-1.0.0/intro.md',
        ],
        paths: () => [
          'sidebars.js',
          'i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}',
          'docs/**/*.{md,mdx}',
          'i18n/fr/docusaurus-plugin-content-docs/current/tags.yml',
          'docs/tags.yml',
          'docs/**/_category_.{json,yml,yaml}',
          'versioned_sidebars/version-1.0.0-sidebars.json',
          'i18n/fr/docusaurus-plugin-content-docs/version-1.0.0/**/*.{md,mdx}',
          'versioned_docs/version-1.0.0/**/*.{md,mdx}',
          'i18n/fr/docusaurus-plugin-content-docs/version-1.0.0/tags.yml',
          'versioned_docs/version-1.0.0/tags.yml',
          'versioned_docs/version-1.0.0/**/_category_.{json,yml,yaml}',
        ],
      });
      await w.expectEvents(
        () =>
          w.change(
            'sidebars.js',
            'docs/intro.md',
            'docs/tags.yml',
            'docs/category/_category_.json',
            'i18n/fr/docusaurus-plugin-content-docs/current/intro.md',
            'versioned_sidebars/version-1.0.0-sidebars.json',
            'versioned_docs/version-1.0.0/intro.md',
          ),
        [
          'change sidebars.js',
          'change docs/intro.md',
          'change docs/tags.yml',
          'change docs/category/_category_.json',
          'change i18n/fr/docusaurus-plugin-content-docs/current/intro.md',
          'change versioned_sidebars/version-1.0.0-sidebars.json',
          'change versioned_docs/version-1.0.0/intro.md',
        ],
      );
      await w.expectEvents(
        () =>
          w.add(
            'i18n/fr/docusaurus-plugin-content-docs/current/tags.yml',
            'versioned_docs/version-1.0.0/tags.yml',
            'versioned_docs/version-1.0.0/_category_.yml',
            'docs/intro.js',
            'versioned_docs/version-1.0.0/intro.js',
          ),
        [
          'add i18n/fr/docusaurus-plugin-content-docs/current/tags.yml',
          'add versioned_docs/version-1.0.0/tags.yml',
          'add versioned_docs/version-1.0.0/_category_.yml',
        ],
      );
      await w.expectEvents(
        () =>
          w.remove(
            'docs/intro.md',
            'i18n/fr/docusaurus-plugin-content-docs/current/intro.md',
          ),
        [
          'unlink docs/intro.md',
          'unlink i18n/fr/docusaurus-plugin-content-docs/current/intro.md',
        ],
      );
    });
  });

  describe('options', () => {
    it('emits absolute paths without cwd option', async ({expect}) => {
      await using w = await createTestWatcher({
        expect,
        mode,
        files: ['docs/a.md'],
        paths: ({siteDir}) => [path.join(siteDir, 'docs/**/*.md')],
        options: () => ({cwd: undefined}),
      });
      await w.expectEvents(
        () => w.change('docs/a.md'),
        [`change ${posixPath(path.join(w.siteDir, 'docs/a.md'))}`],
      );
    });

    it('does not emit events for existing files', async ({expect}) => {
      await using w = await createTestWatcher({
        expect,
        mode,
        files: ['docs/a.md', 'docs/sub/b.mdx', 'sidebars.js'],
        paths: () => ['docs/**/*.{md,mdx}', 'sidebars.js', 'docs'],
        // ignoreInitial: true is hardcoded, even if the lib option is passed
        options: () => ({ignoreInitial: false}) as WatchOptions,
      });
      expect(w.initialEvents).toEqual([]);
    });
  });
});
