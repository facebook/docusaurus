/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {NavLink} from 'react-router-dom';

function Link(props) {
  const {to} = props;
  const isExternal = /^(https?:|\/\/)/.test(to);
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return isExternal ? <a {...props} href={to} /> : <NavLink {...props} />;
}

export default Link;
