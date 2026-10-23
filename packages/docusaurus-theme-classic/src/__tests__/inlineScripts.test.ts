/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {
  getThemeInlineScript,
  getAnnouncementBarInlineScript,
} from '../inlineScripts';

describe('inlineScripts', () => {
  it('inline javascript for default options', () => {
    expect(
      getThemeInlineScript({
        colorMode: {
          disableSwitch: false,
          defaultMode: 'light',
          respectPrefersColorScheme: false,
        },
        siteStorage: {
          type: 'localStorage',
          namespace: '',
        },
      }),
    ).toMatchSnapshot();
  });

  it('inline javascript for prefers color scheme and no switch', () => {
    expect(
      getThemeInlineScript({
        colorMode: {
          disableSwitch: true,
          defaultMode: 'light',
          respectPrefersColorScheme: true,
        },
        siteStorage: {
          type: 'localStorage',
          namespace: '',
        },
      }),
    ).toMatchSnapshot();
  });

  describe('getAnnouncementBarInlineScript', () => {
    function executeInlineScript(
      script: string,
      storage: Record<string, string> = {},
    ) {
      let attributeValue: string | null = null;
      const originalLocalStorage = globalThis.localStorage;
      const originalDocument = globalThis.document;

      try {
        globalThis.localStorage = {
          getItem: (key: string) => storage[key] ?? null,
        } as Storage;

        globalThis.document = {
          documentElement: {
            setAttribute: (name: string, value: string) => {
              if (name === 'data-announcement-bar-initially-dismissed') {
                attributeValue = String(value);
              }
            },
          },
        } as unknown as Document;

        // eslint-disable-next-line no-eval
        eval(script);
        return attributeValue;
      } finally {
        globalThis.localStorage = originalLocalStorage;
        globalThis.document = originalDocument;
      }
    }

    it('returns false when no dismissed state is stored', () => {
      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar: {
          id: 'announcement-1',
          content: 'Hello',
          isCloseable: true,
        },
      });

      expect(executeInlineScript(script, {})).toBe('false');
    });

    it('returns true when current announcement id is dismissed', () => {
      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar: {
          id: 'announcement-1',
          content: 'Hello',
          isCloseable: true,
        },
      });

      expect(
        executeInlineScript(script, {
          'docusaurus.announcement.dismiss': 'true',
          'docusaurus.announcement.id': 'announcement-1',
        }),
      ).toBe('true');
    });

    it('returns false on first load when previous announcement id was dismissed but new id configured (closes #12646)', () => {
      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar: {
          id: 'announcement-2',
          content: 'New Announcement',
          isCloseable: true,
        },
      });

      expect(
        executeInlineScript(script, {
          'docusaurus.announcement.dismiss': 'true',
          'docusaurus.announcement.id': 'announcement-1',
        }),
      ).toBe('false');
    });

    it('supports legacy misspelled annoucement-bar id with default id', () => {
      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
      });

      expect(
        executeInlineScript(script, {
          'docusaurus.announcement.dismiss': 'true',
          'docusaurus.announcement.id': 'annoucement-bar',
        }),
      ).toBe('true');
    });
  });
});
