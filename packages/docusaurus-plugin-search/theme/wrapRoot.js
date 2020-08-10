/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, {useState} from 'react';
import {FuseContext} from '@theme/useSearch';

const Wrapper = (props) => {
  const [fuse, setFuse] = useState(undefined);
  return <FuseContext.Provider value={{fuse, setFuse}} {...props} />;
};

export default (element) => <Wrapper>{element} </Wrapper>;
