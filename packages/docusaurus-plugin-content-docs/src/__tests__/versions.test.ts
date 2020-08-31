/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import {
  getVersionsFilePath,
  getVersionedDocsDirPath,
  getVersionedSidebarsDirPath,
  readVersionsMetadata,
} from '../versions';
import {DEFAULT_OPTIONS} from '../options';
import {DEFAULT_PLUGIN_ID} from '@docusaurus/core/lib/constants';
import {VersionMetadata} from '../types';

describe('version paths', () => {
  test('getVersionedDocsDirPath', () => {
    expect(getVersionsFilePath('someSiteDir', DEFAULT_PLUGIN_ID)).toBe(
      'someSiteDir/versions.json',
    );
    expect(getVersionsFilePath('otherSite/dir', 'pluginId')).toBe(
      'otherSite/dir/pluginId_versions.json',
    );
  });

  test('getVersionedDocsDirPath', () => {
    expect(getVersionedDocsDirPath('someSiteDir', DEFAULT_PLUGIN_ID)).toBe(
      'someSiteDir/versioned_docs',
    );
    expect(getVersionedDocsDirPath('otherSite/dir', 'pluginId')).toBe(
      'otherSite/dir/pluginId_versioned_docs',
    );
  });

  test('getVersionedSidebarsDirPath', () => {
    expect(getVersionedSidebarsDirPath('someSiteDir', DEFAULT_PLUGIN_ID)).toBe(
      'someSiteDir/versioned_sidebars',
    );
    expect(getVersionedSidebarsDirPath('otherSite/dir', 'pluginId')).toBe(
      'otherSite/dir/pluginId_versioned_sidebars',
    );
  });
});

describe('simple site', () => {
  const simpleSiteDir = path.resolve(
    path.join(__dirname, '__fixtures__', 'simple-site'),
  );
  const defaultOptions = {
    id: DEFAULT_PLUGIN_ID,
    ...DEFAULT_OPTIONS,
  };
  const defaultContext = {
    siteDir: simpleSiteDir,
    baseUrl: '/',
  };

  const vCurrent: VersionMetadata = {
    docsDirPath: path.join(simpleSiteDir, 'docs'),
    isLast: true,
    routePriority: -1,
    sidebarFilePath: path.join(simpleSiteDir, 'sidebars.json'),
    versionLabel: 'Next',
    versionName: 'current',
    versionPath: '/docs',
  };

  test('readVersionsMetadata simple site', () => {
    const versionsMetadata = readVersionsMetadata({
      options: defaultOptions,
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([vCurrent]);
  });

  test('readVersionsMetadata simple site with base url', () => {
    const versionsMetadata = readVersionsMetadata({
      options: defaultOptions,
      context: {
        ...defaultContext,
        baseUrl: '/myBaseUrl',
      },
    });

    expect(versionsMetadata).toEqual([
      {
        ...vCurrent,
        versionPath: '/myBaseUrl/docs',
      },
    ]);
  });

  test('readVersionsMetadata simple site with current version config', () => {
    const versionsMetadata = readVersionsMetadata({
      options: {
        ...defaultOptions,
        versions: {
          current: {
            label: 'current-label',
            path: 'current-path',
          },
        },
      },
      context: {
        ...defaultContext,
        baseUrl: '/myBaseUrl',
      },
    });

    expect(versionsMetadata).toEqual([
      {
        ...vCurrent,
        versionPath: '/myBaseUrl/docs/current-path',
        versionLabel: 'current-label',
        routePriority: undefined,
      },
    ]);
  });

  test('readVersionsMetadata simple site with unknown lastVersion should throw', () => {
    expect(() =>
      readVersionsMetadata({
        options: {...defaultOptions, lastVersion: 'unknownVersionName'},
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Docs option lastVersion=unknownVersionName is invalid. Available version names are: current"`,
    );
  });

  test('readVersionsMetadata simple site with unknown version configurations should throw', () => {
    expect(() =>
      readVersionsMetadata({
        options: {
          ...defaultOptions,
          versions: {
            current: {label: 'current'},
            unknownVersionName1: {label: 'unknownVersionName1'},
            unknownVersionName2: {label: 'unknownVersionName2'},
          },
        },
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Bad docs options.versions: unknown versions found: unknownVersionName1,unknownVersionName2. Available version names are: current"`,
    );
  });

  test('readVersionsMetadata simple site with disableVersioning while single version should throw', () => {
    expect(() =>
      readVersionsMetadata({
        options: {...defaultOptions, disableVersioning: true},
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Docs: using disableVersioning=true option on a non-versioned site does not make sense"`,
    );
  });

  test('readVersionsMetadata simple site without including current version should throw', () => {
    expect(() =>
      readVersionsMetadata({
        options: {...defaultOptions, includeCurrentVersion: false},
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"It is not possible to use docs without any version. Please check the configuration of these options: includeCurrentVersion=false disableVersioning=false"`,
    );
  });
});

describe('versioned site, pluginId=default', () => {
  const versionedSiteDir = path.resolve(
    path.join(__dirname, '__fixtures__', 'versioned-site'),
  );
  const defaultOptions = {
    id: DEFAULT_PLUGIN_ID,
    ...DEFAULT_OPTIONS,
  };
  const defaultContext = {
    siteDir: versionedSiteDir,
    baseUrl: '/',
  };

  const vCurrent: VersionMetadata = {
    docsDirPath: path.join(versionedSiteDir, 'docs'),
    isLast: false,
    routePriority: undefined,
    sidebarFilePath: path.join(versionedSiteDir, 'sidebars.json'),
    versionLabel: 'Next',
    versionName: 'current',
    versionPath: '/docs/next',
  };

  const v101: VersionMetadata = {
    docsDirPath: path.join(versionedSiteDir, 'versioned_docs/version-1.0.1'),
    isLast: true,
    routePriority: -1,
    sidebarFilePath: path.join(
      versionedSiteDir,
      'versioned_sidebars/version-1.0.1-sidebars.json',
    ),
    versionLabel: '1.0.1',
    versionName: '1.0.1',
    versionPath: '/docs',
  };

  const v100: VersionMetadata = {
    docsDirPath: path.join(versionedSiteDir, 'versioned_docs/version-1.0.0'),
    isLast: false,
    routePriority: undefined,
    sidebarFilePath: path.join(
      versionedSiteDir,
      'versioned_sidebars/version-1.0.0-sidebars.json',
    ),
    versionLabel: '1.0.0',
    versionName: '1.0.0',
    versionPath: '/docs/1.0.0',
  };

  const vwithSlugs: VersionMetadata = {
    docsDirPath: path.join(
      versionedSiteDir,
      'versioned_docs/version-withSlugs',
    ),
    isLast: false,
    routePriority: undefined,
    sidebarFilePath: path.join(
      versionedSiteDir,
      'versioned_sidebars/version-withSlugs-sidebars.json',
    ),
    versionLabel: 'withSlugs',
    versionName: 'withSlugs',
    versionPath: '/docs/withSlugs',
  };

  test('readVersionsMetadata versioned site', () => {
    const versionsMetadata = readVersionsMetadata({
      options: defaultOptions,
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([vCurrent, v101, v100, vwithSlugs]);
  });

  test('readVersionsMetadata versioned site with includeCurrentVersion=false', () => {
    const versionsMetadata = readVersionsMetadata({
      options: {...defaultOptions, includeCurrentVersion: false},
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([
      // vCurrent removed
      v101,
      v100,
      vwithSlugs,
    ]);
  });

  test('readVersionsMetadata versioned site with version options', () => {
    const versionsMetadata = readVersionsMetadata({
      options: {
        ...defaultOptions,
        lastVersion: '1.0.0',
        versions: {
          current: {
            path: 'current-path',
          },
          '1.0.0': {
            label: '1.0.0-label',
          },
        },
      },
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([
      {...vCurrent, versionPath: '/docs/current-path'},
      {
        ...v101,
        isLast: false,
        routePriority: undefined,
        versionPath: '/docs/1.0.1',
      },
      {
        ...v100,
        isLast: true,
        routePriority: -1,
        versionLabel: '1.0.0-label',
        versionPath: '/docs',
      },
      vwithSlugs,
    ]);
  });

  test('readVersionsMetadata versioned site with onlyIncludeVersions option', () => {
    const versionsMetadata = readVersionsMetadata({
      options: {
        ...defaultOptions,
        // Order reversed on purpose: should not have any impact
        onlyIncludeVersions: [vwithSlugs.versionName, v101.versionName],
      },
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([v101, vwithSlugs]);
  });

  test('readVersionsMetadata versioned site with disableVersioning', () => {
    const versionsMetadata = readVersionsMetadata({
      options: {...defaultOptions, disableVersioning: true},
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([
      {...vCurrent, isLast: true, routePriority: -1, versionPath: '/docs'},
    ]);
  });

  test('readVersionsMetadata versioned site with all versions disabled', () => {
    expect(() =>
      readVersionsMetadata({
        options: {
          ...defaultOptions,
          includeCurrentVersion: false,
          disableVersioning: true,
        },
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"It is not possible to use docs without any version. Please check the configuration of these options: includeCurrentVersion=false disableVersioning=true"`,
    );
  });

  test('readVersionsMetadata versioned site with empty onlyIncludeVersions', () => {
    expect(() =>
      readVersionsMetadata({
        options: {
          ...defaultOptions,
          onlyIncludeVersions: [],
        },
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Bad docs options.onlyIncludeVersions: an empty array is not allowed, at least one version is needed"`,
    );
  });

  test('readVersionsMetadata versioned site with unknown versions in onlyIncludeVersions', () => {
    expect(() =>
      readVersionsMetadata({
        options: {
          ...defaultOptions,
          onlyIncludeVersions: ['unknownVersion1', 'unknownVersion2'],
        },
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Bad docs options.onlyIncludeVersions: unknown versions found: unknownVersion1,unknownVersion2. unknownVersion1,unknownVersion2"`,
    );
  });

  test('readVersionsMetadata versioned site with lastVersion not in onlyIncludeVersions', () => {
    expect(() =>
      readVersionsMetadata({
        options: {
          ...defaultOptions,
          lastVersion: '1.0.1',
          onlyIncludeVersions: ['current', '1.0.0'],
        },
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Bad docs options.lastVersion: if you use both the onlyIncludeVersions and lastVersion options, then lastVersion must be present in the provided onlyIncludeVersions array"`,
    );
  });

  test('readVersionsMetadata versioned site with invalid versions.json file', () => {
    const mock = jest.spyOn(JSON, 'parse').mockImplementationOnce(() => {
      return {
        invalid: 'json',
      };
    });

    expect(() => {
      readVersionsMetadata({
        options: defaultOptions,
        context: defaultContext,
      });
    }).toThrowErrorMatchingInlineSnapshot(
      `"The versions file should contain an array of versions! Found content={\\"invalid\\":\\"json\\"}"`,
    );
    mock.mockRestore();
  });
});

describe('versioned site, pluginId=community', () => {
  const versionedSiteDir = path.resolve(
    path.join(__dirname, '__fixtures__', 'versioned-site'),
  );
  const defaultOptions = {
    ...DEFAULT_OPTIONS,
    id: 'community',
    path: 'community',
    routeBasePath: 'communityBasePath',
  };
  const defaultContext = {
    siteDir: versionedSiteDir,
    baseUrl: '/',
  };

  const vCurrent: VersionMetadata = {
    docsDirPath: path.join(versionedSiteDir, 'community'),
    isLast: false,
    routePriority: undefined,
    sidebarFilePath: path.join(versionedSiteDir, 'sidebars.json'),
    versionLabel: 'Next',
    versionName: 'current',
    versionPath: '/communityBasePath/next',
  };

  const v100: VersionMetadata = {
    docsDirPath: path.join(
      versionedSiteDir,
      'community_versioned_docs/version-1.0.0',
    ),
    isLast: true,
    routePriority: -1,
    sidebarFilePath: path.join(
      versionedSiteDir,
      'community_versioned_sidebars/version-1.0.0-sidebars.json',
    ),
    versionLabel: '1.0.0',
    versionName: '1.0.0',
    versionPath: '/communityBasePath',
  };

  test('readVersionsMetadata versioned site (community)', () => {
    const versionsMetadata = readVersionsMetadata({
      options: defaultOptions,
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([vCurrent, v100]);
  });

  test('readVersionsMetadata versioned site (community) with includeCurrentVersion=false', () => {
    const versionsMetadata = readVersionsMetadata({
      options: {...defaultOptions, includeCurrentVersion: false},
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([
      // vCurrent removed
      v100,
    ]);
  });

  test('readVersionsMetadata versioned site (community) with disableVersioning', () => {
    const versionsMetadata = readVersionsMetadata({
      options: {...defaultOptions, disableVersioning: true},
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([
      {
        ...vCurrent,
        isLast: true,
        routePriority: -1,
        versionPath: '/communityBasePath',
      },
    ]);
  });

  test('readVersionsMetadata versioned site (community) with all versions disabled', () => {
    expect(() =>
      readVersionsMetadata({
        options: {
          ...defaultOptions,
          includeCurrentVersion: false,
          disableVersioning: true,
        },
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"It is not possible to use docs without any version. Please check the configuration of these options: includeCurrentVersion=false disableVersioning=true"`,
    );
  });
});
