/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {getAuthorsMapFilePath} from '../authors';
import path from 'path';

describe('getAuthorsMapFilePath', () => {
  const fixturesDir = path.join(
    __dirname,
    '__fixtures__/getAuthorsMapFilePath',
  );
  const contentPathYml1 = path.join(fixturesDir, 'contentPathYml1');
  const contentPathYml2 = path.join(fixturesDir, 'contentPathYml2');
  const contentPathJson1 = path.join(fixturesDir, 'contentPathJson1');
  const contentPathJson2 = path.join(fixturesDir, 'contentPathJson2');
  const contentPathEmpty = path.join(fixturesDir, 'contentPathEmpty');
  const contentPathNestedYml = path.join(fixturesDir, 'contentPathNestedYml');

  test('getAuthorsMapFilePath returns localized Yml path in priority', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathYml1,
          contentPath: contentPathYml2,
        },
      }),
    ).toEqual(path.join(contentPathYml1, 'authors.yml'));
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathYml2,
          contentPath: contentPathYml1,
        },
      }),
    ).toEqual(path.join(contentPathYml2, 'authors.yml'));
  });

  test('getAuthorsMapFilePath returns localized Json path in priority', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathJson1,
          contentPath: contentPathJson2,
        },
      }),
    ).toEqual(path.join(contentPathJson1, 'authors.json'));
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathJson2,
          contentPath: contentPathJson1,
        },
      }),
    ).toEqual(path.join(contentPathJson2, 'authors.json'));
  });

  test('getAuthorsMapFilePath returns unlocalized Yml path as fallback', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathYml2,
        },
      }),
    ).toEqual(path.join(contentPathYml2, 'authors.yml'));
  });

  test('getAuthorsMapFilePath returns unlocalized Json path as fallback', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathJson1,
        },
      }),
    ).toEqual(path.join(contentPathJson1, 'authors.json'));
  });

  test('getAuthorsMapFilePath can return undefined (file not found)', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.json',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathYml1,
        },
      }),
    ).toBeUndefined();
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathJson1,
        },
      }),
    ).toBeUndefined();
  });

  test('getAuthorsMapFilePath can return nested path', async () => {
    expect(
      await getAuthorsMapFilePath({
        authorsMapPath: 'sub/folder/authors.yml',
        contentPaths: {
          contentPathLocalized: contentPathEmpty,
          contentPath: contentPathNestedYml,
        },
      }),
    ).toEqual(path.join(contentPathNestedYml, 'sub/folder/authors.yml'));
  });
});
