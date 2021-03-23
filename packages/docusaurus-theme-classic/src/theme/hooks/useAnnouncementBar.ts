/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect, useCallback} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import type {useAnnouncementBarReturns} from '@theme/hooks/useAnnouncementBar';
import {createStorageSlot} from '@docusaurus/core/src/localStorage';

const STORAGE_DISMISS_KEY = 'docusaurus.announcement.dismiss';
const STORAGE_ID_KEY = 'docusaurus.announcement.id';

const useAnnouncementBar = (): useAnnouncementBarReturns => {
  const {announcementBar} = useThemeConfig();

  const [isClosed, setClosed] = useState(true);

  const dismissStorage = createStorageSlot(STORAGE_DISMISS_KEY);
  const idStorage = createStorageSlot(STORAGE_ID_KEY);

  const handleClose = useCallback(() => {
    dismissStorage?.set('true');
    setClosed(true);
  }, []);

  useEffect(() => {
    if (!announcementBar) {
      return;
    }
    const {id} = announcementBar;

    let viewedId = idStorage?.get();

    // retrocompatibility due to spelling mistake of default id
    // see https://github.com/facebook/docusaurus/issues/3338
    if (viewedId === 'annoucement-bar') {
      viewedId = 'announcement-bar';
    }

    const isNewAnnouncement = id !== viewedId;

    idStorage?.set(id);

    if (isNewAnnouncement) {
      dismissStorage?.set('false');
    }

    if (isNewAnnouncement || dismissStorage?.get() === 'false') {
      setClosed(false);
    }
  }, []);

  return {
    isAnnouncementBarClosed: isClosed,
    closeAnnouncementBar: handleClose,
  };
};

export default useAnnouncementBar;
