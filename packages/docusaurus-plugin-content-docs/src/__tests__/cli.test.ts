/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import path from 'path';
import {cliDocsVersionCommand} from '../cli';
import type {PluginOptions} from '@docusaurus/plugin-content-docs';
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

  const DEFAULT_OPTIONS: PluginOptions = {
    id: 'default',
    path: 'docs',
    sidebarPath: '',
    sidebarCollapsed: true,
    sidebarCollapsible: true,
  };

  it('no version tag provided', async () => {
    await expect(() =>
      cliDocsVersionCommand(null, DEFAULT_OPTIONS, {siteDir: simpleSiteDir}),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand(undefined, DEFAULT_OPTIONS, {
        siteDir: simpleSiteDir,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand('', DEFAULT_OPTIONS, {siteDir: simpleSiteDir}),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no version tag specified! Pass the version you wish to create as an argument, for example: 1.0.0."`,
    );
  });

  it('version tag should not have slash', async () => {
    await expect(() =>
      cliDocsVersionCommand('foo/bar', DEFAULT_OPTIONS, {
        siteDir: simpleSiteDir,
      }),
    ).rejects.toThrowError(
      '[docs]: invalid version tag specified! Do not include slash (/) or backslash (\\). Try something like: 1.0.0.',
    );
    await expect(() =>
      cliDocsVersionCommand('foo\\bar', DEFAULT_OPTIONS, {
        siteDir: simpleSiteDir,
      }),
    ).rejects.toThrowError(
      '[docs]: invalid version tag specified! Do not include slash (/) or backslash (\\). Try something like: 1.0.0.',
    );
  });

  it('version tag should not be too long', async () => {
    await expect(() =>
      cliDocsVersionCommand('a'.repeat(255), DEFAULT_OPTIONS, {
        siteDir: simpleSiteDir,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Length cannot exceed 32 characters. Try something like: 1.0.0."`,
    );
  });

  it('version tag should not be a dot or two dots', async () => {
    await expect(() =>
      cliDocsVersionCommand('..', DEFAULT_OPTIONS, {siteDir: simpleSiteDir}),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Do not name your version "." or "..". Try something like: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand('.', DEFAULT_OPTIONS, {siteDir: simpleSiteDir}),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Do not name your version "." or "..". Try something like: 1.0.0."`,
    );
  });

  it('version tag should be a valid pathname', async () => {
    await expect(() =>
      cliDocsVersionCommand('<foo|bar>', DEFAULT_OPTIONS, {
        siteDir: simpleSiteDir,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand('foo\x00bar', DEFAULT_OPTIONS, {
        siteDir: simpleSiteDir,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0."`,
    );
    await expect(() =>
      cliDocsVersionCommand('foo:bar', DEFAULT_OPTIONS, {
        siteDir: simpleSiteDir,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: invalid version tag specified! Please ensure its a valid pathname too. Try something like: 1.0.0."`,
    );
  });

  it('version tag already exist', async () => {
    await expect(() =>
      cliDocsVersionCommand('1.0.0', DEFAULT_OPTIONS, {
        siteDir: versionedSiteDir,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: this version already exists! Use a version tag that does not already exist."`,
    );
  });

  it('no docs file to version', async () => {
    const emptySiteDir = path.join(fixtureDir, 'empty-site');
    await expect(() =>
      cliDocsVersionCommand('1.0.0', DEFAULT_OPTIONS, {
        siteDir: emptySiteDir,
        i18n: {locales: ['en', 'zh-Hans'], defaultLocale: 'en'},
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[docs]: no docs found in "<PROJECT_ROOT>/packages/docusaurus-plugin-content-docs/src/__tests__/__fixtures__/empty-site/docs"."`,
    );
  });

  it('first time versioning', async () => {
    const copyMock = jest.spyOn(fs, 'copy').mockImplementation(() => {});
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
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    const options = {
      ...DEFAULT_OPTIONS,
      sidebarPath: path.join(simpleSiteDir, 'sidebars.json'),
    };
    await cliDocsVersionCommand('1.0.0', options, {
      siteDir: simpleSiteDir,
      i18n: {locales: ['en', 'zh-Hans'], defaultLocale: 'en'},
    });
    expect(copyMock).toHaveBeenCalledWith(
      path.join(simpleSiteDir, options.path),
      path.join(
        getVersionedDocsDirPath(simpleSiteDir, DEFAULT_PLUGIN_ID),
        'version-1.0.0',
      ),
    );
    expect(copyMock).toHaveBeenCalledWith(
      path.join(
        simpleSiteDir,
        'i18n/zh-Hans/docusaurus-plugin-content-docs/current',
      ),
      path.join(
        simpleSiteDir,
        'i18n/zh-Hans/docusaurus-plugin-content-docs/version-1.0.0',
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
        /.*\[SUCCESS\].*\[docs\].*: version .*1\.0\.0.* created!.*/,
      ),
    );

    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
  });

  it('not the first time versioning', async () => {
    const copyMock = jest.spyOn(fs, 'copy').mockImplementation(() => {});
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
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    const warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const options = {
      ...DEFAULT_OPTIONS,
      sidebarPath: path.join(versionedSiteDir, 'sidebars.json'),
    };
    await cliDocsVersionCommand('2.0.0', options, {
      siteDir: versionedSiteDir,
      i18n: {locales: ['en', 'zh-Hans'], defaultLocale: 'en'},
    });
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
        /.*\[SUCCESS\].*\[docs\].*: version .*2\.0\.0.* created!.*/,
      ),
    );
    expect(warnMock.mock.calls[0][0]).toMatchInlineSnapshot(
      `"[WARNING] [docs]: no docs found in "<PROJECT_ROOT>/packages/docusaurus-plugin-content-docs/src/__tests__/__fixtures__/versioned-site/i18n/zh-Hans/docusaurus-plugin-content-docs/current". Skipping."`,
    );

    warnMock.mockRestore();
    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
  });

  it('second docs instance versioning', async () => {
    const pluginId = 'community';

    const copyMock = jest.spyOn(fs, 'copy').mockImplementation(() => {});
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
    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    const options = {
      ...DEFAULT_OPTIONS,
      id: pluginId,
      path: 'community',
      sidebarPath: path.join(versionedSiteDir, 'community_sidebars.json'),
    };
    await cliDocsVersionCommand('2.0.0', options, {
      siteDir: versionedSiteDir,
      i18n: {locales: ['en', 'fr'], defaultLocale: 'en'},
    });
    expect(copyMock).toHaveBeenCalledWith(
      path.join(versionedSiteDir, options.path),
      path.join(
        getVersionedDocsDirPath(versionedSiteDir, pluginId),
        'version-2.0.0',
      ),
    );
    expect(copyMock).toHaveBeenCalledWith(
      path.join(
        versionedSiteDir,
        'i18n/fr/docusaurus-plugin-content-docs-community/current',
      ),
      path.join(
        versionedSiteDir,
        'i18n/fr/docusaurus-plugin-content-docs-community/version-2.0.0',
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
        /.*\[SUCCESS\].*\[community\].*: version .*2.0.0.* created!.*/,
      ),
    );

    copyMock.mockRestore();
    writeMock.mockRestore();
    consoleMock.mockRestore();
  });
});
