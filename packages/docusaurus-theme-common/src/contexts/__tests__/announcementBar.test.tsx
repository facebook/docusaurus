/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @vitest-environment jsdom
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ReactNode} from 'react';
import {renderHook, render, act, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import {AnnouncementBarProvider, useAnnouncementBar} from '../announcementBar';
import {getAnnouncementBarInlineScript} from '../../../../docusaurus-theme-classic/src/inlineScripts';
import type {ThemeConfig} from '../../utils/useThemeConfig';

type AnnouncementBarConfig = NonNullable<ThemeConfig['announcementBar']>;

let mockAnnouncementBar: AnnouncementBarConfig | undefined;

vi.mock('@generated/site-storage', () => ({
  default: {
    type: 'localStorage',
    namespace: '',
  },
}));

vi.mock('../../utils/useThemeConfig', () => ({
  useThemeConfig: () => ({
    announcementBar: mockAnnouncementBar,
  }),
}));

function wrapper({children}: {children: ReactNode}) {
  return <AnnouncementBarProvider>{children}</AnnouncementBarProvider>;
}

describe('announcementBar context', () => {
  beforeEach(() => {
    localStorage.clear();
    mockAnnouncementBar = {
      id: 'announcement-v1',
      content: 'Important Announcement',
      isCloseable: true,
      backgroundColor: '#fff',
      textColor: '#000',
    };
  });

  afterEach(() => {
    cleanup();
  });

  it('throws error when useAnnouncementBar is used outside provider', () => {
    expect(() => {
      renderHook(() => useAnnouncementBar());
    }).toThrowErrorMatchingInlineSnapshot(
      `[ReactContextError: Hook useAnnouncementBar is called outside the <AnnouncementBarProvider>. ]`,
    );
  });

  it('is not active when announcementBar is undefined', () => {
    mockAnnouncementBar = undefined;
    const {result} = renderHook(() => useAnnouncementBar(), {wrapper});
    expect(result.current.isActive).toBe(false);
  });

  it('is active when no dismissal is stored in localStorage', () => {
    const {result} = renderHook(() => useAnnouncementBar(), {wrapper});
    expect(result.current.isActive).toBe(true);
  });

  it('remains inactive when stored dismissal matches current id', () => {
    localStorage.setItem('docusaurus.announcement.dismiss', 'true');
    localStorage.setItem('docusaurus.announcement.id', 'announcement-v1');

    const {result} = renderHook(() => useAnnouncementBar(), {wrapper});
    expect(result.current.isActive).toBe(false);
  });

  it('is active on first load when stored dismissal is for an older id', () => {
    localStorage.setItem('docusaurus.announcement.dismiss', 'true');
    localStorage.setItem('docusaurus.announcement.id', 'announcement-old');

    const {result} = renderHook(() => useAnnouncementBar(), {wrapper});

    expect(result.current.isActive).toBe(true);
    expect(localStorage.getItem('docusaurus.announcement.id')).toBe(
      'announcement-v1',
    );
    expect(localStorage.getItem('docusaurus.announcement.dismiss')).toBe(
      'false',
    );
  });

  it('handles retrocompatibility for misspelled default id', () => {
    // cSpell:ignore annoucement
    mockAnnouncementBar!.id = 'announcement-bar';
    localStorage.setItem('docusaurus.announcement.dismiss', 'true');
    localStorage.setItem('docusaurus.announcement.id', 'annoucement-bar');

    const {result} = renderHook(() => useAnnouncementBar(), {wrapper});
    expect(result.current.isActive).toBe(false);
  });

  it('dismisses announcement when close() is called', () => {
    const {result} = renderHook(() => useAnnouncementBar(), {wrapper});
    expect(result.current.isActive).toBe(true);

    act(() => {
      result.current.close();
    });

    expect(result.current.isActive).toBe(false);
    expect(localStorage.getItem('docusaurus.announcement.dismiss')).toBe(
      'true',
    );
    expect(localStorage.getItem('docusaurus.announcement.id')).toBe(
      'announcement-v1',
    );
  });

  it('is active when isCloseable is false even if dismissal is stored', () => {
    mockAnnouncementBar!.isCloseable = false;
    localStorage.setItem('docusaurus.announcement.dismiss', 'true');
    localStorage.setItem('docusaurus.announcement.id', 'announcement-v1');

    const {result} = renderHook(() => useAnnouncementBar(), {wrapper});
    expect(result.current.isActive).toBe(true);
  });

  describe('inline script and React visibility interaction', () => {
    function AnnouncementBarConsumer() {
      const {isActive, close} = useAnnouncementBar();
      if (!isActive) {
        return null;
      }
      return (
        <div className="announcementBar" role="banner">
          <span>{mockAnnouncementBar?.content}</span>
          <button type="button" onClick={close}>
            Close
          </button>
        </div>
      );
    }

    function runScript(announcementBar?: AnnouncementBarConfig) {
      const script = getAnnouncementBarInlineScript({
        siteStorage: {type: 'localStorage', namespace: ''},
        announcementBar,
      });
      eval(script);
    }

    it('shows announcement bar on first load when older id was dismissed', () => {
      localStorage.setItem('docusaurus.announcement.dismiss', 'true');
      localStorage.setItem('docusaurus.announcement.id', 'announcement-old');

      mockAnnouncementBar = {
        id: 'announcement-new',
        content: 'New Announcement Message',
        isCloseable: true,
        backgroundColor: '#fff',
        textColor: '#000',
      };

      // 1. Inline script runs before React hydration
      runScript(mockAnnouncementBar);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('false');

      // 2. React component mounts
      const {getByRole, getByText} = render(
        <AnnouncementBarProvider>
          <AnnouncementBarConsumer />
        </AnnouncementBarProvider>,
      );

      expect(getByRole('banner')).toBeInTheDocument();
      expect(getByText('New Announcement Message')).toBeInTheDocument();
      expect(localStorage.getItem('docusaurus.announcement.id')).toBe(
        'announcement-new',
      );
      expect(localStorage.getItem('docusaurus.announcement.dismiss')).toBe(
        'false',
      );
    });

    it('keeps announcement bar dismissed when current id was dismissed', () => {
      localStorage.setItem('docusaurus.announcement.dismiss', 'true');
      localStorage.setItem('docusaurus.announcement.id', 'announcement-v1');

      // 1. Inline script runs before React hydration
      runScript(mockAnnouncementBar);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('true');

      // 2. React component mounts
      const {queryByRole} = render(
        <AnnouncementBarProvider>
          <AnnouncementBarConsumer />
        </AnnouncementBarProvider>,
      );

      expect(queryByRole('banner')).not.toBeInTheDocument();
    });

    it('shows announcement bar when no previous dismissal was stored', () => {
      // 1. Inline script runs before React hydration
      runScript(mockAnnouncementBar);
      expect(
        document.documentElement.getAttribute(
          'data-announcement-bar-initially-dismissed',
        ),
      ).toBe('false');

      // 2. React component mounts
      const {getByRole} = render(
        <AnnouncementBarProvider>
          <AnnouncementBarConsumer />
        </AnnouncementBarProvider>,
      );

      expect(getByRole('banner')).toBeInTheDocument();
    });
  });
});
