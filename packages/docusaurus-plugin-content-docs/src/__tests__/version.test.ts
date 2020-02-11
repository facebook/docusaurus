/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs-extra';
import {docsVersion} from '../version';
import {PathOptions} from '../types';
import {
  getVersionedDocsDir,
  getVersionsJSONFile,
  getVersionedSidebarsDir,
} from '../env';

const fixtureDir = path.join(__dirname, '__fixtures__');

describe('docsVersion', () => {
  const simpleSiteDir = path.join(fixtureDir, 'simple-site');
  const versionedSiteDir = path.join(fixtureDir, 'versioned-site');
  const DEFAULT_OPTIONS: PathOptions = {
    path: 'docs',
    sidebarPath: '',
  };

  test('no version tag provided', () => {
    expect(() =>
      docsVersion(null, simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"No version tag specified!. Pass the version you wish to create as an argument. Ex: 1.0.0"`,
    );
    expect(() =>
      docsVersion(undefined, simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"No version tag specified!. Pass the version you wish to create as an argument. Ex: 1.0.0"`,
    );
    expect(() =>
      docsVersion('', simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"No version tag specified!. Pass the version you wish to create as an argument. Ex: 1.0.0"`,
    );
  });

  test('version tag should not have slash', () => {
    expect(() =>
      docsVersion('foo/bar', simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid version tag specified! Do not include slash (/) or (\\\\). Try something like: 1.0.0"`,
    );
    expect(() =>
      docsVersion('foo\\bar', simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid version tag specified! Do not include slash (/) or (\\\\). Try something like: 1.0.0"`,
    );
  });

  test('version tag should not be too long', () => {
    expect(() =>
      docsVersion('a'.repeat(255), simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid version tag specified! Length must <= 32 characters. Try something like: 1.0.0"`,
    );
  });

  test('version tag should not be a dot or two dots', () => {
    expect(() =>
      docsVersion('..', simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid version tag specified! Do not name your version \\".\\" or \\"..\\". Try something like: 1.0.0"`,
    );
    expect(() =>
      docsVersion('.', simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid version tag specified! Do not name your version \\".\\" or \\"..\\". Try something like: 1.0.0"`,
    );
  });

  test('version tag should be a valid pathname', () => {
    expect(() =>
      docsVersion('<foo|bar>', simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0"`,
    );
    expect(() =>
      docsVersion('foo\x00bar', simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0"`,
    );
    expect(() =>
      docsVersion('foo:bar', simpleSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0"`,
    );
  });

  test('version tag already exist', () => {
    expect(() =>
      docsVersion('1.0.0', versionedSiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(
      `"This version already exists!. Use a version tag that does not already exist."`,
    );
  });

  test('no docs file to version', () => {
    const emptySiteDir = path.join(fixtureDir, 'empty-site');
    expect(() =>
      docsVersion('1.0.0', emptySiteDir, DEFAULT_OPTIONS),
    ).toThrowErrorMatchingInlineSnapshot(`"There is no docs to version !"`);
  });

  test('first time versioning', () => {
    const copyMock = jest.spyOn(fs, 'copySync').mockImplementation();
    const ensureMock = jest.spyOn(fs, 'ensureDirSync').mockImplementation();
    const writeMock = jest.spyOn(fs, 'writeFileSync');
    let versionedSidebar;
    let versionedSidebarPath;
    writeMock.mockImplementationOnce((filepath, content) => {
      versionedSidebarPath = filepath;
      versionedSidebar = JSON.parse(content);
    });
    let versionsPath;
    let versions;
    writeMock.mockImplementationOnce((filepath, content) => {
      versionsPath = filepath;
      versions = JSON.parse(content);
    });
    const consoleMock = jest.spyOn(console, 'log').mockImplementation();
    const options = {
      path: 'docs',
      sidebarPath: path.join(simpleSiteDir, 'sidebars.json'),
    };
    docsVersion('1.0.0', simpleSiteDir, options);
    expect(copyMock).toHaveBeenCalledWith(
      path.join(simpleSiteDir, options.path),
      path.join(getVersionedDocsDir(simpleSiteDir), 'version-1.0.0'),
    );
    expect(versionedSidebar).toMatchSnapshot();
    expect(versionedSidebarPath).toEqual(
      path.join(
        getVersionedSidebarsDir(simpleSiteDir),
        'version-1.0.0-sidebars.json',
      ),
    );
    expect(versionsPath).toEqual(getVersionsJSONFile(simpleSiteDir));
    expect(versions).toEqual(['1.0.0']);
    expect(consoleMock).toHaveBeenCalledWith('Version 1.0.0 created!');

    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
    ensureMock.mockRestore();
  });

  test('not the first time versioning', () => {
    const copyMock = jest.spyOn(fs, 'copySync').mockImplementation();
    const ensureMock = jest.spyOn(fs, 'ensureDirSync').mockImplementation();
    const writeMock = jest.spyOn(fs, 'writeFileSync');
    let versionedSidebar;
    let versionedSidebarPath;
    writeMock.mockImplementationOnce((filepath, content) => {
      versionedSidebarPath = filepath;
      versionedSidebar = JSON.parse(content);
    });
    let versionsPath;
    let versions;
    writeMock.mockImplementationOnce((filepath, content) => {
      versionsPath = filepath;
      versions = JSON.parse(content);
    });
    const consoleMock = jest.spyOn(console, 'log').mockImplementation();
    const options = {
      path: 'docs',
      sidebarPath: path.join(versionedSiteDir, 'sidebars.json'),
    };
    docsVersion('2.0.0', versionedSiteDir, options);
    expect(copyMock).toHaveBeenCalledWith(
      path.join(versionedSiteDir, options.path),
      path.join(getVersionedDocsDir(versionedSiteDir), 'version-2.0.0'),
    );
    expect(versionedSidebar).toMatchSnapshot();
    expect(versionedSidebarPath).toEqual(
      path.join(
        getVersionedSidebarsDir(versionedSiteDir),
        'version-2.0.0-sidebars.json',
      ),
    );
    expect(versionsPath).toEqual(getVersionsJSONFile(versionedSiteDir));
    expect(versions).toEqual(['2.0.0', '1.0.1', '1.0.0']);
    expect(consoleMock).toHaveBeenCalledWith('Version 2.0.0 created!');

    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
    ensureMock.mockRestore();
  });
});
