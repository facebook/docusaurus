/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const STORAGE_DISMISS_KEY = 'docusaurus.announcement.dismiss';
const STORAGE_ID_KEY = 'docusaurus.announcement.id';

const useAnnouncementBar = (): {
  isAnnouncementBarClosed: boolean;
  closeAnnouncementBar: () => void;
} => {
  const {
    siteConfig: {themeConfig: {announcementBar: {id} = {}}} = {},
  } = useDocusaurusContext();
  const [isClosed, setClosed] = useState(true);
  const handleClose = () => {
    localStorage.setItem(STORAGE_DISMISS_KEY, 'true');
    setClosed(true);
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    const viewedId = localStorage.getItem(STORAGE_ID_KEY);
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
