/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  ActivePlugin,
  getActivePlugin,
  getLatestVersion,
  getActiveDocContext,
  getActiveVersion,
  getDocVersionSuggestions,
} from '../../client/docsClientUtils';
import {GlobalPluginData, GlobalVersion} from '../../types';
import {shuffle} from 'lodash';

describe('docsClientUtils', () => {
  test('getActivePlugin', () => {
    const data: Record<string, GlobalPluginData> = {
      pluginIosId: {
        path: 'ios',
        latestVersionName: 'xyz',
        versions: [],
      },
      pluginAndroidId: {
        path: 'android',
        latestVersionName: 'xyz',
        versions: [],
      },
    };

    expect(getActivePlugin(data, '/')).toEqual(undefined);
    expect(getActivePlugin(data, '/xyz')).toEqual(undefined);

    const activePluginIos: ActivePlugin = {
      pluginId: 'pluginIosId',
      pluginData: data.pluginIosId,
    };
    expect(getActivePlugin(data, '/ios')).toEqual(activePluginIos);
    expect(getActivePlugin(data, '/ios/')).toEqual(activePluginIos);
    expect(getActivePlugin(data, '/ios/abc/def')).toEqual(activePluginIos);

    const activePluginAndroid: ActivePlugin = {
      pluginId: 'pluginAndroidId',
      pluginData: data.pluginAndroidId,
    };
    expect(getActivePlugin(data, '/android')).toEqual(activePluginAndroid);
    expect(getActivePlugin(data, '/android/')).toEqual(activePluginAndroid);
    expect(getActivePlugin(data, '/android/ijk')).toEqual(activePluginAndroid);
  });

  test('getLatestVersion', () => {
    const versions: GlobalVersion[] = [
      {
        name: 'version1',
        path: '/???',
        docs: [],
        mainDocId: '???',
      },
      {
        name: 'version2',
        path: '/???',
        docs: [],
        mainDocId: '???',
      },
      {
        name: 'version3',
        path: '/???',
        docs: [],
        mainDocId: '???',
      },
    ];

    expect(
      getLatestVersion({
        path: '???',
        latestVersionName: 'does not exist',
        versions,
      }),
    ).toEqual(undefined);
    expect(
      getLatestVersion({
        path: '???',
        latestVersionName: 'version1',
        versions,
      })?.name,
    ).toEqual('version1');
    expect(
      getLatestVersion({
        path: '???',
        latestVersionName: 'version2',
        versions,
      })?.name,
    ).toEqual('version2');
    expect(
      getLatestVersion({
        path: '???',
        latestVersionName: 'version3',
        versions,
      })?.name,
    ).toEqual('version3');
  });

  test('getActiveVersion', () => {
    const data: GlobalPluginData = {
      path: 'docs',
      latestVersionName: 'version2',
      versions: [
        {
          name: 'next',
          path: '/docs/next',
          docs: [],
          mainDocId: '???',
        },
        {
          name: 'version2',
          path: '/docs',
          docs: [],
          mainDocId: '???',
        },
        {
          name: 'version1',
          path: '/docs/version1',
          docs: [],
          mainDocId: '???',
        },
      ],
    };
    expect(getActiveVersion(data, '/docs/next')?.name).toEqual('next');
    expect(getActiveVersion(data, '/docs/next/')?.name).toEqual('next');
    expect(getActiveVersion(data, '/docs/next/someDoc')?.name).toEqual('next');

    expect(getActiveVersion(data, '/docs')?.name).toEqual('version2');
    expect(getActiveVersion(data, '/docs/')?.name).toEqual('version2');
    expect(getActiveVersion(data, '/docs/someDoc')?.name).toEqual('version2');

    expect(getActiveVersion(data, '/docs/version1')?.name).toEqual('version1');
    expect(getActiveVersion(data, '/docs/version1')?.name).toEqual('version1');
    expect(getActiveVersion(data, '/docs/version1/someDoc')?.name).toEqual(
      'version1',
    );
  });

  test('getActiveDocContext', () => {
    const versionNext: GlobalVersion = {
      name: 'next',
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
      ],
    };

    const version2: GlobalVersion = {
      name: 'version2',
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
      ],
    };

    const version1: GlobalVersion = {
      name: 'version1',
      path: '/docs/version1',
      mainDocId: 'doc1',
      docs: [
        {
          id: 'doc1',
          path: '/docs/version1/',
        },
      ],
    };

    // shuffle, because order shouldn't matter
    const versions: GlobalVersion[] = shuffle([
      versionNext,
      version2,
      version1,
    ]);

    const data: GlobalPluginData = {
      path: 'docs',
      latestVersionName: 'version2',
      versions,
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

  test('getDocVersionSuggestions', () => {
    const versionNext: GlobalVersion = {
      name: 'next',
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
      ],
    };

    const version2: GlobalVersion = {
      name: 'version2',
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
      ],
    };

    const version1: GlobalVersion = {
      name: 'version1',
      path: '/docs/version1',
      mainDocId: 'doc1',
      docs: [
        {
          id: 'doc1',
          path: '/docs/version1/',
        },
      ],
    };

    // shuffle, because order shouldn't matter
    const versions: GlobalVersion[] = shuffle([
      versionNext,
      version2,
      version1,
    ]);

    const data: GlobalPluginData = {
      path: 'docs',
      latestVersionName: 'version2',
      versions,
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

    // nothing to suggest, we are already on latest version
    expect(getDocVersionSuggestions(data, '/docs/')).toEqual({
      latestDocSuggestion: undefined,
      latestVersionSuggestion: undefined,
    });
    expect(getDocVersionSuggestions(data, '/docs/doc2')).toEqual({
      latestDocSuggestion: undefined,
      latestVersionSuggestion: undefined,
    });

    expect(getDocVersionSuggestions(data, '/docs/version1/')).toEqual({
      latestDocSuggestion: version2.docs[0],
      latestVersionSuggestion: version2,
    });
    expect(getDocVersionSuggestions(data, '/docs/version1/doc2')).toEqual({
      latestDocSuggestion: undefined, // because /docs/version1/doc2 does not exist
      latestVersionSuggestion: version2,
    });
  });
});
