/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {migrateDocusaurusProject} from '../index';
import path from 'path';
import fs from 'fs-extra';

async function testMigration(
  siteDir: string,
  newDir: string,
  fixtureDir: string,
) {
  const writeMock = jest.spyOn(fs, 'writeFile').mockImplementation();
  const mkdirpMock = jest.spyOn(fs, 'mkdirp').mockImplementation();
  const mkdirsMock = jest.spyOn(fs, 'mkdirs').mockImplementation();
  const copyMock = jest.spyOn(fs, 'copy').mockImplementation();
  await migrateDocusaurusProject(siteDir, newDir);
  expect(
    JSON.stringify(writeMock.mock.calls).replace(
      new RegExp(fixtureDir, 'g'),
      '[fixtureDir]',
    ),
  ).toMatchSnapshot('write');
  expect(
    JSON.stringify(mkdirpMock.mock.calls).replace(
      new RegExp(fixtureDir, 'g'),
      '[fixtureDir]',
    ),
  ).toMatchSnapshot('mkdirp');
  expect(
    JSON.stringify(mkdirsMock.mock.calls).replace(
      new RegExp(fixtureDir, 'g'),
      '[fixtureDir]',
    ),
  ).toMatchSnapshot('mkdirs');
  expect(
    JSON.stringify(copyMock.mock.calls).replace(
      new RegExp(fixtureDir, 'g'),
      '[fixtureDir]',
    ),
  ).toMatchSnapshot('copy');
  writeMock.mockRestore();
  mkdirpMock.mockRestore();
  mkdirsMock.mockRestore();
  copyMock.mockRestore();
}

describe('migration test', () => {
  const fixtureDir = path.join(__dirname, '__fixtures__');
  test('simple website', async () => {
    const siteDir = path.join(fixtureDir, 'simple_website', 'website');
    const newDir = path.join(__dirname, '__fixtures__', 'migrated_simple_site');
    await testMigration(siteDir, newDir, fixtureDir);
  });
  test('complex website', async () => {
    const siteDir = path.join(fixtureDir, 'complex_website', 'website');
    const newDir = path.join(fixtureDir, 'migrated_complex_site');
    await testMigration(siteDir, newDir, fixtureDir);
  });

  test('missing versions', async () => {
    const siteDir = path.join(fixtureDir, 'missing_version_website', 'website');
    const newDir = path.join(fixtureDir, 'migrated_missing_version_site');
    await testMigration(siteDir, newDir, fixtureDir);
  });
});
