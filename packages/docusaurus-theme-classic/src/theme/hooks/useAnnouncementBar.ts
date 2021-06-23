/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect, useCallback} from 'react';
import {useThemeConfig, createStorageSlot} from '@docusaurus/theme-common';
import type {useAnnouncementBarReturns} from '@theme/hooks/useAnnouncementBar';

// TODO dpplicated string literals: find a way to factorize
const DismissStorageKey = 'docusaurus.announcement.dismiss';
const DismissDataAttribute = 'data-announcement-bar-dismissed';

const IdStorageKey = 'docusaurus.announcement.id';

const DismissStorage = createStorageSlot(DismissStorageKey);
const IdStorage = createStorageSlot(IdStorageKey);

const useAnnouncementBar = (): useAnnouncementBarReturns => {
  const {announcementBar} = useThemeConfig();

  // Always visible on the server + hydration: prevent layout shifts
  const [isClosed, setClosed] = useState(false);
  // If dismissed: hide it asap with inlined JS/data-attribute/CSS + update state after hydration
  useEffect(() => {
    setClosed(
      document.documentElement.getAttribute(DismissDataAttribute) === 'true',
    );
  }, []);

  const handleClose = useCallback(() => {
    DismissStorage.set('true');
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
      DismissStorage.set('false');
    }

    if (isNewAnnouncement || DismissStorage.get() === 'false') {
      setClosed(false);
    }
  }, []);

  return {
    isAnnouncementBarClosed: isClosed,
    closeAnnouncementBar: handleClose,
  };
};

export default useAnnouncementBar;
