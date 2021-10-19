/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect, useCallback} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import type {useAnnouncementBarReturns} from '@theme/hooks/useAnnouncementBar';

const STORAGE_DISMISS_KEY = 'docusaurus.announcement.dismiss';
const STORAGE_ID_KEY = 'docusaurus.announcement.id';

const useAnnouncementBar = (): useAnnouncementBarReturns => {
  const {announcementBar} = useThemeConfig();

  const [isClosed, setClosed] = useState(true);

  const handleClose = useCallback(() => {
    localStorage.setItem(STORAGE_DISMISS_KEY, 'true');
    setClosed(true);
  }, []);

  useEffect(() => {
    if (!announcementBar) {
      return;
    }
    const {id} = announcementBar;

    let viewedId = localStorage.getItem(STORAGE_ID_KEY);

    // retrocompatibility due to spelling mistake of default id
    // see https://github.com/facebook/docusaurus/issues/3338
    if (viewedId === 'annoucement-bar') {
      viewedId = 'announcement-bar';
    }

    const isNewAnnouncement = id !== viewedId;

    localStorage.setItem(STORAGE_ID_KEY, id);

    if (isNewAnnouncement) {
      localStorage.setItem(STORAGE_DISMISS_KEY, 'false');
    }

    if (
      isNewAnnouncement ||
      localStorage.getItem(STORAGE_DISMISS_KEY) === 'false'
    ) {
      setClosed(false);
    }
  }, []);

  return {
    isAnnouncementBarClosed: isClosed,
    closeAnnouncementBar: handleClose,
  };
};

export default useAnnouncementBar;
