/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import {cliDocsVersionCommand} from '../cli';
import type {
  PathOptions,
  SidebarOptions,
} from '@docusaurus/plugin-content-docs';
import fs from 'fs-extra';
import {
  getVersionedDocsDirPath,
  getVersionsFilePath,
  getVersionedSidebarsDirPath,
} from '../versions';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/utils';

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

  test('no version tag provided', async () => {
    await expect(() =>
      cliDocsVersionCommand(
        null,
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand(
        undefined,
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand(
        '',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0."`,
    );
  });

  test('version tag should not have slash', async () => {
    await expect(() =>
      cliDocsVersionCommand(
        'foo/bar',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowError(
      '[docs]: invalid version tag specified! Do not include slash (/) or backslash (\\). Try something like: 1.0.0.',
    );
    await expect(() =>
      cliDocsVersionCommand(
        'foo\\bar',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowError(
      '[docs]: invalid version tag specified! Do not include slash (/) or backslash (\\). Try something like: 1.0.0.',
    );
  });

  test('version tag should not be too long', async () => {
    await expect(() =>
      cliDocsVersionCommand(
        'a'.repeat(255),
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Length cannot exceed 32 characters. Try something like: 1.0.0."`,
    );
  });

  test('version tag should not be a dot or two dots', async () => {
    await expect(() =>
      cliDocsVersionCommand(
        '..',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Do not name your version \\".\\" or \\"..\\". Try something like: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand(
        '.',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Do not name your version \\".\\" or \\"..\\". Try something like: 1.0.0."`,
    );
  });

  test('version tag should be a valid pathname', async () => {
    await expect(() =>
      cliDocsVersionCommand(
        '<foo|bar>',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand(
        'foo\x00bar',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand(
        'foo:bar',
        simpleSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0."`,
    );
  });

  test('version tag already exist', async () => {
    await expect(() =>
      cliDocsVersionCommand(
        '1.0.0',
        versionedSiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: this version already exists! Use a version tag that does not already exist."`,
    );
  });

  test('no docs file to version', async () => {
    const emptySiteDir = path.join(fixtureDir, 'empty-site');
    await expect(() =>
      cliDocsVersionCommand(
        '1.0.0',
        emptySiteDir,
        DEFAULT_PLUGIN_ID,
        DEFAULT_OPTIONS,
      ),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: there is no docs to version!"`,
    );
  });

  test('first time versioning', async () => {
    const copyMock = jest.spyOn(fs, 'copy').mockImplementation();
    const writeMock = jest.spyOn(fs, 'outputFile');
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
    await cliDocsVersionCommand(
      '1.0.0',
      simpleSiteDir,
      DEFAULT_PLUGIN_ID,
      options,
    );
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
    expect(consoleMock).toHaveBeenCalledWith(
      expect.stringMatching(
        /.*\[SUCCESS\].* .*\[docs\].*: version .*1\.0\.0.* created!.*/,
      ),
    );

    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
  });

  test('not the first time versioning', async () => {
    const copyMock = jest.spyOn(fs, 'copy').mockImplementation();
    const writeMock = jest.spyOn(fs, 'outputFile');
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
    await cliDocsVersionCommand(
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
    expect(consoleMock).toHaveBeenCalledWith(
      expect.stringMatching(
        /.*\[SUCCESS\].* .*\[docs\].*: version .*2\.0\.0.* created!.*/,
      ),
    );

    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
  });

  test('second docs instance versioning', async () => {
    const pluginId = 'community';

    const copyMock = jest.spyOn(fs, 'copy').mockImplementation();
    const writeMock = jest.spyOn(fs, 'outputFile');
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
    await cliDocsVersionCommand('2.0.0', versionedSiteDir, pluginId, options);
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
      expect.stringMatching(
        /.*\[SUCCESS\].* .*\[community\].*: version .*2.0.0.* created!.*/,
      ),
    );

    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
  });
});
