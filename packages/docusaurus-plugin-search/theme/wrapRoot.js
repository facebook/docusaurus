/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useState, useCallback} from 'react';
import {FuseContext} from '@theme/useSearch';

const Wrapper = (props) => {
  const [fuse, setFuse] = useState(undefined);
  const [cache, setCache] = useState({});
  const getFromCache = useCallback((term) => {
    return cache[term];
  });
  const setToCache = useCallback((term, value) => {
    setCache({...cache, [term]: value});
  });
  return (
    <FuseContext.Provider
      value={{fuse, setFuse, getFromCache, setToCache}}
      {...props}
    />
  );
};

export default (element) => <Wrapper>{element} </Wrapper>;
