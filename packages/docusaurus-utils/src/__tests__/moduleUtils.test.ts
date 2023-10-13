/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import tmp from 'tmp-promise';
import {loadFreshModule} from '../moduleUtils';

async function createTmpDir() {
  return (
    await tmp.dir({
      prefix: 'jest-tmp-moduleUtils-tests',
    })
  ).path;
}

async function createModuleFile(content: string) {
  const siteDir = await createTmpDir();
  const filePath = path.join(siteDir, 'i18n/en/code.json');
  await fs.outputFile(filePath, JSON.stringify(content, null, 2));
}

async function loadFixtureModule(fixtureName: string) {
  return loadFreshModule(
    path.resolve(__dirname, '__fixtures__/moduleUtils', fixtureName),
  );
}

describe('loadFreshModule', () => {
  describe('can load fresh module', () => {
    it('todo', async () => {
      createModuleFile('');
    });
  });

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

  describe('using invalid module path param', () => {
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
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
              "Docusaurus could not load module at path "undefined"
              Cause: Invalid module path of type undefined"
          `);
    });

    it('throws if module path is null', async () => {
      await expect(() =>
        // @ts-expect-error: null is invalid
        loadFreshModule(null),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
              "Docusaurus could not load module at path "null"
              Cause: Invalid module path of type null"
          `);
    });

    it('throws if module path is number', async () => {
      await expect(() =>
        // @ts-expect-error: number is invalid
        loadFreshModule(42),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
              "Docusaurus could not load module at path "42"
              Cause: Invalid module path of type 42"
          `);
    });

    it('throws if module path is object', async () => {
      await expect(() =>
        // @ts-expect-error: object is invalid
        loadFreshModule({}),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`
              "Docusaurus could not load module at path "[object Object]"
              Cause: Invalid module path of type [object Object]"
          `);
    });
  });
});
