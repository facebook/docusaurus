/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it, vi} from 'vitest';
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

  describe('getAnnouncementBarInlineScript', () => {
    // Runs the produced inline script against a mocked localStorage and returns
    // the value of the `data-announcement-bar-initially-dismissed` attribute it
    // sets on <html>, i.e. whether the bar will be hidden before hydration.
    function runInlineScript({
      announcementId,
      storedDismiss,
      storedId,
    }: {
      announcementId: string;
      storedDismiss?: string;
      storedId?: string;
    }): string {
      const store: Record<string, string> = {};
      if (storedDismiss !== undefined) {
        store['docusaurus.announcement.dismiss'] = storedDismiss;
      }
      if (storedId !== undefined) {
        store['docusaurus.announcement.id'] = storedId;
      }
      let dismissedAttribute = '<unset>';
      const setAttributeMock = vi.fn((name: string, value: string) => {
        if (name === 'data-announcement-bar-initially-dismissed') {
          dismissedAttribute = String(value);
        }
      });
      const script = getAnnouncementBarInlineScript({
        announcementId,
        siteStorage: {type: 'localStorage', namespace: ''},
      });
      new Function('localStorage', 'document', script)(
        {getItem: (key: string) => store[key] ?? null},
        {documentElement: {setAttribute: setAttributeMock}},
      );
      return dismissedAttribute;
    }

    it('shows a brand new announcement (nothing stored yet)', () => {
      expect(runInlineScript({announcementId: 'announcement-2'})).toBe('false');
    });

    it('keeps the bar dismissed when the same announcement was closed', () => {
      expect(
        runInlineScript({
          announcementId: 'announcement-2',
          storedDismiss: 'true',
          storedId: 'announcement-2',
        }),
      ).toBe('true');
    });

    it('re-shows the bar for a new id after a previous one was dismissed', () => {
      // Regression test: users who dismissed "announcement-1" must immediately
      // see "announcement-2", instead of only on a second page load.
      expect(
        runInlineScript({
          announcementId: 'announcement-2',
          storedDismiss: 'true',
          storedId: 'announcement-1',
        }),
      ).toBe('false');
    });

    it('stays visible when the current announcement is not dismissed', () => {
      expect(
        runInlineScript({
          announcementId: 'announcement-2',
          storedDismiss: 'false',
          storedId: 'announcement-2',
        }),
      ).toBe('false');
    });
  });
});
