/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import fs from 'fs-extra';
import {posixPath} from '@docusaurus/utils';
import {migrateDocusaurusProject} from '../index';

async function testMigration(siteDir: string, newDir: string) {
  const writeMock = jest.spyOn(fs, 'outputFile').mockImplementation(() => {});
  const mkdirpMock = jest.spyOn(fs, 'mkdirp').mockImplementation(() => {});
  const mkdirsMock = jest.spyOn(fs, 'mkdirs').mockImplementation(() => {});
  const copyMock = jest.spyOn(fs, 'copy').mockImplementation(() => {});
  await migrateDocusaurusProject(siteDir, newDir, true, true);
  expect(
    writeMock.mock.calls.sort((a, b) =>
      posixPath(a[0]).localeCompare(posixPath(b[0])),
    ),
  ).toMatchSnapshot('write');
  expect(
    mkdirpMock.mock.calls.sort((a, b) =>
      posixPath(a[0]).localeCompare(posixPath(b[0])),
    ),
  ).toMatchSnapshot('mkdirp');
  expect(
    mkdirsMock.mock.calls.sort((a, b) =>
      posixPath(a[0]).localeCompare(posixPath(b[0])),
    ),
  ).toMatchSnapshot('mkdirs');
  expect(
    copyMock.mock.calls.sort((a, b) =>
      posixPath(a[0]).localeCompare(posixPath(b[0])),
    ),
  ).toMatchSnapshot('copy');
  writeMock.mockRestore();
  mkdirpMock.mockRestore();
  mkdirsMock.mockRestore();
  copyMock.mockRestore();
}

describe('migration CLI', () => {
  const fixtureDir = path.join(__dirname, '__fixtures__');
  it('migrates simple website', async () => {
    const siteDir = path.join(fixtureDir, 'simple_website', 'website');
    const newDir = path.join(fixtureDir, 'migrated_simple_site');
    await testMigration(siteDir, newDir);
  });

  it('migrates complex website', async () => {
    const siteDir = path.join(fixtureDir, 'complex_website', 'website');
    const newDir = path.join(fixtureDir, 'migrated_complex_site');
    await testMigration(siteDir, newDir);
  });

  it('migrates missing versions', async () => {
    const siteDir = path.join(fixtureDir, 'missing_version_website', 'website');
    const newDir = path.join(fixtureDir, 'migrated_missing_version_site');
    await testMigration(siteDir, newDir);
  });
});
