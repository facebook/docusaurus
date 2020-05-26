/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';
import AnnouncementBarContext from '@theme/AnnouncementBarContext';

function useAnnouncementBarContext() {
  return useContext(AnnouncementBarContext);
}

export default useAnnouncementBarContext;
