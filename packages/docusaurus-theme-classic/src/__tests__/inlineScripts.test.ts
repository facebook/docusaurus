/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import {
  getAnnouncementBarInlineScript,
  getThemeInlineScript,
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

  describe('announcement bar', () => {
    function getInitiallyDismissed(
      announcementBarId: string,
      storage: {[key: string]: string},
    ): string | undefined {
      const attributes: {[name: string]: string} = {};
      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBarId,
      });
      new Function('localStorage', 'document', script)(
        {getItem: (key: string) => storage[key] ?? null},
        {
          documentElement: {
            setAttribute: (name: string, value: unknown) => {
              attributes[name] = String(value);
            },
          },
        },
      );
      return attributes['data-announcement-bar-initially-dismissed'];
    }

    it('inline javascript', () => {
      expect(
        getAnnouncementBarInlineScript({
          siteStorage: {type: 'localStorage', namespace: ''},
          announcementBarId: 'announcement-bar',
        }),
      ).toMatchSnapshot();
    });

    it('is dismissed when the current announcement was dismissed', () => {
      expect(
        getInitiallyDismissed('announcement-1', {
          'docusaurus.announcement.id': 'announcement-1',
          'docusaurus.announcement.dismiss': 'true',
        }),
      ).toBe('true');
    });

    it('is not dismissed when a previous announcement was dismissed', () => {
      expect(
        getInitiallyDismissed('announcement-2', {
          'docusaurus.announcement.id': 'announcement-1',
          'docusaurus.announcement.dismiss': 'true',
        }),
      ).toBe('false');
    });

    it('is not dismissed when no announcement was viewed', () => {
      expect(getInitiallyDismissed('announcement-1', {})).toBe('false');
    });

    it('treats the misspelled legacy id as the default id', () => {
      expect(
        getInitiallyDismissed('announcement-bar', {
          // cSpell:ignore annoucement
          'docusaurus.announcement.id': 'annoucement-bar',
          'docusaurus.announcement.dismiss': 'true',
        }),
      ).toBe('true');
    });
  });
});
