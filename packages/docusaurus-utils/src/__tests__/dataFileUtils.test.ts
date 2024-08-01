/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  findFolderContainingFile,
  getFolderContainingFile,
  getDataFilePath,
  readDataFile,
} from '../dataFileUtils';

describe('getDataFilePath', () => {
  const fixturesDir = path.join(__dirname, '__fixtures__/dataFiles');
  const contentPathYml1 = path.join(fixturesDir, 'contentPathYml1');
  const contentPathYml2 = path.join(fixturesDir, 'contentPathYml2');
  const contentPathJson1 = path.join(fixturesDir, 'contentPathJson1');
  const contentPathJson2 = path.join(fixturesDir, 'contentPathJson2');
  const contentPathEmpty = path.join(fixturesDir, 'contentPathEmpty');
  const contentPathNestedYml = path.join(fixturesDir, 'contentPathNestedYml');

  it('getDataFilePath returns localized Yml path in priority', async () => {
    await expect(
      getDataFilePath({
        filePath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathYml1,
          contentPath: contentPathYml2,
        },
      }),
    ).resolves.toEqual(path.join(contentPathYml1, 'authors.yml'));
    await expect(
      getDataFilePath({
        filePath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathYml2,
          contentPath: contentPathYml1,
        },
      }),
    ).resolves.toEqual(path.join(contentPathYml2, 'authors.yml'));
  });

  it('getDataFilePath returns localized Json path in priority', async () => {
    await expect(
      getDataFilePath({
        filePath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathJson1,
          contentPath: contentPathJson2,
        },
      }),
    ).resolves.toEqual(path.join(contentPathJson1, 'authors.json'));
    await expect(
      getDataFilePath({
        filePath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathJson2,
          contentPath: contentPathJson1,
        },
      }),
    ).resolves.toEqual(path.join(contentPathJson2, 'authors.json'));
  });

  it('getDataFilePath returns unlocalized Yml path as fallback', async () => {
    await expect(
      getDataFilePath({
        filePath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathYml2,
        },
      }),
    ).resolves.toEqual(path.join(contentPathYml2, 'authors.yml'));
  });

  it('getDataFilePath returns unlocalized Json path as fallback', async () => {
    await expect(
      getDataFilePath({
        filePath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathJson1,
        },
      }),
    ).resolves.toEqual(path.join(contentPathJson1, 'authors.json'));
  });

  it('getDataFilePath can return undefined (file not found)', async () => {
    await expect(
      getDataFilePath({
        filePath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathYml1,
        },
      }),
    ).resolves.toBeUndefined();
    await expect(
      getDataFilePath({
        filePath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathJson1,
        },
      }),
    ).resolves.toBeUndefined();
  });

  it('getDataFilePath can return nested path', async () => {
    await expect(
      getDataFilePath({
        filePath: 'sub/folder/authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathNestedYml,
        },
      }),
    ).resolves.toEqual(
      path.join(contentPathNestedYml, 'sub/folder/authors.yml'),
    );
  });
});

describe('getDataFileData', () => {
  function testFile(filePath: string) {
    const contentPath = path.join(
      __dirname,
      '__fixtures__/dataFiles/dataFiles',
    );
    const contentPathLocalized = path.join(contentPath, 'localized');
    return readDataFile({
      filePath,
      contentPaths: {contentPath, contentPathLocalized},
    });
  }

  it('returns undefined for nonexistent file', async () => {
    await expect(testFile('nonexistent.yml')).resolves.toBeUndefined();
  });

  it('read valid json author file', async () => {
    await expect(testFile('dataFile.json')).resolves.toEqual({
      content: 'json',
    });
  });

  it('read valid yml author file using localized source in priority', async () => {
    await expect(testFile('dataFile.yml')).resolves.toEqual({
      content: 'localized yaml',
    });
  });

  it('throw for invalid file', async () => {
    await expect(
      testFile('invalid.yml'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"The file at "packages/docusaurus-utils/src/__tests__/__fixtures__/dataFiles/dataFiles/invalid.yml" looks invalid (not Yaml nor JSON)."`,
    );
  });
});

describe('findFolderContainingFile', () => {
  it('find appropriate folder', async () => {
    await expect(
      findFolderContainingFile(
        ['/foo', '/baz', __dirname, '/bar'],
        'dataFileUtils.test.ts',
      ),
    ).resolves.toEqual(__dirname);
  });

  it('return undefined if no folder contain such file', async () => {
    await expect(
      findFolderContainingFile(['/foo', '/bar', '/baz'], 'index.test.ts'),
    ).resolves.toBeUndefined();
  });
});

describe('getFolderContainingFile', () => {
  it('get appropriate folder', async () => {
    await expect(
      getFolderContainingFile(
        ['/foo', '/baz', __dirname, '/bar'],
        'dataFileUtils.test.ts',
      ),
    ).resolves.toEqual(__dirname);
  });

  it('throw if no folder contain such file', async () => {
    await expect(
      getFolderContainingFile(
        ['/foo', '/bar', '/baz'],
        'dataFileUtils.test.ts',
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
            "File "dataFileUtils.test.ts" does not exist in any of these folders:
            - /foo
            - /bar
            - /baz"
          `);
  });
});
