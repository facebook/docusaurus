/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, it, type ExpectStatic} from 'vitest';
import path from 'node:path';
import fs from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {watch, type WatchOptions} from '../watchUtils';

// These tests document the behavior of watch() for all the path patterns that
// Docusaurus core and the ecosystem pass to it (see README.md).
// They use the real file system: the goal is to detect behavior changes when
// upgrading or swapping the underlying watcher lib (Chokidar).
//
// Events are asserted as a sorted, deduplicated list of "<event> <path>"
// strings. In practice, Docusaurus reloads on any event, so what matters most
// is which file system changes trigger at least one event.
// Creating a file may randomly emit "add" + "change" (FSEvents, Windows...),
// so we ignore "change" events of files that were added during the same run.

function posixPath(p: string): string {
  return p.replaceAll('\\', '/');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type TestDirs = {
  /** Temp dir, parent of siteDir, to test paths outside of the site */
  rootDir: string;
  /** Site dir, used as the watcher "cwd" by default */
  siteDir: string;
};

type WatchMode = {
  name: string;
  options: WatchOptions;
  /**
   * Chokidar v3 uses macOS FSEvents by default. It behaves differently from
   * the Node.js fs.watch() and fs.watchFile() (polling) based implementations.
   * Chokidar v4+ removed FSEvents support.
   */
  isFsEvents: boolean;
};

const WatchModes: WatchMode[] = [
  {
    name: 'native',
    options: {},
    isFsEvents: process.platform === 'darwin',
  },
  {
    name: 'polling',
    // Same options as "docusaurus start --poll 50"
    options: {usePolling: true, interval: 50},
    isFsEvents: false,
  },
];

// Time to wait for extra/unexpected events once expected events are received
const QuietDelay = 500;
// Max time to wait for expected events
const EventsTimeout = 5000;
// Let the FS settle, FSEvents may report changes that happened before watching
const SettleDelay = 300;
// TODO Chokidar v3 race: a file written right after its parent dir is created
//  may be missed (seen on Windows CI in polling mode), so we retry there
const retry = process.platform === 'win32' ? 2 : 0;

async function writeFiles(dir: string, files: string[]): Promise<void> {
  for (const file of files) {
    const filePath = path.join(dir, file);
    await fs.mkdir(path.dirname(filePath), {recursive: true});
    await fs.writeFile(filePath, `content of ${file}`);
  }
}

type TestWatcher = TestDirs & {
  /** Write the files, relative to siteDir */
  add: (...files: string[]) => Promise<void>;
  /** Update the files, relative to siteDir */
  change: (...files: string[]) => Promise<void>;
  /** Remove the files or directories, relative to siteDir */
  remove: (...files: string[]) => Promise<void>;
  /** Rename a file or directory, relative to siteDir */
  rename: (from: string, to: string) => Promise<void>;
  /**
   * Waits until all the expected events are received, and then a bit more to
   * collect unexpected events. Returns all the received events.
   */
  waitForEvents: (expected: string[]) => Promise<string[]>;
  /**
   * Run file system operations and return the events they trigger.
   */
  run: (action: () => Promise<void>, expected: string[]) => Promise<string[]>;
} & AsyncDisposable;

async function createTestWatcher({
  mode,
  files = [],
  paths,
  options,
}: {
  mode: WatchMode;
  /**
   * Files to create before watching, relative to siteDir
   * Use "../" to create files outside siteDir
   */
  files?: string[];
  paths: (dirs: TestDirs) => string | string[];
  options?: (dirs: TestDirs) => WatchOptions;
}): Promise<TestWatcher> {
  const tmp = await fs.mkdtempDisposable(
    path.join(await fs.realpath(tmpdir()), 'docusaurus-watch-'),
  );
  const rootDir = tmp.path;
  const siteDir = path.join(rootDir, 'site');
  const dirs = {rootDir, siteDir};
  await fs.mkdir(siteDir);
  await writeFiles(siteDir, files);
  await sleep(SettleDelay);

  const events: string[] = [];
  const watcher = watch(paths(dirs), {
    cwd: siteDir,
    ignoreInitial: true,
    ...mode.options,
    ...options?.(dirs),
  });
  watcher.on('all', (name, eventPath) => {
    events.push(`${name} ${posixPath(eventPath)}`);
  });
  await new Promise((resolve) => watcher.on('ready', resolve));
  await sleep(SettleDelay);

  const resolve = (file: string) => path.join(siteDir, file);

  async function waitForEvents(expected: string[]): Promise<string[]> {
    const start = Date.now();
    while (
      !expected.every((e) => events.includes(e)) &&
      Date.now() - start < EventsTimeout
    ) {
      await sleep(50);
    }
    await sleep(QuietDelay);
    return [...new Set(events)]
      .filter(
        (event) =>
          !event.startsWith('change ') ||
          !events.includes(event.replace(/^change /, 'add ')),
      )
      .sort();
  }

  return {
    ...dirs,
    add: (...addedFiles) => writeFiles(siteDir, addedFiles),
    change: async (...changedFiles) => {
      for (const file of changedFiles) {
        await fs.writeFile(resolve(file), `updated content of ${file}`);
      }
    },
    remove: async (...removedFiles) => {
      for (const file of removedFiles) {
        await fs.rm(resolve(file), {recursive: true});
      }
    },
    rename: (from, to) => fs.rename(resolve(from), resolve(to)),
    waitForEvents,
    async run(action, expected) {
      events.length = 0;
      await action();
      return waitForEvents(expected);
    },
    async [Symbol.asyncDispose]() {
      await watcher.close();
      await tmp[Symbol.asyncDispose]();
    },
  };
}

describe.concurrent.each(WatchModes)('watch() - $name', {retry}, (mode) => {
  const {isFsEvents} = mode;

  // Helper for tests that assert the expected events
  async function testWatch({
    expect,
    files,
    paths,
    options,
    action,
    expected,
  }: {
    expect: ExpectStatic;
    files?: string[];
    paths: (dirs: TestDirs) => string | string[];
    options?: (dirs: TestDirs) => WatchOptions;
    action: (w: TestWatcher) => Promise<void>;
    expected: string[];
  }) {
    await using w = await createTestWatcher({mode, files, paths, options});
    const events = await w.run(() => action(w), expected);
    expect(events).toEqual([...expected].sort());
  }

  describe('file paths', () => {
    it('watches absolute file path', async ({expect}) => {
      // Core: siteConfigPath
      // Ecosystem: redocusaurus spec file, docusaurus-plugin-glossary
      await testWatch({
        expect,
        files: ['docusaurus.config.js', 'other.js'],
        paths: ({siteDir}) => path.join(siteDir, 'docusaurus.config.js'),
        action: (w) => w.change('docusaurus.config.js', 'other.js'),
        expected: ['change docusaurus.config.js'],
      });
    });

    it('watches absolute file path - unlink / add', async ({expect}) => {
      await using w = await createTestWatcher({
        mode,
        files: ['docusaurus.config.js'],
        paths: ({siteDir}) => [path.join(siteDir, 'docusaurus.config.js')],
      });
      await expect(
        w.run(
          () => w.remove('docusaurus.config.js'),
          ['unlink docusaurus.config.js'],
        ),
      ).resolves.toEqual(['unlink docusaurus.config.js']);
      await expect(
        w.run(
          () => w.add('docusaurus.config.js'),
          ['add docusaurus.config.js'],
        ),
      ).resolves.toEqual(['add docusaurus.config.js']);
    });

    it('watches absolute file path - missing file', async ({expect}) => {
      await testWatch({
        expect,
        files: ['glossary/other.json'],
        paths: ({siteDir}) => path.join(siteDir, 'glossary/glossary.json'),
        action: (w) => w.add('glossary/glossary.json', 'glossary/other2.json'),
        expected: ['add glossary/glossary.json'],
      });
    });

    it('watches absolute file path - missing file and dir', async ({
      expect,
    }) => {
      await testWatch({
        expect,
        paths: ({siteDir}) => path.join(siteDir, 'glossary/glossary.json'),
        action: (w) => w.add('glossary/glossary.json', 'glossary/other.json'),
        // TODO Chokidar v3 limitation: when the parent dir does not exist,
        //  creating the file is only detected with FSEvents
        expected: isFsEvents ? ['add glossary/glossary.json'] : [],
      });
    });

    it('watches relative file paths', async ({expect}) => {
      // Core: sidebars.json, blog/authors.yml, docs/tags.yml...
      await testWatch({
        expect,
        files: ['sidebars.json', 'docs/tags.yml', 'blog/authors.yml'],
        paths: () => ['sidebars.json', 'docs/tags.yml', 'blog/authors.yml'],
        action: async (w) => {
          await w.change('sidebars.json', 'blog/authors.yml');
          await w.remove('docs/tags.yml');
        },
        expected: [
          'change sidebars.json',
          'change blog/authors.yml',
          'unlink docs/tags.yml',
        ],
      });
    });

    it('watches relative file paths - missing files', async ({expect}) => {
      // Core: docs/tags.yml is watched even if it doesn't exist yet
      await testWatch({
        expect,
        files: ['docs/intro.md'],
        paths: () => ['docs/tags.yml'],
        action: (w) => w.add('docs/tags.yml', 'docs/other.yml'),
        expected: ['add docs/tags.yml'],
      });
    });

    it('watches relative file paths - missing files and dirs', async ({
      expect,
    }) => {
      await testWatch({
        expect,
        paths: () => ['blog/authors.yml'],
        action: (w) => w.add('blog/authors.yml', 'blog/other.yml'),
        // TODO Chokidar v3 limitation: when the parent dir does not exist,
        //  creating the file is only detected with FSEvents
        expected: isFsEvents ? ['add blog/authors.yml'] : [],
      });
    });

    it('watches file paths outside siteDir', async ({expect}) => {
      // Absolute plugin paths are made relative to siteDir by core
      await testWatch({
        expect,
        files: ['../api/openapi.yaml', '../api/other.yaml'],
        paths: () => ['../api/openapi.yaml'],
        action: (w) => w.change('../api/openapi.yaml', '../api/other.yaml'),
        expected: ['change ../api/openapi.yaml'],
      });
    });

    it('watches file paths in node_modules', async ({expect}) => {
      // Ecosystem: @easyops-cn/docusaurus-search-local watches its own
      // theme component file, that is usually inside node_modules
      await testWatch({
        expect,
        files: [
          'node_modules/search-plugin/theme/SearchPage/index.js',
          'node_modules/search-plugin/theme/SearchBar/index.js',
        ],
        paths: () => ['node_modules/search-plugin/theme/SearchPage/index.js'],
        action: (w) =>
          w.change(
            'node_modules/search-plugin/theme/SearchPage/index.js',
            'node_modules/search-plugin/theme/SearchBar/index.js',
          ),
        expected: [
          'change node_modules/search-plugin/theme/SearchPage/index.js',
        ],
      });
    });
  });

  describe('directory paths', () => {
    it('watches absolute directory path recursively', async ({expect}) => {
      // Core: localizationDir
      // Ecosystem: docusaurus-plugin-openapi (spec dir)
      await testWatch({
        expect,
        files: ['i18n/fr/code.json', 'i18n/fr/docs/intro.md', 'other/a.md'],
        paths: ({siteDir}) => [path.join(siteDir, 'i18n')],
        action: async (w) => {
          await w.change('i18n/fr/code.json', 'other/a.md');
          await w.remove('i18n/fr/docs');
          await w.add('i18n/de/deep/nested/code.json', 'i18n/x.md', 'x.md');
        },
        expected: [
          'change i18n/fr/code.json',
          'unlink i18n/fr/docs/intro.md',
          'unlinkDir i18n/fr/docs',
          'addDir i18n/de',
          'addDir i18n/de/deep',
          'addDir i18n/de/deep/nested',
          'add i18n/de/deep/nested/code.json',
          'add i18n/x.md',
        ],
      });
    });

    it('watches absolute directory path - missing dir', async ({expect}) => {
      // Core: localizationDir does not exist for most sites
      await testWatch({
        expect,
        paths: ({siteDir}) => [path.join(siteDir, 'i18n')],
        action: (w) => w.add('i18n/fr/code.json', 'other/code.json'),
        expected: ['addDir i18n', 'addDir i18n/fr', 'add i18n/fr/code.json'],
      });
    });

    it('watches relative directory path recursively', async ({expect}) => {
      await testWatch({
        expect,
        files: ['api/spec.yaml', 'other/a.yaml'],
        paths: () => ['api'],
        action: async (w) => {
          await w.change('api/spec.yaml', 'other/a.yaml');
          await w.add('api/sub/spec2.yaml');
        },
        expected: [
          'change api/spec.yaml',
          'addDir api/sub',
          'add api/sub/spec2.yaml',
        ],
      });
    });
  });

  describe('glob patterns', () => {
    it('watches docs/**/*.{md,mdx}', async ({expect}) => {
      // Core: docs/blog/pages plugins "include" option
      await testWatch({
        expect,
        files: [
          'docs/a.md',
          'docs/b.mdx',
          'docs/sub/c.md',
          'docs/sub/d.md',
          'docs/removed/e.md',
          'docs/f.js',
        ],
        paths: () => ['docs/**/*.{md,mdx}'],
        action: async (w) => {
          await w.change('docs/a.md', 'docs/sub/c.md', 'docs/f.js');
          await w.remove('docs/b.mdx', 'docs/removed');
          await w.rename('docs/sub/d.md', 'docs/sub/d-renamed.md');
          await w.add(
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
          );
        },
        expected: [
          'change docs/a.md',
          'change docs/sub/c.md',
          'unlink docs/b.mdx',
          'unlink docs/removed/e.md',
          ...(isFsEvents ? [] : ['unlinkDir docs/removed']),
          'unlink docs/sub/d.md',
          'add docs/sub/d-renamed.md',
          'add docs/new.md',
          'add docs/new.mdx',
          'add docs/new-dir/deep/new.mdx',
          'add docs/_partial.md',
          'add docs/_dir/partial.md',
          'add docs/.dotfile.md',
          'add docs/.hidden/file.md',
        ],
      });
    });

    it('watches src/pages/**/*.{js,jsx,ts,tsx,md,mdx}', async ({expect}) => {
      // Core: pages plugin default "include" option
      await testWatch({
        expect,
        files: ['src/pages/index.tsx', 'src/pages/styles.module.css'],
        paths: () => ['src/pages/**/*.{js,jsx,ts,tsx,md,mdx}'],
        action: async (w) => {
          await w.change('src/pages/index.tsx', 'src/pages/styles.module.css');
          await w.add(
            'src/pages/a.js',
            'src/pages/b.jsx',
            'src/pages/c.ts',
            'src/pages/sub/d.tsx',
            'src/pages/sub/e.md',
            'src/pages/sub/f.mdx',
            'src/pages/g.css',
            'src/components/h.tsx',
          );
        },
        expected: [
          'change src/pages/index.tsx',
          'add src/pages/a.js',
          'add src/pages/b.jsx',
          'add src/pages/c.ts',
          'add src/pages/sub/d.tsx',
          'add src/pages/sub/e.md',
          'add src/pages/sub/f.mdx',
        ],
      });
    });

    it('watches docs/**/_category_.{json,yml,yaml}', async ({expect}) => {
      // Core: docs plugin category metadata files
      await testWatch({
        expect,
        files: ['docs/sub/_category_.json', 'docs/a.md'],
        paths: () => ['docs/**/_category_.{json,yml,yaml}'],
        action: async (w) => {
          await w.change('docs/sub/_category_.json', 'docs/a.md');
          await w.add(
            'docs/_category_.yml',
            'docs/new/_category_.yaml',
            'docs/new/_category_.js',
            'docs/new/category.yml',
          );
        },
        expected: [
          'change docs/sub/_category_.json',
          'add docs/_category_.yml',
          'add docs/new/_category_.yaml',
        ],
      });
    });

    it('watches docs/*.md', async ({expect}) => {
      // Users can customize the plugins "include" option
      await testWatch({
        expect,
        files: ['docs/a.md', 'docs/sub/b.md'],
        paths: () => ['docs/*.md'],
        action: async (w) => {
          await w.change('docs/a.md', 'docs/sub/b.md');
          await w.add('docs/c.md', 'docs/sub/d.md', 'docs/e.mdx');
        },
        expected: ['change docs/a.md', 'add docs/c.md'],
      });
    });

    it('watches docs/**/*.md with other "include" syntaxes', async ({
      expect,
    }) => {
      // Users can customize the plugins "include" option
      await testWatch({
        expect,
        files: ['docs/a.md', 'docs/sub/index.md'],
        paths: () => [
          'docs/**/index.md',
          'docs/**/*.markdown',
          'docs/**/[0-9]*.md',
          'docs/**/@(foo|bar).md',
        ],
        action: async (w) => {
          await w.change('docs/a.md', 'docs/sub/index.md');
          await w.add(
            'docs/new/index.md',
            'docs/new/x.markdown',
            'docs/new/1-x.md',
            'docs/new/foo.md',
            'docs/new/bar.md',
            'docs/new/baz.md',
          );
        },
        expected: [
          'change docs/sub/index.md',
          'add docs/new/index.md',
          'add docs/new/x.markdown',
          'add docs/new/1-x.md',
          'add docs/new/foo.md',
          'add docs/new/bar.md',
        ],
      });
    });

    it('watches absolute glob pattern', async ({expect}) => {
      // Ecosystem: @aldridged/docusaurus-plugin-lunr
      // Note: core makes absolute plugin paths relative to siteDir
      await testWatch({
        expect,
        files: ['docs/a.md', 'docs/sub/b.md'],
        paths: ({siteDir}) => [`${posixPath(siteDir)}/docs/**/*.{md,mdx}`],
        action: async (w) => {
          await w.change('docs/a.md');
          await w.add('docs/sub/c.md', 'docs/d.js');
        },
        expected: ['change docs/a.md', 'add docs/sub/c.md'],
      });
    });

    it('watches glob pattern outside siteDir', async ({expect}) => {
      // Core: docs plugin with path: '../docs' (monorepo setups)
      await testWatch({
        expect,
        files: ['../docs/a.md', '../docs/sub/b.md'],
        paths: () => ['../docs/**/*.{md,mdx}'],
        action: async (w) => {
          await w.change('../docs/a.md', '../docs/sub/b.md');
          await w.add('../docs/sub/c.md', '../docs/d.js', 'e.md');
        },
        expected: [
          'change ../docs/a.md',
          'change ../docs/sub/b.md',
          'add ../docs/sub/c.md',
        ],
      });
    });

    it('watches glob pattern outside siteDir - missing base dir', async ({
      expect,
    }) => {
      await testWatch({
        expect,
        paths: () => ['../docs/**/*.{md,mdx}'],
        action: (w) => w.add('../docs/a.md', '../docs/sub/b.md'),
        // TODO Chokidar v3 limitation: when the glob base dir does not exist,
        //  creating files is only detected with FSEvents
        expected: isFsEvents
          ? ['add ../docs/a.md', 'add ../docs/sub/b.md']
          : [],
      });
    });

    it('watches glob pattern outside siteDir - many extensions', async ({
      expect,
    }) => {
      // Ecosystem: @vantagecompute/docusaurus-theme watches its own theme dir
      await testWatch({
        expect,
        files: ['../theme/src/theme/Navbar/index.tsx'],
        paths: () => ['../theme/src/theme/**/*.{js,jsx,ts,tsx,css}'],
        action: async (w) => {
          await w.change('../theme/src/theme/Navbar/index.tsx');
          await w.add(
            '../theme/src/theme/Navbar/styles.css',
            '../theme/src/theme/Footer/index.js',
            '../theme/src/theme/Footer/README.md',
            '../theme/src/other.js',
          );
        },
        expected: [
          'change ../theme/src/theme/Navbar/index.tsx',
          'add ../theme/src/theme/Navbar/styles.css',
          'add ../theme/src/theme/Footer/index.js',
        ],
      });
    });

    it('watches glob pattern with missing base dir', async ({expect}) => {
      // Core: localized content, i18n/<locale>/<plugin>/**/*.{md,mdx}
      await testWatch({
        expect,
        files: ['docs/a.md'],
        paths: () => [
          'i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}',
        ],
        action: (w) =>
          w.add(
            'i18n/fr/docusaurus-plugin-content-docs/current/a.md',
            'i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
          ),
        // TODO Chokidar v3 limitation: when the glob base dir does not exist,
        //  creating files is only detected with FSEvents
        expected: isFsEvents
          ? [
              'add i18n/fr/docusaurus-plugin-content-docs/current/a.md',
              'add i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
            ]
          : [],
      });
    });

    it('watches glob pattern with missing base dir - existing parent', async ({
      expect,
    }) => {
      await testWatch({
        expect,
        files: ['i18n/fr/docusaurus-plugin-content-docs/current.json'],
        paths: () => [
          'i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}',
        ],
        action: (w) =>
          w.add(
            'i18n/fr/docusaurus-plugin-content-docs/current/a.md',
            'i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
          ),
        // TODO Chokidar v3 limitation: when the glob base dir does not exist,
        //  creating files is only detected with FSEvents
        expected: isFsEvents
          ? [
              'add i18n/fr/docusaurus-plugin-content-docs/current/a.md',
              'add i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
            ]
          : [],
      });
    });

    it('watches glob pattern with existing empty base dir', async ({
      expect,
    }) => {
      await using w = await createTestWatcher({
        mode,
        files: ['i18n/fr/docusaurus-plugin-content-docs/current/sub/x.json'],
        paths: () => [
          'i18n/fr/docusaurus-plugin-content-docs/current/**/*.{md,mdx}',
        ],
      });
      const expected = [
        'add i18n/fr/docusaurus-plugin-content-docs/current/a.md',
        'add i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
        'add i18n/fr/docusaurus-plugin-content-docs/current/sub2/c.md',
      ];
      await expect(
        w.run(
          () =>
            w.add(
              'i18n/fr/docusaurus-plugin-content-docs/current/a.md',
              'i18n/fr/docusaurus-plugin-content-docs/current/sub/b.md',
              'i18n/fr/docusaurus-plugin-content-docs/current/sub2/c.md',
            ),
          expected,
        ),
      ).resolves.toEqual(expected);
    });

    it('ignores negated glob patterns', async ({expect}) => {
      await testWatch({
        expect,
        files: ['docs/a.md', 'docs/_b.md', 'docs/_dir/c.md'],
        paths: () => ['docs/**/*.md', '!docs/**/_*.md'],
        action: async (w) => {
          await w.change('docs/a.md', 'docs/_b.md', 'docs/_dir/c.md');
          await w.add('docs/d.md', 'docs/_e.md');
        },
        expected: [
          'change docs/a.md',
          'change docs/_dir/c.md',
          'add docs/d.md',
        ],
      });
    });

    it('does not ignore negated absolute glob patterns', async ({expect}) => {
      // Ecosystem: docusaurus-plugin-structurizr
      // Note: core does not make negated absolute paths relative to siteDir
      // TODO Chokidar v3 bug: with the "cwd" option, negated absolute patterns
      //  are resolved against cwd ("!<cwd>/<abs>") and have no effect
      await testWatch({
        expect,
        files: ['arch/a.dsl', 'arch/include.b.dsl'],
        paths: ({siteDir}) => [
          'arch/**/*.dsl',
          `!${posixPath(siteDir)}/**/include.*.dsl`,
        ],
        action: async (w) => {
          await w.change('arch/a.dsl', 'arch/include.b.dsl');
          await w.add('arch/sub/c.dsl', 'arch/sub/include.d.dsl');
        },
        expected: [
          'change arch/a.dsl',
          'change arch/include.b.dsl',
          'add arch/sub/c.dsl',
          'add arch/sub/include.d.dsl',
        ],
      });
    });
  });

  describe('multiple paths', () => {
    it('watches overlapping paths', async ({expect}) => {
      await testWatch({
        expect,
        files: ['docs/a.md', 'docs/tags.yml'],
        paths: () => [
          'docs/**/*.{md,mdx}',
          'docs/**/*.md',
          'docs/tags.yml',
          'docs',
        ],
        action: async (w) => {
          await w.change('docs/a.md', 'docs/tags.yml');
          await w.add('docs/b.js');
        },
        expected: ['change docs/a.md', 'change docs/tags.yml', 'add docs/b.js'],
      });
    });

    it('watches docs plugin paths', async ({expect}) => {
      // Core: docs plugin getPathsToWatch() with i18n
      await testWatch({
        expect,
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
        action: async (w) => {
          await w.change(
            'sidebars.js',
            'docs/intro.md',
            'docs/tags.yml',
            'docs/category/_category_.json',
            'i18n/fr/docusaurus-plugin-content-docs/current/intro.md',
            'versioned_sidebars/version-1.0.0-sidebars.json',
            'versioned_docs/version-1.0.0/intro.md',
          );
          await w.add(
            'i18n/fr/docusaurus-plugin-content-docs/current/tags.yml',
            'versioned_docs/version-1.0.0/tags.yml',
            'versioned_docs/version-1.0.0/_category_.yml',
            'docs/intro.js',
            'versioned_docs/version-1.0.0/intro.js',
          );
        },
        expected: [
          'change sidebars.js',
          'change docs/intro.md',
          'change docs/tags.yml',
          'change docs/category/_category_.json',
          'change i18n/fr/docusaurus-plugin-content-docs/current/intro.md',
          'change versioned_sidebars/version-1.0.0-sidebars.json',
          'change versioned_docs/version-1.0.0/intro.md',
          'add i18n/fr/docusaurus-plugin-content-docs/current/tags.yml',
          'add versioned_docs/version-1.0.0/tags.yml',
          'add versioned_docs/version-1.0.0/_category_.yml',
        ],
      });
    });
  });

  describe('options', () => {
    it('emits absolute paths without cwd option', async ({expect}) => {
      await using w = await createTestWatcher({
        mode,
        files: ['docs/a.md'],
        paths: ({siteDir}) => [path.join(siteDir, 'docs/**/*.md')],
        options: () => ({cwd: undefined}),
      });
      const expected = [
        `change ${posixPath(path.join(w.siteDir, 'docs/a.md'))}`,
      ];
      await expect(
        w.run(() => w.change('docs/a.md'), expected),
      ).resolves.toEqual(expected);
    });

    it('emits initial events with ignoreInitial: false', async ({expect}) => {
      await using w = await createTestWatcher({
        mode,
        files: ['docs/a.md', 'docs/sub/b.mdx', 'docs/c.js', 'sidebars.js'],
        paths: () => ['docs/**/*.{md,mdx}', 'sidebars.js'],
        options: () => ({ignoreInitial: false}),
      });
      const expected = [
        'add docs/a.md',
        'add docs/sub/b.mdx',
        'add sidebars.js',
      ];
      await expect(w.waitForEvents(expected)).resolves.toEqual(expected);
    });
  });
});
