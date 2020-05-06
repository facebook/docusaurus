/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useCallback} from 'react';

import SidebarContext from '@theme/SidebarContext';

function SidebarProvider(props) {
  const [sidebarShown, setSidebarShown] = useState(false);
  const handleSidebarToggle = useCallback(() => {
    setSidebarShown(!sidebarShown);
  }, [sidebarShown, setSidebarShown]);

  return (
    <SidebarContext.Provider
      value={{sidebarShown, setSidebarShown, handleSidebarToggle}}>
      {props.children}
    </SidebarContext.Provider>
  );
}

export default SidebarProvider;
