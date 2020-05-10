/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect} from 'react';

function getClientWidth() {
  return document.body.clientWidth;
}

function useResizeWindow() {
  const [clientWidth, setClientWidth] = useState(getClientWidth());

  const handleResize = () => {
    const currentClientWidth = getClientWidth();
    setClientWidth(currentClientWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  });

  return clientWidth;
}

export default useResizeWindow;
