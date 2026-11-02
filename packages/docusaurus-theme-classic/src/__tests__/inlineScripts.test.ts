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
          respectPrefersColorScheme: true,
        },
        siteStorage: {
          type: 'localStorage',
          namespace: '',
        },
      }),
    ).toMatchSnapshot();
  });

  it('inline javascript for default mode and no switch', () => {
    expect(
      getThemeInlineScript({
        colorMode: {
          disableSwitch: true,
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

  it('inline javascript for announcement bar', () => {
    const script = getAnnouncementBarInlineScript({
      siteStorage: {
        type: 'localStorage',
        namespace: '',
      },
      announcementBar: {
        id: 'announcement-1',
      },
    });

    expect(script).toContain(
      'localStorage.getItem(\'docusaurus.announcement.id\') !== "announcement-1"',
    );
    expect(script).toContain(
      "localStorage.getItem('docusaurus.announcement.dismiss') === 'true'",
    );
    expect(script).toContain(
      "document.documentElement.setAttribute('data-announcement-bar-initially-dismissed', isDismissed())",
    );
  });

  it('inline javascript for announcement bar with custom namespace', () => {
    const script = getAnnouncementBarInlineScript({
      siteStorage: {
        type: 'localStorage',
        namespace: '-docs',
      },
      announcementBar: {
        id: 'announcement-2',
      },
    });

    expect(script).toContain(
      'localStorage.getItem(\'docusaurus.announcement.id-docs\') !== "announcement-2"',
    );
    expect(script).toContain(
      "localStorage.getItem('docusaurus.announcement.dismiss-docs') === 'true'",
    );
  });
});
