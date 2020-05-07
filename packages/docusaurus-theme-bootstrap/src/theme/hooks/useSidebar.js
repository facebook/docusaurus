/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useState} from 'react';

function useSidebar() {
  const [sidebarShown, setSidebarShown] = useState(true);
  const handleSidebarToggle = () => {
    setSidebarShown(!sidebarShown);
  };

  return {
    sidebarShown,
    setSidebarShown,
    handleSidebarToggle,
  };
}

export default useSidebar;
