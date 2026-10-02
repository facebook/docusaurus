/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {mkdtempDisposable, realpath} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import _ from 'lodash';
import dedent from 'dedent';
import {loadFreshModule} from '../moduleUtils';

async function createTmpDir() {
  return mkdtempDisposable(
    path.join(await realpath(tmpdir()), 'docusaurus-tmp-'),
  );
}

async function moduleGraphHelpers() {
  const dir = await createTmpDir();

  async function fileHelper(name: string, initialContent?: string) {
    const filePath = path.resolve(dir.path, name);
    if (initialContent) {
      await fs.outputFile(filePath, initialContent);
    }
    return {
      filePath,
      write: (content: string) => fs.outputFile(filePath, content),
      load: (withDefault: boolean) => loadModule(filePath, withDefault),
    };
  }

  return {fileHelper, [Symbol.asyncDispose]: dir[Symbol.asyncDispose]};
}

async function loadModule(modulePath: string, withDefault: boolean) {
  const result = (await loadFreshModule(
    modulePath,
    withDefault ? {default: true} : undefined,
  )) as object;

  // Because Jiti uses an internal proxy for interopDefault
  // Spreading converts the proxy to an object compatible with test matchers
  const obj = {...result};
  // console.log(modulePath, obj);
  return obj;
}

async function loadFixtureModule(
  fixtureName: string,
  withDefault: boolean,
): Promise<{default?: unknown; [key: string]: unknown}> {
  return loadModule(
    path.resolve(__dirname, '__fixtures__/moduleUtils', fixtureName),
    withDefault,
  );
}

describe('loadFreshModule', () => {
  describe('can load CJS user module', () => {
    async function testUserFixture(fixtureName: string) {
      const userFixturePath = `user/${fixtureName}`;

      await expect(loadFixtureModule(userFixturePath, true)).resolves.toEqual({
        birthYear: 1986,
        firstName: 'Sebastien',
        lastName: 'Lorber',
      });

      // Note: Jiti 2+ doesn't seem to behave exactly the same as Jiti 1 on our
      // fancy CJS module fixtures mixing "module.exports" + exports.named
      // I doubt this is a problem in practice, but we'll see
      // Maybe we'll drop support for CJS config modules in the future?
      // See https://github.com/facebook/docusaurus/pull/12045
      /*
      await expect(loadFixtureModule(userFixturePath, false)).resolves.toEqual({
        default: {
          birthYear: 1986,
          firstName: 'Sebastien',
          lastName: 'Lorber',
        },
      });
       */
    }

    it('for .cjs.js', async () => {
      await testUserFixture('user.cjs.js');
    });

    it('for .cjs.ts', async () => {
      await testUserFixture('user.cjs.ts');
    });

    it('for .cjs', async () => {
      await testUserFixture('user.cjs');
    });
  });

  describe('can load ESM user module', () => {
    async function testUserFixture(fixtureName: string) {
      const userFixturePath = `user/${fixtureName}`;

      await expect(loadFixtureModule(userFixturePath, true)).resolves.toEqual({
        birthYear: 1986,
        firstName: 'Sebastien',
        lastName: 'Lorber',
      });

      await expect(loadFixtureModule(userFixturePath, false)).resolves.toEqual({
        default: {
          birthYear: 1986,
          firstName: 'Sebastien',
          lastName: 'Lorber',
        },
        someNamedExport: 42,
      });
    }

    it('for .esm.js', async () => {
      await testUserFixture('user.esm.js');
    });

    it('for .esm.ts', async () => {
      await testUserFixture('user.esm.ts');
    });

    it('for .mjs', async () => {
      await testUserFixture('user.mjs');
    });
  });

  describe('module graph', () => {
    it('can load and reload fresh module graph', async () => {
      await using helpers = await moduleGraphHelpers();
      const {fileHelper} = helpers;

      const dependency1 = await fileHelper(
        'dependency1.js',
        /* language=js */
        dedent`
          export const dep1Export = "dep1 val1";

          export default {dep1Val: "dep1 val2"}
        `,
      );

      const dependency2 = await fileHelper(
        'dependency2.ts',
        /* language=ts */
        dedent`
          export const dep2Export = "dep2 val1";

          export default {dep2Val: "dep2 val2"} satisfies {dep2Val: string}
        `,
      );

      const entryFile = await fileHelper(
        'entry.js',
        /* language=js */
        dedent`
        import dependency1 from "./dependency1";
        import * as dependency2 from "./dependency2";

        export default {
          someEntryValue: "entryVal",
          dependency1,
          dependency2
        };
        `,
      );

      // Should be able to read the initial module graph
      await expect(entryFile.load(true)).resolves.toEqual({
        someEntryValue: 'entryVal',
        dependency1: {
          dep1Val: 'dep1 val2',
        },
        dependency2: {
          dep2Export: 'dep2 val1',
          default: {
            dep2Val: 'dep2 val2',
          },
        },
      });
      await expect(entryFile.load(false)).resolves.toEqual({
        default: {
          someEntryValue: 'entryVal',
          dependency1: {
            // dep1Export: 'dep1 val1', // Expected: not using "* as"
            dep1Val: 'dep1 val2',
          },
          dependency2: {
            dep2Export: 'dep2 val1',

            default: {
              dep2Val: 'dep2 val2',
            },
          },
        },
      });

      await expect(dependency1.load(true)).resolves.toEqual({
        dep1Val: 'dep1 val2',
      });

      await expect(dependency1.load(false)).resolves.toEqual({
        dep1Export: 'dep1 val1',
        default: {
          dep1Val: 'dep1 val2',
        },
      });

      await expect(dependency2.load(true)).resolves.toEqual({
        dep2Val: 'dep2 val2',
      });
      await expect(dependency2.load(false)).resolves.toEqual({
        dep2Export: 'dep2 val1',
        default: {
          dep2Val: 'dep2 val2',
        },
      });

      // Should be able to read the module graph again after updates
      await dependency1.write(
        /* language=js */
        dedent`
          export const dep1Export = "dep1 val1 updated";

          export default {dep1Val: "dep1 val2 updated"}
        `,
      );

      await expect(entryFile.load(true)).resolves.toEqual({
        someEntryValue: 'entryVal',
        dependency1: {
          // dep1Export: 'dep1 val1 updated', // Expected: not using "* as"
          dep1Val: 'dep1 val2 updated',
        },
        dependency2: {
          dep2Export: 'dep2 val1',
          default: {
            dep2Val: 'dep2 val2',
          },
        },
      });
      await expect(entryFile.load(false)).resolves.toEqual({
        default: {
          someEntryValue: 'entryVal',
          dependency1: {
            // dep1Export: 'dep1 val1 updated', // Expected: not using "* as"
            dep1Val: 'dep1 val2 updated',
          },
          dependency2: {
            dep2Export: 'dep2 val1',
            default: {
              dep2Val: 'dep2 val2',
            },
          },
        },
      });

      await expect(dependency1.load(true)).resolves.toEqual({
        dep1Val: 'dep1 val2 updated',
      });
      await expect(dependency1.load(false)).resolves.toEqual({
        dep1Export: 'dep1 val1 updated',
        default: {
          dep1Val: 'dep1 val2 updated',
        },
      });

      await expect(dependency2.load(true)).resolves.toEqual({
        dep2Val: 'dep2 val2',
      });
      await expect(dependency2.load(false)).resolves.toEqual({
        dep2Export: 'dep2 val1',
        default: {
          dep2Val: 'dep2 val2',
        },
      });

      // Should be able to read the module graph again after updates
      await dependency2.write(
        /* language=ts */
        dedent`
          export const dep2Export = "dep2 val1 updated";

          export default {dep2Val: "dep2 val2 updated"} satisfies {dep2Val: string}
        `,
      );

      await expect(entryFile.load(true)).resolves.toEqual({
        someEntryValue: 'entryVal',
        dependency1: {
          // dep1Export: 'dep1 val1 updated', // Expected: not using "* as"
          dep1Val: 'dep1 val2 updated',
        },
        dependency2: {
          dep2Export: 'dep2 val1 updated',
          default: {
            dep2Val: 'dep2 val2 updated',
          },
        },
      });
      await expect(entryFile.load(false)).resolves.toEqual({
        default: {
          someEntryValue: 'entryVal',
          dependency1: {
            // dep1Export: 'dep1 val1 updated', // Expected: not using "* as"
            dep1Val: 'dep1 val2 updated',
          },
          dependency2: {
            dep2Export: 'dep2 val1 updated',
            default: {
              dep2Val: 'dep2 val2 updated',
            },
          },
        },
      });

      await expect(dependency1.load(true)).resolves.toEqual({
        // dep1Export: 'dep1 val1 updated', // Expected: not using "* as"
        dep1Val: 'dep1 val2 updated',
      });
      await expect(dependency1.load(false)).resolves.toEqual({
        dep1Export: 'dep1 val1 updated',
        default: {
          dep1Val: 'dep1 val2 updated',
        },
      });

      await expect(dependency2.load(true)).resolves.toEqual({
        dep2Val: 'dep2 val2 updated',
      });
      await expect(dependency2.load(false)).resolves.toEqual({
        dep2Export: 'dep2 val1 updated',
        default: {
          dep2Val: 'dep2 val2 updated',
        },
      });

      // Should be able to read the module graph again after entry updates
      await entryFile.write(
        /* language=js */
        dedent`
        import * as dependency1 from "./dependency1";
        import dependency2 from "./dependency2";

        export default {
          someEntryValue: "entryVal updated",
          dependency1,
          dependency2,
          newAttribute: "is there"
        }
        `,
      );

      await expect(entryFile.load(true)).resolves.toEqual({
        someEntryValue: 'entryVal updated',
        newAttribute: 'is there',
        dependency1: {
          dep1Export: 'dep1 val1 updated',
          default: {
            dep1Val: 'dep1 val2 updated',
          },
        },
        dependency2: {
          dep2Val: 'dep2 val2 updated',
        },
      });
      await expect(entryFile.load(false)).resolves.toEqual({
        default: {
          someEntryValue: 'entryVal updated',
          newAttribute: 'is there',
          dependency1: {
            dep1Export: 'dep1 val1 updated',
            default: {
              dep1Val: 'dep1 val2 updated',
            },
          },
          dependency2: {
            dep2Val: 'dep2 val2 updated',
          },
        },
      });

      await expect(dependency1.load(true)).resolves.toEqual({
        dep1Val: 'dep1 val2 updated',
      });
      await expect(dependency1.load(false)).resolves.toEqual({
        dep1Export: 'dep1 val1 updated',
        default: {
          dep1Val: 'dep1 val2 updated',
        },
      });

      await expect(dependency2.load(true)).resolves.toEqual({
        dep2Val: 'dep2 val2 updated',
      });
      await expect(dependency2.load(false)).resolves.toEqual({
        dep2Export: 'dep2 val1 updated',
        default: {
          dep2Val: 'dep2 val2 updated',
        },
      });
    });
  });

  describe('invalid module path param', () => {
    it('throws if module path does not exist', async () => {
      await expect(() =>
        loadFreshModule('/some/unknown/module/path.js'),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `
        [Error: Docusaurus could not load module at path "/some/unknown/module/path.js"]
        Cause: [Error: Cannot find module '/some/unknown/module/path.js'
        Require stack:
        - <PROJECT_ROOT>/packages/docusaurus-utils/src/moduleUtils.ts]
      `,
      );
    });

    it('throws if module path is undefined', async () => {
      await expect(() =>
        // @ts-expect-error: undefined is invalid
        loadFreshModule(undefined),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid module path of type "undefined" with value "undefined"]`,
      );
    });

    it('throws if module path is null', async () => {
      await expect(() =>
        // @ts-expect-error: null is invalid
        loadFreshModule(null),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid module path of type "object" with value "null"]`,
      );
    });

    it('throws if module path is number', async () => {
      await expect(() =>
        // @ts-expect-error: number is invalid
        loadFreshModule(42),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid module path of type "number" with value "42"]`,
      );
    });

    it('throws if module path is object', async () => {
      await expect(() =>
        // @ts-expect-error: object is invalid
        loadFreshModule({}),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid module path of type "object" with value "[object Object]"]`,
      );
    });
  });
});

/*
Compatibility suite for loadFreshModule()

loadFreshModule() loads user-provided modules: site config, sidebars, local
plugins/themes/presets, and npm plugins/themes/presets.
These tests capture the behaviors users rely on today, so that we can safely
change the underlying module loader (jiti, Node.js native loader...)

Fixtures are created in temp dirs on purpose: some are not valid for our
linters/formatters/tsc, and some need node_modules dirs or symlinks.
 */

type LoadOptions = Parameters<typeof loadFreshModule>[1];
// Loaded modules are untyped user code
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyModule = {[key: string]: any};

async function createFixture(files: {[fileName: string]: string}) {
  const dir = await mkdtempDisposable(
    path.join(await realpath(tmpdir()), 'docusaurus-load-module-'),
  );
  const resolve = (fileName: string) => path.join(dir.path, fileName);
  const write = (fileName: string, content: string) =>
    fs.outputFile(resolve(fileName), content);
  await Promise.all(
    Object.entries(files).map(([fileName, content]) =>
      write(fileName, content),
    ),
  );
  return {
    dir: dir.path,
    resolve,
    write,
    async symlink(target: string, fileName: string) {
      await fs.ensureDir(path.dirname(resolve(fileName)));
      // "junction" so that Windows CI doesn't need admin rights
      await fs.symlink(resolve(target), resolve(fileName), 'junction');
    },
    load: (fileName: string, options?: LoadOptions) =>
      loadFreshModule(resolve(fileName), options) as Promise<AnyModule>,
    [Symbol.asyncDispose]: () => dir[Symbol.asyncDispose](),
  };
}

type Fixture = Awaited<ReturnType<typeof createFixture>>;

// Mirrors how plugins/themes/presets modules are consumed by callers
// See packages/docusaurus/src/server/plugins/{configs,init,presets}.ts
function pluginView(module: AnyModule) {
  return {
    plugin: module.default ?? module,
    validateOptions: module.default?.validateOptions ?? module.validateOptions,
    validateThemeConfig:
      module.default?.validateThemeConfig ?? module.validateThemeConfig,
  };
}

// Loader-agnostic and machine-agnostic error chain representation
async function loadErrorChain(
  fixture: Fixture,
  fileName: string,
  options?: LoadOptions,
): Promise<string> {
  const error = await fixture.load(fileName, options).then(
    () => {
      throw new Error(`Expected ${fileName} loading to fail`);
    },
    (err: unknown) => err,
  );
  const messages: string[] = [];
  let current: unknown = error;
  while (current instanceof Error) {
    messages.push(`[${current.name}: ${current.message}]`);
    current = current.cause;
  }
  // On Windows, loaders may report paths with forward slashes
  const dirPatterns = [
    pathToFileURL(fixture.dir).href,
    fixture.dir,
    fixture.dir.replaceAll('\\', '/'),
  ].map((pattern) => new RegExp(_.escapeRegExp(pattern), 'gi'));
  return dirPatterns
    .reduce(
      (str, pattern) => str.replace(pattern, '<FIXTURE_DIR>'),
      messages.join('\nCause: '),
    )
    .replaceAll('\\', '/')
    .replace(/[ \t]+$/gm, '');
}

describe('loadFreshModule compatibility', () => {
  describe('file formats', () => {
    const esmContent = dedent`
      export const named = 42;
      export default {format: 'esm'};
    `;
    const esmTsContent = dedent`
      export const named: number = 42;
      export default {format: 'esm'} satisfies {format: string};
    `;
    const cjsContent = dedent`
      module.exports = {format: 'cjs'};
    `;
    const cjsTsContent = dedent`
      module.exports = {format: 'cjs'} satisfies {format: string};
    `;

    async function expectESM(fileName: string, content: string) {
      await using fixture = await createFixture({[fileName]: content});
      await expect(fixture.load(fileName, {default: true})).resolves.toEqual({
        format: 'esm',
      });
      const module = await fixture.load(fileName);
      expect(module.default).toEqual({format: 'esm'});
      expect(module.named).toBe(42);
    }

    async function expectCJS(fileName: string, content: string) {
      await using fixture = await createFixture({[fileName]: content});
      await expect(fixture.load(fileName, {default: true})).resolves.toEqual({
        format: 'cjs',
      });
      const module = await fixture.load(fileName);
      expect(module.default ?? module).toEqual({format: 'cjs'});
    }

    it('loads ESM .js', () => expectESM('config.js', esmContent));
    it('loads ESM .mjs', () => expectESM('config.mjs', esmContent));
    it('loads ESM .ts', () => expectESM('config.ts', esmTsContent));
    it('loads ESM .mts', () => expectESM('config.mts', esmTsContent));
    it('loads CJS .js', () => expectCJS('config.js', cjsContent));
    it('loads CJS .cjs', () => expectCJS('config.cjs', cjsContent));
    it('loads CJS .ts', () => expectCJS('config.ts', cjsTsContent));
    it('loads CJS .cts', () => expectCJS('config.cts', cjsTsContent));

    it('loads ESM .js in a "type: module" package', async () => {
      await using fixture = await createFixture({
        'package.json': '{"type": "module"}',
        'config.js': esmContent,
      });
      await expect(fixture.load('config.js', {default: true})).resolves.toEqual(
        {format: 'esm'},
      );
    });

    it('loads CJS .cjs in a "type: module" package', async () => {
      await using fixture = await createFixture({
        'package.json': '{"type": "module"}',
        'config.cjs': cjsContent,
      });
      await expect(
        fixture.load('config.cjs', {default: true}),
      ).resolves.toEqual({format: 'cjs'});
    });

    it('loads ESM .ts in a "type: module" package', async () => {
      await using fixture = await createFixture({
        'package.json': '{"type": "module"}',
        'config.ts': esmTsContent,
      });
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {format: 'esm'},
      );
    });

    it('loads CJS .ts in a "type: module" package', async () => {
      await using fixture = await createFixture({
        'package.json': '{"type": "module"}',
        'config.ts': cjsTsContent,
      });
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {format: 'cjs'},
      );
    });

    it('loads .json', async () => {
      await using fixture = await createFixture({
        'sidebars.json': '{"sidebar": ["doc1", "doc2"]}',
      });
      await expect(
        fixture.load('sidebars.json', {default: true}),
      ).resolves.toEqual({sidebar: ['doc1', 'doc2']});
      const module = await fixture.load('sidebars.json');
      expect(module.default ?? module).toEqual({sidebar: ['doc1', 'doc2']});
    });

    it('loads async config function', async () => {
      await using fixture = await createFixture({
        'config.ts': dedent`
          export default async function createConfig() {
            return {title: 'async' as string};
          }
        `,
      });
      const createConfig = await fixture.load('config.ts', {default: true});
      expect(createConfig).toBeTypeOf('function');
      await expect((createConfig as () => unknown)()).resolves.toEqual({
        title: 'async',
      });
    });

    it('loads a default exported promise', async () => {
      await using fixture = await createFixture({
        'config.ts': dedent`
          export default Promise.resolve({title: 'promise' as string});
        `,
      });
      // loadFreshModule() is async: the default export promise is flattened
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {title: 'promise'},
      );
    });

    it.each(['config.ts', 'config.mts', 'config.js', 'config.mjs'])(
      'supports top-level await in %s',
      async (fileName) => {
        await using fixture = await createFixture({
          [fileName]: dedent`
            const value = await Promise.resolve(42);
            export default {value};
          `,
        });
        await expect(fixture.load(fileName, {default: true})).resolves.toEqual({
          value: 42,
        });
      },
    );

    it('supports top-level await in a dependency', async () => {
      await using fixture = await createFixture({
        'config.ts': dedent`
          import {value} from './dep';
          export default {value};
        `,
        'dep.ts': dedent`
          export const value: number = await Promise.resolve(42);
        `,
      });
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {value: 42},
      );
    });
  });

  describe('mixed ESM/CJS syntax', () => {
    // Common in older Docusaurus configs migrated from CJS to ESM
    const mixedContent = dedent`
      const path = require('node:path');
      const dep = require('./dep.js');

      export default {
        dirname: __dirname,
        filename: path.basename(__filename),
        resolved: path.basename(require.resolve('./dep.js')),
        dep,
      };
    `;

    async function expectMixed(fileName: string) {
      await using fixture = await createFixture({
        [fileName]: mixedContent,
        'dep.js': `module.exports = 'dep';`,
      });
      const config = await fixture.load(fileName, {default: true});
      expect({...config, dirname: path.normalize(config.dirname)}).toEqual({
        dirname: fixture.dir,
        filename: fileName,
        resolved: 'dep.js',
        dep: 'dep',
      });
    }

    it('supports export default + require() + __dirname in .js', () =>
      expectMixed('config.js'));
    it('supports export default + require() + __dirname in .ts', () =>
      expectMixed('config.ts'));

    it('supports import + module.exports in .js', async () => {
      await using fixture = await createFixture({
        'config.js': dedent`
          import dep from './dep.js';
          module.exports = {dep};
        `,
        'dep.js': `export default 'dep';`,
      });
      await expect(fixture.load('config.js', {default: true})).resolves.toEqual(
        {dep: 'dep'},
      );
    });

    it.each(['config.ts', 'config.js', 'config.mjs', 'config.mts'])(
      'supports import.meta in %s',
      async (fileName) => {
        await using fixture = await createFixture({
          [fileName]: dedent`
            export default {
              url: import.meta.url,
              dirname: import.meta.dirname,
              filename: import.meta.filename,
            };
          `,
        });
        const config = await fixture.load(fileName, {default: true});
        expect({
          url: path.normalize(fileURLToPath(config.url)),
          dirname: path.normalize(config.dirname),
          filename: path.normalize(config.filename),
        }).toEqual({
          url: fixture.resolve(fileName),
          dirname: fixture.dir,
          filename: fixture.resolve(fileName),
        });
      },
    );
  });

  describe('import specifiers', () => {
    async function expectImport(
      entryFileName: string,
      specifier: string,
      files: {[fileName: string]: string},
    ) {
      await using fixture = await createFixture({
        ...files,
        [entryFileName]: dedent`
          import value from '${specifier}';
          export default {value};
        `,
      });
      await expect(
        fixture.load(entryFileName, {default: true}),
      ).resolves.toEqual({value: 'dep'});
    }

    const depTs = `export default 'dep' as string;`;
    const depJs = `export default 'dep';`;

    it('resolves ./dep.ts from .ts', () =>
      expectImport('config.ts', './dep.ts', {'dep.ts': depTs}));
    it('resolves ./dep without extension to dep.ts from .ts', () =>
      expectImport('config.ts', './dep', {'dep.ts': depTs}));
    it('resolves TS-style ./dep.js to dep.ts from .ts', () =>
      expectImport('config.ts', './dep.js', {'dep.ts': depTs}));
    it('resolves directory ./dir to dir/index.ts from .ts', () =>
      expectImport('config.ts', './dir', {'dir/index.ts': depTs}));
    it('resolves ./dep without extension to dep.js from .ts', () =>
      expectImport('config.ts', './dep', {'dep.js': depJs}));
    it('resolves ./dep without extension to dep.js from .js', () =>
      expectImport('config.js', './dep', {'dep.js': depJs}));
    it('resolves directory ./dir to dir/index.js from .js', () =>
      expectImport('config.js', './dir', {'dir/index.js': depJs}));
    it('resolves ./dep without extension to dep.ts from .js', () =>
      expectImport('config.js', './dep', {'dep.ts': depTs}));
    it('resolves ./dep.mts from .ts', () =>
      expectImport('config.ts', './dep.mts', {'dep.mts': depTs}));
    it('resolves ./dep.cts from .ts', () =>
      expectImport('config.ts', './dep.cts', {
        'dep.cts': `module.exports = 'dep' as string;`,
      }));
  });

  describe('file paths', () => {
    it.each([
      'with space/config.ts',
      'with#hash/config.ts',
      'with%25percent/config.ts',
      'with-unicode-é-日本/config.ts',
    ])('loads %s and its dependencies', async (fileName) => {
      const dir = path.dirname(fileName);
      await using fixture = await createFixture({
        [fileName]: dedent`
          import dep from './dep';
          export default {dep};
        `,
        [`${dir}/dep.ts`]: `export default 'dep' as string;`,
      });
      await expect(fixture.load(fileName, {default: true})).resolves.toEqual({
        dep: 'dep',
      });
    });
  });

  describe('JSON imports', () => {
    const data = '{"key": "value"}';

    it.each([
      ['config.ts', `import data from './data.json';`],
      ['config.ts', `import data from './data.json' with {type: 'json'};`],
      ['config.ts', `const data = require('./data.json');`],
      ['config.js', `import data from './data.json';`],
      ['config.js', `import data from './data.json' with {type: 'json'};`],
      ['config.mjs', `import data from './data.json' with {type: 'json'};`],
      ['config.cjs', `const data = require('./data.json');`],
    ])('supports %s with: %s', async (fileName, importStatement) => {
      const exportStatement = fileName.endsWith('.cjs')
        ? 'module.exports = {data};'
        : 'export default {data};';
      await using fixture = await createFixture({
        'data.json': data,
        [fileName]: `${importStatement}\n${exportStatement}`,
      });
      await expect(fixture.load(fileName, {default: true})).resolves.toEqual({
        data: {key: 'value'},
      });
    });

    it('supports named imports from JSON in .ts', async () => {
      await using fixture = await createFixture({
        'data.json': data,
        'config.ts': dedent`
          import {key} from './data.json';
          export default {key};
        `,
      });
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {key: 'value'},
      );
    });
  });

  describe('TypeScript type imports', () => {
    // Very common in user configs: import {Config} from '@docusaurus/types'
    it('elides type-only imports from a types-only package', async () => {
      await using fixture = await createFixture({
        'node_modules/types-only-pkg/package.json': dedent`
          {"name": "types-only-pkg", "types": "index.d.ts"}
        `,
        'node_modules/types-only-pkg/index.d.ts': dedent`
          export type Config = {title: string};
        `,
        'config.ts': dedent`
          import {Config} from 'types-only-pkg';
          const config: Config = {title: 'title'};
          export default config;
        `,
      });
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {title: 'title'},
      );
    });

    it('elides type-only imports from a local file', async () => {
      await using fixture = await createFixture({
        'types.ts': dedent`
          export type SidebarItem = string;
        `,
        'sidebars.ts': dedent`
          import {SidebarItem} from './types';
          const items: SidebarItem[] = ['doc'];
          export default {sidebar: items};
        `,
      });
      await expect(
        fixture.load('sidebars.ts', {default: true}),
      ).resolves.toEqual({sidebar: ['doc']});
    });

    it('supports import type', async () => {
      await using fixture = await createFixture({
        'config.ts': dedent`
          import type {Config} from 'missing-types-pkg';
          import {type Other} from 'missing-types-pkg';
          const config: Config & Other = {title: 'title'};
          export default config;
        `,
      });
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {title: 'title'},
      );
    });
  });

  describe('non-erasable TypeScript syntax', () => {
    async function expectTS(content: string, files = {}) {
      await using fixture = await createFixture({
        ...files,
        'config.ts': content,
      });
      return await fixture.load('config.ts', {default: true});
    }

    it('supports enum', async () => {
      await expect(
        expectTS(dedent`
          enum Color {Red = 'red', Blue = 'blue'}
          export default {color: Color.Blue};
        `),
      ).resolves.toEqual({color: 'blue'});
    });

    it('supports namespace', async () => {
      await expect(
        expectTS(dedent`
          namespace NS {
            export const value = 42;
          }
          export default {value: NS.value};
        `),
      ).resolves.toEqual({value: 42});
    });

    it('supports parameter properties', async () => {
      await expect(
        expectTS(dedent`
          class Item {
            constructor(public readonly value: number) {}
          }
          export default {value: new Item(42).value};
        `),
      ).resolves.toEqual({value: 42});
    });

    it('supports import = require()', async () => {
      await expect(
        expectTS(
          dedent`
            import dep = require('./dep.js');
            export default {dep};
          `,
          {'dep.js': `module.exports = 'dep';`},
        ),
      ).resolves.toEqual({dep: 'dep'});
    });
  });

  describe('JSX', () => {
    // jiti doesn't enable JSX by default, and we don't enable it
    // Configs/sidebars/plugins must not contain JSX syntax
    it('rejects JSX syntax in .tsx', async () => {
      await using fixture = await createFixture({
        'config.tsx': dedent`
          const element = <div />;
          export default {element};
        `,
      });
      await expect(fixture.load('config.tsx')).rejects.toThrow(
        /Docusaurus could not load module/,
      );
    });

    it('rejects JSX syntax in .jsx', async () => {
      await using fixture = await createFixture({
        'config.jsx': dedent`
          const element = <div />;
          export default {element};
        `,
      });
      await expect(fixture.load('config.jsx')).rejects.toThrow(
        /Docusaurus could not load module/,
      );
    });

    it('loads .tsx without JSX syntax', async () => {
      await using fixture = await createFixture({
        'config.tsx': dedent`
          export default {value: 42 as number};
        `,
      });
      await expect(
        fixture.load('config.tsx', {default: true}),
      ).resolves.toEqual({value: 42});
    });
  });

  describe('node_modules and symlinked packages', () => {
    const tsPackage = {
      'package.json': '{"name": "ts-pkg", "main": "index.ts"}',
      'index.ts': `export default 'ts-pkg' as string;`,
    };

    function nodeModule(
      packageName: string,
      files: {[fileName: string]: string},
      prefix = 'node_modules',
    ) {
      return Object.fromEntries(
        Object.entries(files).map(([fileName, content]) => [
          `${prefix}/${packageName}/${fileName}`,
          content,
        ]),
      );
    }

    it('imports a TS package from node_modules', async () => {
      await using fixture = await createFixture({
        ...nodeModule('ts-pkg', tsPackage),
        'config.ts': dedent`
          import value from 'ts-pkg';
          export default {value};
        `,
      });
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {value: 'ts-pkg'},
      );
    });

    it('loads a TS plugin entry from node_modules', async () => {
      await using fixture = await createFixture(
        nodeModule('ts-pkg', tsPackage),
      );
      await expect(
        fixture.load('node_modules/ts-pkg/index.ts', {default: true}),
      ).resolves.toBe('ts-pkg');
    });

    it('imports a symlinked TS workspace package', async () => {
      await using fixture = await createFixture({
        ...nodeModule('ts-pkg', tsPackage, 'packages'),
        'website/docusaurus.config.ts': dedent`
          import value from 'ts-pkg';
          export default {value};
        `,
      });
      await fixture.symlink('packages/ts-pkg', 'website/node_modules/ts-pkg');
      await expect(
        fixture.load('website/docusaurus.config.ts', {default: true}),
      ).resolves.toEqual({value: 'ts-pkg'});
    });

    it('loads a symlinked TS workspace plugin entry', async () => {
      await using fixture = await createFixture({
        ...nodeModule('ts-pkg', tsPackage, 'packages'),
        'website/docusaurus.config.ts': `export default {};`,
      });
      await fixture.symlink('packages/ts-pkg', 'website/node_modules/ts-pkg');
      // Like plugins/configs.ts: resolve with require, then load
      const pluginPath = createRequire(
        fixture.resolve('website/docusaurus.config.ts'),
      ).resolve('ts-pkg');
      expect(pluginPath).toBe(fixture.resolve('packages/ts-pkg/index.ts'));
      await expect(loadFreshModule(pluginPath, {default: true})).resolves.toBe(
        'ts-pkg',
      );
    });

    it('imports an ESM-only package', async () => {
      await using fixture = await createFixture({
        ...nodeModule('esm-pkg', {
          'package.json': dedent`
            {
              "name": "esm-pkg",
              "type": "module",
              "exports": {"import": "./index.js"}
            }
          `,
          'index.js': `export default 'esm-pkg';`,
        }),
        'config.ts': dedent`
          import value from 'esm-pkg';
          export default {value};
        `,
      });
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {value: 'esm-pkg'},
      );
    });

    // Packages imported by configs must be the same instances that Docusaurus
    // core uses (no duplicated module state, instanceof checks keep working)
    describe('shares package instances with the Node.js module cache', () => {
      const cjsPackage = {
        'package.json': '{"name": "cjs-pkg", "main": "index.js"}',
        'index.js': `module.exports = {instance: {}};`,
      };

      async function expectSameInstance(fixture: Fixture, configPath: string) {
        const nativeInstance = createRequire(fixture.resolve(configPath))(
          'cjs-pkg',
        ).instance;
        const config1 = await fixture.load(configPath, {default: true});
        const config2 = await fixture.load(configPath, {default: true});
        expect(config1.instance).toBe(nativeInstance);
        expect(config2.instance).toBe(nativeInstance);
      }

      const configContent = dedent`
        import pkg from 'cjs-pkg';
        export default {instance: pkg.instance};
      `;

      it('for node_modules packages', async () => {
        await using fixture = await createFixture({
          ...nodeModule('cjs-pkg', cjsPackage),
          'config.ts': configContent,
        });
        await expectSameInstance(fixture, 'config.ts');
      });

      it('for symlinked workspace packages', async () => {
        await using fixture = await createFixture({
          ...nodeModule('cjs-pkg', cjsPackage, 'packages'),
          'website/config.ts': configContent,
        });
        await fixture.symlink(
          'packages/cjs-pkg',
          'website/node_modules/cjs-pkg',
        );
        await expectSameInstance(fixture, 'website/config.ts');
      });
    });
  });

  describe('default export interop', () => {
    it('handles ESM default + named exports', async () => {
      await using fixture = await createFixture({
        'plugin.ts': dedent`
          export default function plugin() { return {name: 'esm'}; }
          export function validateOptions() { return 'options'; }
        `,
      });
      const module = await fixture.load('plugin.ts');
      const view = pluginView(module);
      expect(view.plugin()).toEqual({name: 'esm'});
      expect(view.validateOptions()).toBe('options');
      expect(view.validateThemeConfig).toBeUndefined();
      const defaultExport = await fixture.load('plugin.ts', {default: true});
      expect((defaultExport as () => unknown)()).toEqual({name: 'esm'});
    });

    it('handles CJS module.exports function with static properties', async () => {
      await using fixture = await createFixture({
        'plugin.js': dedent`
          module.exports = function plugin() { return {name: 'cjs'}; };
          module.exports.validateOptions = () => 'options';
        `,
      });
      const module = await fixture.load('plugin.js');
      const view = pluginView(module);
      expect(view.plugin()).toEqual({name: 'cjs'});
      expect(view.validateOptions()).toBe('options');
      const defaultExport = await fixture.load('plugin.js', {default: true});
      expect((defaultExport as () => unknown)()).toEqual({name: 'cjs'});
    });

    // This is how all our own plugins/themes/presets are published
    it('handles CJS compiled by tsc (__esModule + exports.default)', async () => {
      await using fixture = await createFixture({
        ...{
          'node_modules/tsc-plugin/package.json': dedent`
            {"name": "tsc-plugin", "main": "lib/index.js"}
          `,
          'node_modules/tsc-plugin/lib/index.js': dedent`
            "use strict";
            Object.defineProperty(exports, "__esModule", { value: true });
            exports.default = plugin;
            exports.validateOptions = validateOptions;
            function plugin() { return {name: 'tsc'}; }
            function validateOptions() { return 'options'; }
          `,
        },
      });
      const module = await fixture.load('node_modules/tsc-plugin/lib/index.js');
      const view = pluginView(module);
      expect(view.plugin()).toEqual({name: 'tsc'});
      expect(view.validateOptions()).toBe('options');
      const defaultExport = await fixture.load(
        'node_modules/tsc-plugin/lib/index.js',
        {default: true},
      );
      expect((defaultExport as () => unknown)()).toEqual({name: 'tsc'});
    });

    it('handles ESM without default export', async () => {
      await using fixture = await createFixture({
        'sidebars.ts': dedent`
          export const sidebar = ['doc'];
        `,
      });
      const module = await fixture.load('sidebars.ts', {default: true});
      expect(module.sidebar).toEqual(['doc']);
    });

    // Without __esModule, a "default" key is not unwrapped
    it('handles CJS module.exports = {default}', async () => {
      await using fixture = await createFixture({
        'config.js': dedent`
          module.exports = {default: {title: 'nested'}, other: 42};
        `,
      });
      await expect(fixture.load('config.js', {default: true})).resolves.toEqual(
        {default: {title: 'nested'}, other: 42},
      );
    });
  });

  describe('module graph re-evaluation', () => {
    it('re-evaluates the entry and its local dependencies on every load', async () => {
      await using fixture = await createFixture({
        'sidebars.ts': dedent`
          import dep from './dep';
          const g = globalThis as any;
          g.__entryEvaluations = (g.__entryEvaluations ?? 0) + 1;
          export default {entry: g.__entryEvaluations, dep};
        `,
        'dep.ts': dedent`
          const g = globalThis as any;
          g.__depEvaluations = (g.__depEvaluations ?? 0) + 1;
          export default g.__depEvaluations;
        `,
      });
      try {
        // Real-world use-case: sidebars computed from the file system
        await expect(
          fixture.load('sidebars.ts', {default: true}),
        ).resolves.toEqual({entry: 1, dep: 1});
        await expect(
          fixture.load('sidebars.ts', {default: true}),
        ).resolves.toEqual({entry: 2, dep: 2});
      } finally {
        // @ts-expect-error: test globals
        delete globalThis.__entryEvaluations;
        // @ts-expect-error: test globals
        delete globalThis.__depEvaluations;
      }
    });

    it('evaluates a shared dependency only once per load', async () => {
      await using fixture = await createFixture({
        'config.ts': dedent`
          import a from './a';
          import b from './b';
          export default {same: a === b};
        `,
        'a.ts': `import shared from './shared';\nexport default shared;`,
        'b.ts': `import shared from './shared';\nexport default shared;`,
        'shared.ts': `export default {};`,
      });
      await expect(fixture.load('config.ts', {default: true})).resolves.toEqual(
        {same: true},
      );
    });

    it('returns fresh export instances on every load', async () => {
      await using fixture = await createFixture({
        'config.ts': `export default {};`,
      });
      const config1 = await fixture.load('config.ts', {default: true});
      const config2 = await fixture.load('config.ts', {default: true});
      expect(config1).not.toBe(config2);
    });
  });

  describe('hot reload', () => {
    type Files = {[fileName: string]: (version: number) => string};

    async function testReload({
      files,
      entry,
      dependency,
    }: {
      files: Files;
      entry: string;
      dependency: string;
    }) {
      const write = (version: number, only?: string) =>
        Object.fromEntries(
          Object.entries(files)
            .filter(([fileName]) => !only || only === fileName)
            .map(([fileName, content]) => [fileName, content(version)]),
        );
      await using fixture = await createFixture(write(1));
      const load = () =>
        fixture.load(entry, {default: true}).then((m) => `${m.entry}/${m.dep}`);

      await expect(load()).resolves.toBe('e1/d1');

      await fixture.write(dependency, write(2, dependency)[dependency]!);
      await expect(load()).resolves.toBe('e1/d2');

      await fixture.write(entry, write(3, entry)[entry]!);
      await expect(load()).resolves.toBe('e3/d2');
    }

    it('reloads .ts entry with .ts dependency', () =>
      testReload({
        entry: 'config.ts',
        dependency: 'navbar.ts',
        files: {
          'config.ts': (v) =>
            `import dep from './navbar';\nexport default {entry: 'e${v}', dep};`,
          'navbar.ts': (v) => `export default 'd${v}' as string;`,
        },
      }));

    it('reloads .ts entry with nested .ts dependencies', () =>
      testReload({
        entry: 'config.ts',
        dependency: 'config/deep/item.ts',
        files: {
          'config.ts': (v) =>
            `import dep from './config/navbar';\nexport default {entry: 'e${v}', dep};`,
          'config/navbar.ts': () =>
            `import item from './deep/item';\nexport default item;`,
          'config/deep/item.ts': (v) => `export default 'd${v}' as string;`,
        },
      }));

    it('reloads .mts entry with .mts dependency', () =>
      testReload({
        entry: 'config.mts',
        dependency: 'navbar.mts',
        files: {
          'config.mts': (v) =>
            `import dep from './navbar.mts';\nexport default {entry: 'e${v}', dep};`,
          'navbar.mts': (v) => `export default 'd${v}' as string;`,
        },
      }));

    it('reloads .cts entry with .cts dependency', () =>
      testReload({
        entry: 'config.cts',
        dependency: 'navbar.cts',
        files: {
          'config.cts': (v) =>
            `const dep = require('./navbar.cts');\nmodule.exports = {entry: 'e${v}', dep};`,
          'navbar.cts': (v) => `module.exports = 'd${v}' as string;`,
        },
      }));

    it('reloads ESM .js entry with ESM .js dependency', () =>
      testReload({
        entry: 'config.js',
        dependency: 'navbar.js',
        files: {
          'config.js': (v) =>
            `import dep from './navbar';\nexport default {entry: 'e${v}', dep};`,
          'navbar.js': (v) => `export default 'd${v}';`,
        },
      }));

    it('reloads .ts sidebars with .ts dependency', () =>
      testReload({
        entry: 'sidebars.ts',
        dependency: 'sidebars/items.ts',
        files: {
          'sidebars.ts': (v) =>
            `import dep from './sidebars/items';\nexport default {entry: 'e${v}', dep};`,
          'sidebars/items.ts': (v) => `export default 'd${v}' as string;`,
        },
      }));

    // Known limitations of the current jiti-based implementation:
    // jiti only re-evaluates modules it transpiles (TS, or JS with ESM syntax)
    // Modules it can load natively are cached by Node.js forever
    // Turn these into regular tests once fixed
    describe('known limitations', () => {
      it.fails('reloads CJS .js entry with CJS .js dependency', () =>
        testReload({
          entry: 'config.js',
          dependency: 'navbar.js',
          files: {
            'config.js': (v) =>
              `const dep = require('./navbar');\nmodule.exports = {entry: 'e${v}', dep};`,
            'navbar.js': (v) => `module.exports = 'd${v}';`,
          },
        }));

      it.fails('reloads .cjs entry with .cjs dependency', () =>
        testReload({
          entry: 'config.cjs',
          dependency: 'navbar.cjs',
          files: {
            'config.cjs': (v) =>
              `const dep = require('./navbar.cjs');\nmodule.exports = {entry: 'e${v}', dep};`,
            'navbar.cjs': (v) => `module.exports = 'd${v}';`,
          },
        }));

      it.fails('reloads .mjs entry with .mjs dependency', () =>
        testReload({
          entry: 'config.mjs',
          dependency: 'navbar.mjs',
          files: {
            'config.mjs': (v) =>
              `import dep from './navbar.mjs';\nexport default {entry: 'e${v}', dep};`,
            'navbar.mjs': (v) => `export default 'd${v}';`,
          },
        }));

      it.fails('reloads .js entry in a "type: module" package', () =>
        testReload({
          entry: 'config.js',
          dependency: 'navbar.js',
          files: {
            'package.json': () => '{"type": "module"}',
            'config.js': (v) =>
              `import dep from './navbar.js';\nexport default {entry: 'e${v}', dep};`,
            'navbar.js': (v) => `export default 'd${v}';`,
          },
        }));

      it.fails('reloads .ts entry with CJS .js dependency', () =>
        testReload({
          entry: 'config.ts',
          dependency: 'navbar.js',
          files: {
            'config.ts': (v) =>
              `import dep from './navbar';\nexport default {entry: 'e${v}', dep};`,
            'navbar.js': (v) => `module.exports = 'd${v}';`,
          },
        }));

      it.fails('reloads .ts entry with .json dependency', () =>
        testReload({
          entry: 'config.ts',
          dependency: 'navbar.json',
          files: {
            'config.ts': (v) =>
              `import dep from './navbar.json';\nexport default {entry: 'e${v}', dep: dep.value};`,
            'navbar.json': (v) => `{"value": "d${v}"}`,
          },
        }));
    });
  });

  describe('errors', () => {
    it('reports syntax errors in entry', async () => {
      await using fixture = await createFixture({
        'config.ts': `export default {title: 'oops';`,
      });
      await expect(loadErrorChain(fixture, 'config.ts')).resolves
        .toMatchInlineSnapshot(`
        "[Error: Docusaurus could not load module at path "<FIXTURE_DIR>/config.ts"]
        Cause: [Error: ParseError: Unexpected token, expected ","
         <FIXTURE_DIR>/config.ts:1:29]"
      `);
    });

    it('reports syntax errors in dependency', async () => {
      await using fixture = await createFixture({
        'config.ts': `import dep from './dep';\nexport default {dep};`,
        'dep.ts': `export default {title: 'oops';`,
      });
      await expect(loadErrorChain(fixture, 'config.ts')).resolves
        .toMatchInlineSnapshot(`
        "[Error: Docusaurus could not load module at path "<FIXTURE_DIR>/config.ts"]
        Cause: [Error: ParseError: Unexpected token, expected ","
         <FIXTURE_DIR>/dep.ts:1:29]"
      `);
    });

    it('reports syntax errors in .mjs entry', async () => {
      await using fixture = await createFixture({
        'config.mjs': `export default {title: 'oops';`,
      });
      await expect(loadErrorChain(fixture, 'config.mjs')).resolves
        .toMatchInlineSnapshot(`
        "[Error: Docusaurus could not load module at path "<FIXTURE_DIR>/config.mjs"]
        Cause: [Error: ParseError: Unexpected token, expected ","
         <FIXTURE_DIR>/config.mjs:1:29]"
      `);
    });

    it('reports missing relative import', async () => {
      await using fixture = await createFixture({
        'config.ts': `import dep from './missing';\nexport default {dep};`,
      });
      await expect(loadErrorChain(fixture, 'config.ts')).resolves
        .toMatchInlineSnapshot(`
        "[Error: Docusaurus could not load module at path "<FIXTURE_DIR>/config.ts"]
        Cause: [Error: Cannot find module './missing'
        Require stack:
        - <FIXTURE_DIR>/config.ts]"
      `);
    });

    it('reports missing package import', async () => {
      await using fixture = await createFixture({
        'config.ts': `import dep from 'missing-pkg';\nexport default {dep};`,
      });
      await expect(loadErrorChain(fixture, 'config.ts')).resolves
        .toMatchInlineSnapshot(`
        "[Error: Docusaurus could not load module at path "<FIXTURE_DIR>/config.ts"]
        Cause: [Error: Cannot find module 'missing-pkg'
        Require stack:
        - <FIXTURE_DIR>/config.ts]"
      `);
    });

    it('reports runtime errors', async () => {
      await using fixture = await createFixture({
        'config.ts': `import './dep';\nexport default {};`,
        'dep.ts': `throw new Error('Runtime error in dep');`,
      });
      await expect(loadErrorChain(fixture, 'config.ts')).resolves
        .toMatchInlineSnapshot(`
        "[Error: Docusaurus could not load module at path "<FIXTURE_DIR>/config.ts"]
        Cause: [Error: Runtime error in dep]"
      `);
    });

    it('preserves original runtime error as cause', async () => {
      await using fixture = await createFixture({
        'config.ts': `throw new TypeError('Original error');`,
      });
      const error = (await fixture.load('config.ts').catch((e) => e)) as Error;
      expect(error.cause).toBeInstanceOf(TypeError);
      expect((error.cause as Error).message).toBe('Original error');
    });
  });
});
