/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {cliDocsVersionCommand} from '../cli';
import {PathOptions, SidebarOptions} from '../types';
import fs from 'fs-extra';
import {
  getVersionedDocsDirPath,
  getVersionsFilePath,
  getVersionedSidebarsDirPath,
} from '../versions';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';

const fixtureDir = path.join(__dirname, '__fixtures__');

describe('docsVersion', () => {
  const simpleSiteDir = path.join(fixtureDir, 'simple-site');
  const versionedSiteDir = path.join(fixtureDir, 'versioned-site');

  const DEFAULT_OPTIONS: PathOptions & SidebarOptions = {
    path: 'docs',
    sidebarPath: '',
    sidebarCollapsed: true,
    sidebarCollapsible: true,
  };

  test('no version tag provided', () => {
    expect(() =>
      cliDocsVersionCommand(
        null,
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0."`,
    );
    expect(() =>
      cliDocsVersionCommand(
        undefined,
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0."`,
    );
    expect(() =>
      cliDocsVersionCommand(
        '',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0."`,
    );
  });

  test('version tag should not have slash', () => {
    expect(() =>
      cliDocsVersionCommand(
        'foo/bar',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Do not include slash (/) or backslash (\\\\). Try something like: 1.0.0."`,
    );
    expect(() =>
      cliDocsVersionCommand(
        'foo\\bar',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Do not include slash (/) or backslash (\\\\). Try something like: 1.0.0."`,
    );
  });

  test('version tag should not be too long', () => {
    expect(() =>
      cliDocsVersionCommand(
        'a'.repeat(255),
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Length cannot exceed 32 characters. Try something like: 1.0.0."`,
    );
  });

  test('version tag should not be a dot or two dots', () => {
    expect(() =>
      cliDocsVersionCommand(
        '..',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Do not name your version \\".\\" or \\"..\\". Try something like: 1.0.0."`,
    );
    expect(() =>
      cliDocsVersionCommand(
        '.',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Do not name your version \\".\\" or \\"..\\". Try something like: 1.0.0."`,
    );
  });

  test('version tag should be a valid pathname', () => {
    expect(() =>
      cliDocsVersionCommand(
        '<foo|bar>',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0."`,
    );
    expect(() =>
      cliDocsVersionCommand(
        'foo\x00bar',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0."`,
    );
    expect(() =>
      cliDocsVersionCommand(
        'foo:bar',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0."`,
    );
  });

  test('version tag already exist', () => {
    expect(() =>
      cliDocsVersionCommand(
        '1.0.0',
        versionedSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: this version already exists! Use a version tag that does not already exist."`,
    );
  });

  test('no docs file to version', () => {
    const emptySiteDir = path.join(fixtureDir, 'empty-site');
    expect(() =>
      cliDocsVersionCommand(
        '1.0.0',
        emptySiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"[docs]: there is no docs to version!"`,
    );
  });

  test('first time versioning', () => {
    const copyMock = jest.spyOn(fs, 'copySync').mockImplementation();
    const ensureMock = jest.spyOn(fs, 'ensureDirSync').mockImplementation();
    const writeMock = jest.spyOn(fs, 'writeFileSync');
    let versionedSidebar;
    let versionedSidebarPath;
    writeMock.mockImplementationOnce((filepath, content) => {
      versionedSidebarPath = filepath;
      versionedSidebar = JSON.parse(content as string);
    });
    let versionsPath;
    let versions;
    writeMock.mockImplementationOnce((filepath, content) => {
      versionsPath = filepath;
      versions = JSON.parse(content as string);
    });
    const consoleMock = jest.spyOn(console, 'log').mockImplementation();
    const options = {
      ...DEFAULT_OPTIONS,
      sidebarPath: path.join(simpleSiteDir, 'sidebars.json'),
    };
    cliDocsVersionCommand('1.0.0', simpleSiteDir, DEFAULT_PLUGIN_ID, options);
    expect(copyMock).toHaveBeenCalledWith(
      path.join(simpleSiteDir, options.path),
      path.join(
        getVersionedDocsDirPath(simpleSiteDir, DEFAULT_PLUGIN_ID),
        'version-1.0.0',
      ),
    );
    expect(versionedSidebar).toMatchSnapshot();
    expect(versionedSidebarPath).toEqual(
      path.join(
        getVersionedSidebarsDirPath(simpleSiteDir, DEFAULT_PLUGIN_ID),
        'version-1.0.0-sidebars.json',
      ),
    );
    expect(versionsPath).toEqual(
      getVersionsFilePath(simpleSiteDir, DEFAULT_PLUGIN_ID),
    );
    expect(versions).toEqual(['1.0.0']);
    expect(consoleMock).toHaveBeenCalledWith('[docs]: version 1.0.0 created!');

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
      versionedSidebar = JSON.parse(content as string);
    });
    let versionsPath;
    let versions;
    writeMock.mockImplementationOnce((filepath, content) => {
      versionsPath = filepath;
      versions = JSON.parse(content as string);
    });
    const consoleMock = jest.spyOn(console, 'log').mockImplementation();
    const options = {
      ...DEFAULT_OPTIONS,
      sidebarPath: path.join(versionedSiteDir, 'sidebars.json'),
    };
    cliDocsVersionCommand(
      '2.0.0',
      versionedSiteDir,
      DEFAULT_PLUGIN_ID,
      options,
    );
    expect(copyMock).toHaveBeenCalledWith(
      path.join(versionedSiteDir, options.path),
      path.join(
        getVersionedDocsDirPath(versionedSiteDir, DEFAULT_PLUGIN_ID),
        'version-2.0.0',
      ),
    );
    expect(versionedSidebar).toMatchSnapshot();
    expect(versionedSidebarPath).toEqual(
      path.join(
        getVersionedSidebarsDirPath(versionedSiteDir, DEFAULT_PLUGIN_ID),
        'version-2.0.0-sidebars.json',
      ),
    );
    expect(versionsPath).toEqual(
      getVersionsFilePath(versionedSiteDir, DEFAULT_PLUGIN_ID),
    );
    expect(versions).toEqual(['2.0.0', '1.0.1', '1.0.0', 'withSlugs']);
    expect(consoleMock).toHaveBeenCalledWith('[docs]: version 2.0.0 created!');

    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
    ensureMock.mockRestore();
  });

  test('second docs instance versioning', () => {
    const pluginId = 'community';

    const copyMock = jest.spyOn(fs, 'copySync').mockImplementation();
    const ensureMock = jest.spyOn(fs, 'ensureDirSync').mockImplementation();
    const writeMock = jest.spyOn(fs, 'writeFileSync');
    let versionedSidebar;
    let versionedSidebarPath;
    writeMock.mockImplementationOnce((filepath, content) => {
      versionedSidebarPath = filepath;
      versionedSidebar = JSON.parse(content as string);
    });
    let versionsPath;
    let versions;
    writeMock.mockImplementationOnce((filepath, content) => {
      versionsPath = filepath;
      versions = JSON.parse(content as string);
    });
    const consoleMock = jest.spyOn(console, 'log').mockImplementation();
    const options = {
      ...DEFAULT_OPTIONS,
      path: 'community',
      sidebarPath: path.join(versionedSiteDir, 'community_sidebars.json'),
    };
    cliDocsVersionCommand('2.0.0', versionedSiteDir, pluginId, options);
    expect(copyMock).toHaveBeenCalledWith(
      path.join(versionedSiteDir, options.path),
      path.join(
        getVersionedDocsDirPath(versionedSiteDir, pluginId),
        'version-2.0.0',
      ),
    );
    expect(versionedSidebar).toMatchSnapshot();
    expect(versionedSidebarPath).toEqual(
      path.join(
        getVersionedSidebarsDirPath(versionedSiteDir, pluginId),
        'version-2.0.0-sidebars.json',
      ),
    );
    expect(versionsPath).toEqual(
      getVersionsFilePath(versionedSiteDir, pluginId),
    );
    expect(versions).toEqual(['2.0.0', '1.0.0']);
    expect(consoleMock).toHaveBeenCalledWith(
      '[community]: version 2.0.0 created!',
    );

    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
    ensureMock.mockRestore();
  });
});
