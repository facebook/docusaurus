/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  useContext,
  createContext,
} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {createStorageSlot} from './storageUtils';
import {useThemeConfig} from './useThemeConfig';

export const AnnouncementBarDismissStorageKey =
  'docusaurus.announcement.dismiss';
const AnnouncementBarIdStorageKey = 'docusaurus.announcement.id';

const AnnouncementBarDismissStorage = createStorageSlot(
  AnnouncementBarDismissStorageKey,
);
const IdStorage = createStorageSlot(AnnouncementBarIdStorageKey);

const isDismissedInStorage = () =>
  AnnouncementBarDismissStorage.get() === 'true';
const setDismissedInStorage = (bool: boolean) =>
  AnnouncementBarDismissStorage.set(String(bool));

type AnnouncementBarAPI = {
  readonly isActive: boolean;
  readonly close: () => void;
};

const useAnnouncementBarContextValue = (): AnnouncementBarAPI => {
  const {announcementBar} = useThemeConfig();
  const isBrowser = useIsBrowser();

  const [isClosed, setClosed] = useState(() =>
    isBrowser
      ? // On client navigation: init with localstorage value
        isDismissedInStorage()
      : // On server/hydration: always visible to prevent layout shifts (will be hidden with css if needed)
        false,
  );
  // Update state after hydration
  useEffect(() => {
    setClosed(isDismissedInStorage());
  }, []);

  const handleClose = useCallback(() => {
    setDismissedInStorage(true);
    setClosed(true);
  }, []);

  useEffect(() => {
    if (!announcementBar) {
      return;
    }
    const {id} = announcementBar;

    let viewedId = IdStorage.get();

    // retrocompatibility due to spelling mistake of default id
    // see https://github.com/facebook/docusaurus/issues/3338
    if (viewedId === 'annoucement-bar') {
      viewedId = 'announcement-bar';
    }

    const isNewAnnouncement = id !== viewedId;

    IdStorage.set(id);

    if (isNewAnnouncement) {
      setDismissedInStorage(false);
    }

    if (isNewAnnouncement || !isDismissedInStorage()) {
      setClosed(false);
    }
  }, [announcementBar]);

  return useMemo(
    () => ({
      isActive: !!announcementBar && !isClosed,
      close: handleClose,
    }),
    [announcementBar, isClosed, handleClose],
  );
};

const AnnouncementBarContext = createContext<AnnouncementBarAPI | null>(null);

export function AnnouncementBarProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const value = useAnnouncementBarContextValue();
  return (
    <AnnouncementBarContext.Provider value={value}>
      {children}
    </AnnouncementBarContext.Provider>
  );
}

export const useAnnouncementBar = (): AnnouncementBarAPI => {
  const api = useContext(AnnouncementBarContext);
  if (!api) {
    throw new Error(
      'useAnnouncementBar(): AnnouncementBar not found in React context: make sure to use the AnnouncementBarProvider on top of the tree',
    );
  }
  return api;
};
