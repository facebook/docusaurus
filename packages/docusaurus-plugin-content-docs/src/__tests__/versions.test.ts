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
import {PluginOptions, VersionMetadata} from '../types';
import {I18n} from '@docusaurus/types';

const DefaultI18N: I18n = {
  currentLocale: 'en',
  locales: ['en'],
  defaultLocale: 'en',
};

describe('version paths', () => {
  test('getVersionsFilePath', () => {
    expect(getVersionsFilePath('someSiteDir', DEFAULT_PLUGIN_ID)).toBe(
      `someSiteDir${path.sep}versions.json`,
    );
    expect(getVersionsFilePath('otherSite/dir', 'pluginId')).toBe(
      `otherSite${path.sep}dir${path.sep}pluginId_versions.json`,
    );
  });

  test('getVersionedDocsDirPath', () => {
    expect(getVersionedDocsDirPath('someSiteDir', DEFAULT_PLUGIN_ID)).toBe(
      `someSiteDir${path.sep}versioned_docs`,
    );
    expect(getVersionedDocsDirPath('otherSite/dir', 'pluginId')).toBe(
      `otherSite${path.sep}dir${path.sep}pluginId_versioned_docs`,
    );
  });

  test('getVersionedSidebarsDirPath', () => {
    expect(getVersionedSidebarsDirPath('someSiteDir', DEFAULT_PLUGIN_ID)).toBe(
      `someSiteDir${path.sep}versioned_sidebars`,
    );
    expect(getVersionedSidebarsDirPath('otherSite/dir', 'pluginId')).toBe(
      `otherSite${path.sep}dir${path.sep}pluginId_versioned_sidebars`,
    );
  });
});

describe('simple site', () => {
  async function loadSite() {
    const simpleSiteDir = path.resolve(
      path.join(__dirname, '__fixtures__', 'simple-site'),
    );
    const defaultOptions: PluginOptions = {
      id: DEFAULT_PLUGIN_ID,
      ...DEFAULT_OPTIONS,
    };
    const defaultContext = {
      siteDir: simpleSiteDir,
      baseUrl: '/',
      i18n: DefaultI18N,
    };

    const vCurrent: VersionMetadata = {
      contentPath: path.join(simpleSiteDir, 'docs'),
      contentPathLocalized: path.join(
        simpleSiteDir,
        'i18n/en/docusaurus-plugin-content-docs/current',
      ),
      isLast: true,
      routePriority: -1,
      sidebarFilePath: path.join(simpleSiteDir, 'sidebars.json'),
      versionLabel: 'Next',
      versionName: 'current',
      versionPath: '/docs',
    };
    return {simpleSiteDir, defaultOptions, defaultContext, vCurrent};
  }

  test('readVersionsMetadata simple site', async () => {
    const {defaultOptions, defaultContext, vCurrent} = await loadSite();

    const versionsMetadata = readVersionsMetadata({
      options: defaultOptions,
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([vCurrent]);
  });

  test('readVersionsMetadata simple site with base url', async () => {
    const {defaultOptions, defaultContext, vCurrent} = await loadSite();

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

  test('readVersionsMetadata simple site with current version config', async () => {
    const {defaultOptions, defaultContext, vCurrent} = await loadSite();

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

  test('readVersionsMetadata simple site with unknown lastVersion should throw', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

    expect(() =>
      readVersionsMetadata({
        options: {...defaultOptions, lastVersion: 'unknownVersionName'},
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Docs option lastVersion=unknownVersionName is invalid. Available version names are: current"`,
    );
  });

  test('readVersionsMetadata simple site with unknown version configurations should throw', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

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

  test('readVersionsMetadata simple site with disableVersioning while single version should throw', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

    expect(() =>
      readVersionsMetadata({
        options: {...defaultOptions, disableVersioning: true},
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Docs: using disableVersioning=true option on a non-versioned site does not make sense"`,
    );
  });

  test('readVersionsMetadata simple site without including current version should throw', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

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
  async function loadSite() {
    const versionedSiteDir = path.resolve(
      path.join(__dirname, '__fixtures__', 'versioned-site'),
    );
    const defaultOptions: PluginOptions = {
      id: DEFAULT_PLUGIN_ID,
      ...DEFAULT_OPTIONS,
    };
    const defaultContext = {
      siteDir: versionedSiteDir,
      baseUrl: '/',
      i18n: DefaultI18N,
    };

    const vCurrent: VersionMetadata = {
      contentPath: path.join(versionedSiteDir, 'docs'),
      contentPathLocalized: path.join(
        versionedSiteDir,
        'i18n/en/docusaurus-plugin-content-docs/current',
      ),
      isLast: false,
      routePriority: undefined,
      sidebarFilePath: path.join(versionedSiteDir, 'sidebars.json'),
      versionLabel: 'Next',
      versionName: 'current',
      versionPath: '/docs/next',
    };

    const v101: VersionMetadata = {
      contentPath: path.join(versionedSiteDir, 'versioned_docs/version-1.0.1'),
      contentPathLocalized: path.join(
        versionedSiteDir,
        'i18n/en/docusaurus-plugin-content-docs/version-1.0.1',
      ),
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
      contentPath: path.join(versionedSiteDir, 'versioned_docs/version-1.0.0'),
      contentPathLocalized: path.join(
        versionedSiteDir,
        'i18n/en/docusaurus-plugin-content-docs/version-1.0.0',
      ),
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
      contentPath: path.join(
        versionedSiteDir,
        'versioned_docs/version-withSlugs',
      ),
      contentPathLocalized: path.join(
        versionedSiteDir,
        'i18n/en/docusaurus-plugin-content-docs/version-withSlugs',
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

    return {
      versionedSiteDir,
      defaultOptions,
      defaultContext,
      vCurrent,
      v101,
      v100,
      vwithSlugs,
    };
  }

  test('readVersionsMetadata versioned site', async () => {
    const {
      defaultOptions,
      defaultContext,
      vCurrent,
      v101,
      v100,
      vwithSlugs,
    } = await loadSite();

    const versionsMetadata = readVersionsMetadata({
      options: defaultOptions,
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([vCurrent, v101, v100, vwithSlugs]);
  });

  test('readVersionsMetadata versioned site with includeCurrentVersion=false', async () => {
    const {
      defaultOptions,
      defaultContext,
      v101,
      v100,
      vwithSlugs,
    } = await loadSite();

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

  test('readVersionsMetadata versioned site with version options', async () => {
    const {
      defaultOptions,
      defaultContext,
      vCurrent,
      v101,
      v100,
      vwithSlugs,
    } = await loadSite();

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

  test('readVersionsMetadata versioned site with editUrl', async () => {
    const {
      defaultOptions,
      defaultContext,
      vCurrent,
      v101,
      v100,
      vwithSlugs,
    } = await loadSite();

    const versionsMetadata = readVersionsMetadata({
      options: {
        ...defaultOptions,
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
      },
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([
      {
        ...vCurrent,
        versionEditUrl:
          'https://github.com/facebook/docusaurus/edit/master/website/docs',
        versionEditUrlLocalized:
          'https://github.com/facebook/docusaurus/edit/master/website/i18n/en/docusaurus-plugin-content-docs/current',
      },
      {
        ...v101,
        versionEditUrl:
          'https://github.com/facebook/docusaurus/edit/master/website/versioned_docs/version-1.0.1',
        versionEditUrlLocalized:
          'https://github.com/facebook/docusaurus/edit/master/website/i18n/en/docusaurus-plugin-content-docs/version-1.0.1',
      },
      {
        ...v100,
        versionEditUrl:
          'https://github.com/facebook/docusaurus/edit/master/website/versioned_docs/version-1.0.0',
        versionEditUrlLocalized:
          'https://github.com/facebook/docusaurus/edit/master/website/i18n/en/docusaurus-plugin-content-docs/version-1.0.0',
      },
      {
        ...vwithSlugs,
        versionEditUrl:
          'https://github.com/facebook/docusaurus/edit/master/website/versioned_docs/version-withSlugs',
        versionEditUrlLocalized:
          'https://github.com/facebook/docusaurus/edit/master/website/i18n/en/docusaurus-plugin-content-docs/version-withSlugs',
      },
    ]);
  });

  test('readVersionsMetadata versioned site with editUrl and editCurrentVersion=true', async () => {
    const {
      defaultOptions,
      defaultContext,
      vCurrent,
      v101,
      v100,
      vwithSlugs,
    } = await loadSite();

    const versionsMetadata = readVersionsMetadata({
      options: {
        ...defaultOptions,
        editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        editCurrentVersion: true,
      },
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([
      {
        ...vCurrent,
        versionEditUrl:
          'https://github.com/facebook/docusaurus/edit/master/website/docs',
        versionEditUrlLocalized:
          'https://github.com/facebook/docusaurus/edit/master/website/i18n/en/docusaurus-plugin-content-docs/current',
      },
      {
        ...v101,
        versionEditUrl:
          'https://github.com/facebook/docusaurus/edit/master/website/docs',
        versionEditUrlLocalized:
          'https://github.com/facebook/docusaurus/edit/master/website/i18n/en/docusaurus-plugin-content-docs/current',
      },
      {
        ...v100,
        versionEditUrl:
          'https://github.com/facebook/docusaurus/edit/master/website/docs',
        versionEditUrlLocalized:
          'https://github.com/facebook/docusaurus/edit/master/website/i18n/en/docusaurus-plugin-content-docs/current',
      },
      {
        ...vwithSlugs,
        versionEditUrl:
          'https://github.com/facebook/docusaurus/edit/master/website/docs',
        versionEditUrlLocalized:
          'https://github.com/facebook/docusaurus/edit/master/website/i18n/en/docusaurus-plugin-content-docs/current',
      },
    ]);
  });

  test('readVersionsMetadata versioned site with onlyIncludeVersions option', async () => {
    const {defaultOptions, defaultContext, v101, vwithSlugs} = await loadSite();

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

  test('readVersionsMetadata versioned site with disableVersioning', async () => {
    const {defaultOptions, defaultContext, vCurrent} = await loadSite();

    const versionsMetadata = readVersionsMetadata({
      options: {...defaultOptions, disableVersioning: true},
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([
      {...vCurrent, isLast: true, routePriority: -1, versionPath: '/docs'},
    ]);
  });

  test('readVersionsMetadata versioned site with all versions disabled', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

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

  test('readVersionsMetadata versioned site with empty onlyIncludeVersions', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

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

  test('readVersionsMetadata versioned site with unknown versions in onlyIncludeVersions', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

    expect(() =>
      readVersionsMetadata({
        options: {
          ...defaultOptions,
          onlyIncludeVersions: ['unknownVersion1', 'unknownVersion2'],
        },
        context: defaultContext,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Bad docs options.onlyIncludeVersions: unknown versions found: unknownVersion1,unknownVersion2. Available version names are: current, 1.0.1, 1.0.0, withSlugs"`,
    );
  });

  test('readVersionsMetadata versioned site with lastVersion not in onlyIncludeVersions', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

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

  test('readVersionsMetadata versioned site with invalid versions.json file', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

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
  async function loadSite() {
    const versionedSiteDir = path.resolve(
      path.join(__dirname, '__fixtures__', 'versioned-site'),
    );
    const defaultOptions: PluginOptions = {
      ...DEFAULT_OPTIONS,
      id: 'community',
      path: 'community',
      routeBasePath: 'communityBasePath',
    };
    const defaultContext = {
      siteDir: versionedSiteDir,
      baseUrl: '/',
      i18n: DefaultI18N,
    };

    const vCurrent: VersionMetadata = {
      contentPath: path.join(versionedSiteDir, 'community'),
      contentPathLocalized: path.join(
        versionedSiteDir,
        'i18n/en/docusaurus-plugin-content-docs-community/current',
      ),
      isLast: false,
      routePriority: undefined,
      sidebarFilePath: path.join(versionedSiteDir, 'sidebars.json'),
      versionLabel: 'Next',
      versionName: 'current',
      versionPath: '/communityBasePath/next',
    };

    const v100: VersionMetadata = {
      contentPath: path.join(
        versionedSiteDir,
        'community_versioned_docs/version-1.0.0',
      ),
      contentPathLocalized: path.join(
        versionedSiteDir,
        'i18n/en/docusaurus-plugin-content-docs-community/version-1.0.0',
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

    return {versionedSiteDir, defaultOptions, defaultContext, vCurrent, v100};
  }

  test('readVersionsMetadata versioned site (community)', async () => {
    const {defaultOptions, defaultContext, vCurrent, v100} = await loadSite();

    const versionsMetadata = readVersionsMetadata({
      options: defaultOptions,
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([vCurrent, v100]);
  });

  test('readVersionsMetadata versioned site (community) with includeCurrentVersion=false', async () => {
    const {defaultOptions, defaultContext, v100} = await loadSite();

    const versionsMetadata = readVersionsMetadata({
      options: {...defaultOptions, includeCurrentVersion: false},
      context: defaultContext,
    });

    expect(versionsMetadata).toEqual([
      // vCurrent removed
      v100,
    ]);
  });

  test('readVersionsMetadata versioned site (community) with disableVersioning', async () => {
    const {defaultOptions, defaultContext, vCurrent} = await loadSite();

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

  test('readVersionsMetadata versioned site (community) with all versions disabled', async () => {
    const {defaultOptions, defaultContext} = await loadSite();

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
