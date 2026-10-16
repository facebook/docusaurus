/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @vitest-environment jsdom
import {beforeEach, describe, expect, it, vi} from 'vitest';
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
    function runScript(script: string) {
      eval(script);
    }

    beforeEach(() => {
      localStorage.clear();
      document.documentElement.removeAttribute(
        'data-announcement-bar-initially-dismissed',
      );
    });

    it('matches snapshot for default options', () => {
      expect(
        getAnnouncementBarInlineScript({
          siteStorage: {type: 'localStorage', namespace: ''},
        }),
      ).toMatchSnapshot();
    });

    it('matches snapshot for custom announcement bar', () => {
      expect(
        getAnnouncementBarInlineScript({
          siteStorage: {type: 'localStorage', namespace: ''},
          announcementBar: {
            id: 'announcement-v2',
            isCloseable: true,
          },
        }),
      ).toMatchSnapshot();
    });

    it('matches snapshot for non-closeable announcement bar', () => {
      expect(
        getAnnouncementBarInlineScript({
          siteStorage: {type: 'localStorage', namespace: ''},
          announcementBar: {
            id: 'announcement-v2',
            isCloseable: false,
          },
        }),
      ).toMatchSnapshot();
    });

    it('sets attribute to false when no dismissal is stored in localStorage', () => {
      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar: {id: 'announcement-v1', isCloseable: true},
      });
      runScript(script);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('false');
    });

    it('sets attribute to true when stored dismissal matches current id', () => {
      localStorage.setItem('docusaurus.announcement.dismiss', 'true');
      localStorage.setItem('docusaurus.announcement.id', 'announcement-v1');

      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar: {id: 'announcement-v1', isCloseable: true},
      });
      runScript(script);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('true');
    });

    it('sets attribute to false when stored dismissal is for a different older id', () => {
      localStorage.setItem('docusaurus.announcement.dismiss', 'true');
      localStorage.setItem('docusaurus.announcement.id', 'announcement-v1');

      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar: {id: 'announcement-v2', isCloseable: true},
      });
      runScript(script);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('false');
    });

    it('handles retrocompatibility for misspelled default id', () => {
      // cSpell:ignore annoucement
      localStorage.setItem('docusaurus.announcement.dismiss', 'true');
      localStorage.setItem('docusaurus.announcement.id', 'annoucement-bar');

      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar: {id: 'announcement-bar', isCloseable: true},
      });
      runScript(script);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('true');
    });

    it('sets attribute to false when isCloseable is false even if dismissal is stored', () => {
      localStorage.setItem('docusaurus.announcement.dismiss', 'true');
      localStorage.setItem('docusaurus.announcement.id', 'announcement-v1');

      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar: {id: 'announcement-v1', isCloseable: false},
      });
      runScript(script);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('false');
    });

    it('safely handles localStorage getItem failure', () => {
      const getItemSpy = vi
        .spyOn(Storage.prototype, 'getItem')
        .mockImplementation(() => {
          throw new Error('SecurityError: Access is denied');
        });

      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar: {id: 'announcement-v1', isCloseable: true},
      });
      runScript(script);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('false');

      getItemSpy.mockRestore();
    });

    it('respects siteStorage namespace', () => {
      localStorage.setItem('docusaurus.announcement.dismiss_docs', 'true');
      localStorage.setItem(
        'docusaurus.announcement.id_docs',
        'announcement-v1',
      );

      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: '_docs'},
        announcementBar: {id: 'announcement-v1', isCloseable: true},
      });
      runScript(script);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('true');
    });
  });
});
