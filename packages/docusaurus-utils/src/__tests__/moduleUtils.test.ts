/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp-promise';
import dedent from 'dedent';
import {loadFreshModule} from '../moduleUtils';

async function createTmpDir() {
  return (
    await tmp.dir({
      prefix: 'jest-tmp-moduleUtils-tests',
    })
  ).path;
}

async function moduleGraphHelpers() {
  const dir = await createTmpDir();

  async function fileHelper(name: string, initialContent?: string) {
    const filePath = path.resolve(dir, name);
    if (initialContent) {
      await fs.outputFile(filePath, initialContent);
    }
    return {
      filePath,
      write: (content: string) => fs.outputFile(filePath, content),
      load: () => loadFreshModule(filePath),
    };
  }

  return {fileHelper};
}

async function loadFixtureModule(fixtureName: string) {
  return loadFreshModule(
    path.resolve(__dirname, '__fixtures__/moduleUtils', fixtureName),
  );
}

describe('loadFreshModule', () => {
  describe('can load CJS user module', () => {
    async function testUserFixture(fixtureName: string) {
      const userFixturePath = `user/${fixtureName}`;
      const userModule = await loadFixtureModule(userFixturePath);
      expect(userModule).toEqual({
        birthYear: 1986,
        firstName: 'Sebastien',
        lastName: 'Lorber',
      });
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
      const userModule = await loadFixtureModule(userFixturePath);
      expect(userModule).toEqual({
        birthYear: 1986,
        firstName: 'Sebastien',
        lastName: 'Lorber',
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
      const {fileHelper} = await moduleGraphHelpers();

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
          export default {dep2Val: "dep2 val"} satisfies {dep2Val: string}
        `,
      );

      const entryFile = await fileHelper(
        'entry.js',
        /* language=js */
        dedent`
        import dependency1 from "./dependency1";
        import dependency2 from "./dependency2";

        export default {
          someEntryValue: "entryVal",
          dependency1,
          dependency2
        };
        `,
      );

      // Should be able to read the initial module graph
      await expect(entryFile.load()).resolves.toEqual({
        someEntryValue: 'entryVal',
        dependency1: {
          dep1Export: 'dep1 val1',
          dep1Val: 'dep1 val2',
        },
        dependency2: {
          dep2Val: 'dep2 val',
        },
      });
      await expect(dependency1.load()).resolves.toEqual({
        dep1Export: 'dep1 val1',
        dep1Val: 'dep1 val2',
      });
      await expect(dependency2.load()).resolves.toEqual({
        dep2Val: 'dep2 val',
      });

      // Should be able to read the module graph again after updates
      await dependency1.write(
        /* language=js */
        dedent`
          export const dep1Export = "dep1 val1 updated";

          export default {dep1Val: "dep1 val2 updated"}
        `,
      );
      await expect(entryFile.load()).resolves.toEqual({
        someEntryValue: 'entryVal',
        dependency1: {
          dep1Export: 'dep1 val1 updated',
          dep1Val: 'dep1 val2 updated',
        },
        dependency2: {
          dep2Val: 'dep2 val',
        },
      });
      await expect(dependency1.load()).resolves.toEqual({
        dep1Export: 'dep1 val1 updated',
        dep1Val: 'dep1 val2 updated',
      });
      await expect(dependency2.load()).resolves.toEqual({
        dep2Val: 'dep2 val',
      });

      // Should be able to read the module graph again after updates
      await dependency2.write(
        /* language=ts */
        dedent`
          export default {dep2Val: "dep2 val updated"} satisfies {dep2Val: string}
        `,
      );
      await expect(entryFile.load()).resolves.toEqual({
        someEntryValue: 'entryVal',
        dependency1: {
          dep1Export: 'dep1 val1 updated',
          dep1Val: 'dep1 val2 updated',
        },
        dependency2: {
          dep2Val: 'dep2 val updated',
        },
      });
      await expect(dependency1.load()).resolves.toEqual({
        dep1Export: 'dep1 val1 updated',
        dep1Val: 'dep1 val2 updated',
      });
      await expect(dependency2.load()).resolves.toEqual({
        dep2Val: 'dep2 val updated',
      });

      // Should be able to read the module graph again after updates
      await entryFile.write(
        /* language=js */
        dedent`
        import dependency1 from "./dependency1";
        import dependency2 from "./dependency2";

        export default {
          someEntryValue: "entryVal updated",
          dependency1,
          dependency2,
          newAttribute: "is there"
        }
        `,
      );
      await expect(entryFile.load()).resolves.toEqual({
        someEntryValue: 'entryVal updated',
        newAttribute: 'is there',
        dependency1: {
          dep1Export: 'dep1 val1 updated',
          dep1Val: 'dep1 val2 updated',
        },
        dependency2: {
          dep2Val: 'dep2 val updated',
        },
      });
      await expect(dependency1.load()).resolves.toEqual({
        dep1Export: 'dep1 val1 updated',
        dep1Val: 'dep1 val2 updated',
      });
      await expect(dependency2.load()).resolves.toEqual({
        dep2Val: 'dep2 val updated',
      });
    });
  });

  describe('invalid module path param', () => {
    it('throws if module path does not exist', async () => {
      await expect(() => loadFreshModule('/some/unknown/module/path.js'))
        .rejects.toThrowErrorMatchingInlineSnapshot(`
        "Docusaurus could not load module at path "/some/unknown/module/path.js"
        Cause: Cannot find module '/some/unknown/module/path.js' from 'packages/docusaurus-utils/src/moduleUtils.ts'"
      `);
    });

    it('throws if module path is undefined', async () => {
      await expect(() =>
        // @ts-expect-error: undefined is invalid
        loadFreshModule(undefined),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Invalid module path of type "undefined" with value "undefined""`,
      );
    });

    it('throws if module path is null', async () => {
      await expect(() =>
        // @ts-expect-error: null is invalid
        loadFreshModule(null),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Invalid module path of type "object" with value "null""`,
      );
    });

    it('throws if module path is number', async () => {
      await expect(() =>
        // @ts-expect-error: number is invalid
        loadFreshModule(42),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Invalid module path of type "number" with value "42""`,
      );
    });

    it('throws if module path is object', async () => {
      await expect(() =>
        // @ts-expect-error: object is invalid
        loadFreshModule({}),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Invalid module path of type "object" with value "[object Object]""`,
      );
    });
  });
});
