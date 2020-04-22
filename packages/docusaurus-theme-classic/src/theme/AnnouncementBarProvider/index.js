/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import AnnouncementBarContext from '@theme/AnnouncementBarContext';
import useAnnouncementBar from '@theme/hooks/useAnnouncementBar';

function AnnouncementBarProvider(props) {
  const {isAnnouncementBarClosed, closeAnnouncementBar} = useAnnouncementBar();

  return (
    <AnnouncementBarContext.Provider
      value={{isAnnouncementBarClosed, closeAnnouncementBar}}>
      {props.children}
    </AnnouncementBarContext.Provider>
  );
}

export default AnnouncementBarProvider;
