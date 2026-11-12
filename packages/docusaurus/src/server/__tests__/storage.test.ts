/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {createSiteStorage} from '../storage';
import {DEFAULT_STORAGE_CONFIG} from '../configValidation';
import type {StorageConfig, SiteStorage} from '@docusaurus/types';

function test({
  url = 'https://docusaurus.io',
  baseUrl = '/',
  storage = {},
}: {
  url?: string;
  baseUrl?: string;
  storage?: Partial<StorageConfig>;
}): SiteStorage {
  return createSiteStorage({
    url,
    baseUrl,
    storage: {
      ...DEFAULT_STORAGE_CONFIG,
      ...storage,
    },
  });
}

// Storage is namespaced by default, from url + baseUrl
// https://docusaurus.io/ => -070
const DefaultSiteStorage: SiteStorage = {
  type: 'localStorage',
  namespace: '-070',
};

describe('storage', () => {
  it('default', () => {
    expect(test({})).toEqual(DefaultSiteStorage);
  });

  describe('type', () => {
    it('localStorage', () => {
      expect(test({storage: {type: 'localStorage'}})).toEqual({
        ...DefaultSiteStorage,
        type: 'localStorage',
      });
    });

    it('sessionStorage', () => {
      expect(test({storage: {type: 'sessionStorage'}})).toEqual({
        ...DefaultSiteStorage,
        type: 'sessionStorage',
      });
    });
  });

  describe('namespace', () => {
    describe('true', () => {
      function testAutomaticNamespace(
        {
          url,
          baseUrl,
        }: {
          url: string;
          baseUrl: string;
        },
        expectedNamespace: string,
      ) {
        return expect(test({url, baseUrl, storage: {namespace: true}})).toEqual(
          expect.objectContaining({namespace: expectedNamespace}),
        );
      }

      it('automatic namespace - https://docusaurus.io/', () => {
        testAutomaticNamespace(
          {
            url: 'https://docusaurus.io',
            baseUrl: '/',
          },
          '-070',
        );
      });

      it('automatic namespace - https://docusaurus.io/baseUrl/', () => {
        testAutomaticNamespace(
          {
            url: 'https://docusaurus.io',
            baseUrl: '/baseUrl/',
          },
          '-87b',
        );
      });

      it('automatic namespace - https://example.com/', () => {
        testAutomaticNamespace(
          {
            url: 'https://example.com',
            baseUrl: '/',
          },
          '-0f1',
        );
      });

      it('automatic namespace - https://example.com/baseUrl/', () => {
        testAutomaticNamespace(
          {
            url: 'https://example.com',
            baseUrl: '/baseUrl/',
          },
          '-78f',
        );
      });

      it('automatic namespace - is not slash sensitive', () => {
        const expectedNamespace = '-87b';
        testAutomaticNamespace(
          {
            url: 'https://docusaurus.io',
            baseUrl: '/baseUrl/',
          },
          expectedNamespace,
        );
        testAutomaticNamespace(
          {
            url: 'https://docusaurus.io/',
            baseUrl: '/baseUrl/',
          },
          expectedNamespace,
        );
        testAutomaticNamespace(
          {
            url: 'https://docusaurus.io/',
            baseUrl: '/baseUrl',
          },
          expectedNamespace,
        );
        testAutomaticNamespace(
          {
            url: 'https://docusaurus.io',
            baseUrl: 'baseUrl',
          },
          expectedNamespace,
        );
      });
    });

    it('false', () => {
      expect(test({storage: {namespace: false}})).toEqual({
        ...DefaultSiteStorage,
        namespace: '',
      });
    });

    it('string', () => {
      expect(test({storage: {namespace: 'my-namespace'}})).toEqual({
        ...DefaultSiteStorage,
        namespace: '-my-namespace',
      });
    });
  });
});
