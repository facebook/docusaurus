/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {
  getActivePlugin,
  getLatestVersion,
  getActiveDocContext,
  getActiveVersion,
  getDocVersionSuggestions,
} from '../docsClientUtils';
import type {
  GlobalPluginData,
  GlobalVersion,
  ActivePlugin,
  GlobalDoc,
} from '@docusaurus/plugin-content-docs/client';

describe('docsClientUtils', () => {
  it('getActivePlugin', () => {
    const data: {[key: string]: GlobalPluginData} = {
      pluginIosId: {
        path: '/ios',
        versions: [],
        breadcrumbs: true,
      },
      pluginAndroidId: {
        path: '/android',
        versions: [],
        breadcrumbs: true,
      },
    };

    expect(getActivePlugin(data, '/')).toBeUndefined();
    expect(getActivePlugin(data, '/xyz')).toBeUndefined();

    expect(() =>
      getActivePlugin(data, '/', {failfast: true}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't find active docs plugin for "/" pathname, while it was expected to be found. Maybe you tried to use a docs feature that can only be used on a docs-related page? Existing docs plugin paths are: /ios, /android"`,
    );
    expect(() =>
      getActivePlugin(data, '/xyz', {failfast: true}),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Can't find active docs plugin for "/xyz" pathname, while it was expected to be found. Maybe you tried to use a docs feature that can only be used on a docs-related page? Existing docs plugin paths are: /ios, /android"`,
    );

    const activePluginIos: ActivePlugin = {
      pluginId: 'pluginIosId',
      pluginData: data.pluginIosId!,
    };
    expect(getActivePlugin(data, '/ios')).toEqual(activePluginIos);
    expect(getActivePlugin(data, '/ios/')).toEqual(activePluginIos);
    expect(getActivePlugin(data, '/ios/abc/def')).toEqual(activePluginIos);

    const activePluginAndroid: ActivePlugin = {
      pluginId: 'pluginAndroidId',
      pluginData: data.pluginAndroidId!,
    };
    expect(getActivePlugin(data, '/android')).toEqual(activePluginAndroid);
    expect(getActivePlugin(data, '/android/')).toEqual(activePluginAndroid);
    expect(getActivePlugin(data, '/android/ijk')).toEqual(activePluginAndroid);

    // https://github.com/facebook/docusaurus/issues/6434
    const onePluginAtRoot: {[key: string]: GlobalPluginData} = {
      pluginIosId: {
        path: '/',
        versions: [],
        breadcrumbs: true,
      },
      pluginAndroidId: {
        path: '/android',
        versions: [],
        breadcrumbs: true,
      },
    };
    expect(getActivePlugin(onePluginAtRoot, '/android/foo')!.pluginId).toBe(
      'pluginAndroidId',
    );
    const onePluginAtRootReversed: {[key: string]: GlobalPluginData} = {
      pluginAndroidId: {
        path: '/android',
        versions: [],
        breadcrumbs: true,
      },
      pluginIosId: {
        path: '/',
        versions: [],
        breadcrumbs: true,
      },
    };
    expect(
      getActivePlugin(onePluginAtRootReversed, '/android/foo')!.pluginId,
    ).toBe('pluginAndroidId');
  });

  it('getLatestVersion', () => {
    const versions: GlobalVersion[] = [
      {
        name: 'version1',
        label: 'version1',
        path: '/???',
        isLast: false,
        docs: [],
        mainDocId: '???',
        draftIds: [],
      },
      {
        name: 'version2',
        label: 'version2',
        path: '/???',
        isLast: true,
        docs: [],
        mainDocId: '???',
        draftIds: [],
      },
      {
        name: 'version3',
        label: 'version3',
        path: '/???',
        isLast: false,
        docs: [],
        mainDocId: '???',
        draftIds: [],
      },
    ];

    expect(
      getLatestVersion({
        path: '???',
        versions,
        breadcrumbs: true,
      }),
    ).toEqual(versions[1]);
  });

  it('getActiveVersion', () => {
    const data: GlobalPluginData = {
      path: 'docs',
      versions: [
        {
          name: 'next',
          label: 'next',
          isLast: false,
          path: '/docs/next',
          docs: [],
          mainDocId: '???',
          draftIds: [],
        },
        {
          name: 'version2',
          label: 'version2',
          isLast: true,
          path: '/docs',
          docs: [],
          mainDocId: '???',
          draftIds: [],
        },
        {
          name: 'version1',
          label: 'version1',
          isLast: false,
          path: '/docs/version1',
          docs: [],
          mainDocId: '???',
          draftIds: [],
        },
      ],
      breadcrumbs: true,
    };

    expect(getActiveVersion(data, '/someUnknownPath')).toBeUndefined();

    expect(getActiveVersion(data, '/docs/next')?.name).toBe('next');
    expect(getActiveVersion(data, '/docs/next/')?.name).toBe('next');
    expect(getActiveVersion(data, '/docs/next/someDoc')?.name).toBe('next');

    expect(getActiveVersion(data, '/docs')?.name).toBe('version2');
    expect(getActiveVersion(data, '/docs/')?.name).toBe('version2');
    expect(getActiveVersion(data, '/docs/someDoc')?.name).toBe('version2');

    expect(getActiveVersion(data, '/docs/version1')?.name).toBe('version1');
    expect(getActiveVersion(data, '/docs/version1')?.name).toBe('version1');
    expect(getActiveVersion(data, '/docs/version1/someDoc')?.name).toBe(
      'version1',
    );
  });

  it('getActiveDocContext', () => {
    const versionNext: GlobalVersion = {
      name: 'next',
      label: 'next',
      path: '/docs/next',
      isLast: false,
      mainDocId: 'doc1',
      docs: [
        {
          id: 'doc1',
          path: '/docs/next/',
        },
        {
          id: 'doc2',
          path: '/docs/next/doc2',
        },
      ] as GlobalDoc[],
      draftIds: [],
    };

    const version2: GlobalVersion = {
      name: 'version2',
      label: 'version2',
      isLast: true,
      path: '/docs',
      mainDocId: 'doc1',
      docs: [
        {
          id: 'doc1',
          path: '/docs/',
        },
        {
          id: 'doc2',
          path: '/docs/doc2',
        },
      ] as GlobalDoc[],
      draftIds: [],
    };

    const version1: GlobalVersion = {
      name: 'version1',
      label: 'version1',
      path: '/docs/version1',
      isLast: false,
      mainDocId: 'doc1',
      docs: [
        {
          id: 'doc1',
          path: '/docs/version1/',
        },
      ] as GlobalDoc[],
      draftIds: [],
    };

    // Shuffle, because order shouldn't matter
    const versions: GlobalVersion[] = _.shuffle([
      versionNext,
      version2,
      version1,
    ]);

    const data: GlobalPluginData = {
      path: 'docs',
      versions,
      breadcrumbs: true,
    };

    expect(getActiveDocContext(data, '/doesNotExist')).toEqual({
      activeVersion: undefined,
      activeDoc: undefined,
      alternateDocVersions: {},
    });

    expect(getActiveDocContext(data, '/docs/next/doesNotExist')).toEqual({
      activeVersion: versionNext,
      activeDoc: undefined,
      alternateDocVersions: {},
    });

    expect(getActiveDocContext(data, '/docs/next')).toEqual({
      activeVersion: versionNext,
      activeDoc: versionNext.docs[0],
      alternateDocVersions: {
        next: versionNext.docs[0],
        version2: version2.docs[0],
        version1: version1.docs[0],
      },
    });
    expect(getActiveDocContext(data, '/docs/next/doc2')).toEqual({
      activeVersion: versionNext,
      activeDoc: versionNext.docs[1],
      alternateDocVersions: {
        next: versionNext.docs[1],
        version2: version2.docs[1],
        version1: undefined,
      },
    });

    expect(getActiveDocContext(data, '/docs/')).toEqual({
      activeVersion: version2,
      activeDoc: version2.docs[0],
      alternateDocVersions: {
        next: versionNext.docs[0],
        version2: version2.docs[0],
        version1: version1.docs[0],
      },
    });
    expect(getActiveDocContext(data, '/docs/doc2')).toEqual({
      activeVersion: version2,
      activeDoc: version2.docs[1],
      alternateDocVersions: {
        next: versionNext.docs[1],
        version2: version2.docs[1],
        version1: undefined,
      },
    });

    expect(getActiveDocContext(data, '/docs/version1')).toEqual({
      activeVersion: version1,
      activeDoc: version1.docs[0],
      alternateDocVersions: {
        next: versionNext.docs[0],
        version2: version2.docs[0],
        version1: version1.docs[0],
      },
    });
    expect(getActiveDocContext(data, '/docs/version1/doc2')).toEqual({
      activeVersion: version1,
      activeDoc: undefined,
      alternateDocVersions: {},
    });
  });

  it('getDocVersionSuggestions', () => {
    const versionNext: GlobalVersion = {
      name: 'next',
      label: 'next',
      isLast: false,
      path: '/docs/next',
      mainDocId: 'doc1',
      docs: [
        {
          id: 'doc1',
          path: '/docs/next/',
        },
        {
          id: 'doc2',
          path: '/docs/next/doc2',
        },
      ] as GlobalDoc[],
      draftIds: [],
    };

    const version2: GlobalVersion = {
      name: 'version2',
      label: 'version2',
      path: '/docs',
      isLast: true,
      mainDocId: 'doc1',
      docs: [
        {
          id: 'doc1',
          path: '/docs/',
        },
        {
          id: 'doc2',
          path: '/docs/doc2',
        },
      ] as GlobalDoc[],
      draftIds: [],
    };

    const version1: GlobalVersion = {
      name: 'version1',
      label: 'version1',
      isLast: false,
      path: '/docs/version1',
      mainDocId: 'doc1',
      docs: [
        {
          id: 'doc1',
          path: '/docs/version1/',
        },
      ] as GlobalDoc[],
      draftIds: [],
    };

    // Shuffle, because order shouldn't matter
    const versions: GlobalVersion[] = _.shuffle([
      versionNext,
      version2,
      version1,
    ]);

    const data: GlobalPluginData = {
      path: 'docs',
      versions,
      breadcrumbs: true,
    };

    expect(getDocVersionSuggestions(data, '/doesNotExist')).toEqual({
      latestDocSuggestion: undefined,
      latestVersionSuggestion: version2,
    });

    expect(getDocVersionSuggestions(data, '/docs/next')).toEqual({
      latestDocSuggestion: version2.docs[0],
      latestVersionSuggestion: version2,
    });
    expect(getDocVersionSuggestions(data, '/docs/next/doc2')).toEqual({
      latestDocSuggestion: version2.docs[1],
      latestVersionSuggestion: version2,
    });

    expect(getDocVersionSuggestions(data, '/docs/')).toEqual({
      latestDocSuggestion: version2.docs[0],
      latestVersionSuggestion: version2,
    });
    expect(getDocVersionSuggestions(data, '/docs/doc2')).toEqual({
      latestDocSuggestion: version2.docs[1],
      latestVersionSuggestion: version2,
    });

    expect(getDocVersionSuggestions(data, '/docs/version1/')).toEqual({
      latestDocSuggestion: version2.docs[0],
      latestVersionSuggestion: version2,
    });
    expect(getDocVersionSuggestions(data, '/docs/version1/doc2')).toEqual({
      latestDocSuggestion: undefined, // Because /docs/version1/doc2 does not exist
      latestVersionSuggestion: version2,
    });
  });
});
