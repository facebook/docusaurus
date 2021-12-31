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
  getDataFileData,
} from '../dataFileUtils';

describe('getDataFilePath', () => {
  const fixturesDir = path.join(__dirname, '__fixtures__/dataFiles');
  const contentPathYml1 = path.join(fixturesDir, 'contentPathYml1');
  const contentPathYml2 = path.join(fixturesDir, 'contentPathYml2');
  const contentPathJson1 = path.join(fixturesDir, 'contentPathJson1');
  const contentPathJson2 = path.join(fixturesDir, 'contentPathJson2');
  const contentPathEmpty = path.join(fixturesDir, 'contentPathEmpty');
  const contentPathNestedYml = path.join(fixturesDir, 'contentPathNestedYml');

  test('getDataFilePath returns localized Yml path in priority', async () => {
    expect(
      await getDataFilePath({
        filePath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathYml1,
          contentPath: contentPathYml2,
        },
      }),
    ).toEqual(path.join(contentPathYml1, 'authors.yml'));
    expect(
      await getDataFilePath({
        filePath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathYml2,
          contentPath: contentPathYml1,
        },
      }),
    ).toEqual(path.join(contentPathYml2, 'authors.yml'));
  });

  test('getDataFilePath returns localized Json path in priority', async () => {
    expect(
      await getDataFilePath({
        filePath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathJson1,
          contentPath: contentPathJson2,
        },
      }),
    ).toEqual(path.join(contentPathJson1, 'authors.json'));
    expect(
      await getDataFilePath({
        filePath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathJson2,
          contentPath: contentPathJson1,
        },
      }),
    ).toEqual(path.join(contentPathJson2, 'authors.json'));
  });

  test('getDataFilePath returns unlocalized Yml path as fallback', async () => {
    expect(
      await getDataFilePath({
        filePath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathYml2,
        },
      }),
    ).toEqual(path.join(contentPathYml2, 'authors.yml'));
  });

  test('getDataFilePath returns unlocalized Json path as fallback', async () => {
    expect(
      await getDataFilePath({
        filePath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathJson1,
        },
      }),
    ).toEqual(path.join(contentPathJson1, 'authors.json'));
  });

  test('getDataFilePath can return undefined (file not found)', async () => {
    expect(
      await getDataFilePath({
        filePath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathYml1,
        },
      }),
    ).toBeUndefined();
    expect(
      await getDataFilePath({
        filePath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathJson1,
        },
      }),
    ).toBeUndefined();
  });

  test('getDataFilePath can return nested path', async () => {
    expect(
      await getDataFilePath({
        filePath: 'sub/folder/authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathNestedYml,
        },
      }),
    ).toEqual(path.join(contentPathNestedYml, 'sub/folder/authors.yml'));
  });
});

describe('getDataFileData', () => {
  const fixturesDir = path.join(__dirname, '__fixtures__/dataFiles/actualData');
  function readDataFile(filePath: string) {
    return getDataFileData(
      {
        filePath,
        contentPaths: {contentPath: fixturesDir, contentPathLocalized: ''},
        fileType: 'test',
      },
      (content) => {
        // @ts-expect-error: good enough
        if (content.a !== 1) {
          throw new Error('Nope');
        }
        return content;
      },
    );
  }

  test('read valid yml author file', async () => {
    await expect(readDataFile('valid.yml')).resolves.toEqual({a: 1});
  });

  test('read valid json author file', async () => {
    await expect(readDataFile('valid.json')).resolves.toEqual({a: 1});
  });

  test('fail to read invalid yml', async () => {
    await expect(
      readDataFile('bad.yml'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Nope"`);
  });

  test('fail to read invalid json', async () => {
    await expect(
      readDataFile('bad.json'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Nope"`);
  });
});

describe('findFolderContainingFile', () => {
  test('find appropriate folder', async () => {
    await expect(
      findFolderContainingFile(
        ['/abcdef', '/gehij', __dirname, '/klmn'],
        'index.test.ts',
      ),
    ).resolves.toEqual(__dirname);
  });

  test('return undefined if no folder contain such file', async () => {
    await expect(
      findFolderContainingFile(['/abcdef', '/gehij', '/klmn'], 'index.test.ts'),
    ).resolves.toBeUndefined();
  });
});

describe('getFolderContainingFile', () => {
  test('get appropriate folder', async () => {
    await expect(
      getFolderContainingFile(
        ['/abcdef', '/gehij', __dirname, '/klmn'],
        'index.test.ts',
      ),
    ).resolves.toEqual(__dirname);
  });

  test('throw if no folder contain such file', async () => {
    await expect(
      getFolderContainingFile(['/abcdef', '/gehij', '/klmn'], 'index.test.ts'),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
            "File \\"index.test.ts\\" does not exist in any of these folders:
            - /abcdef
            - /gehij
            - /klmn]"
          `);
  });
});
