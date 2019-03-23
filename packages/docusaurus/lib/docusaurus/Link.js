/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {NavLink} from 'react-router-dom';

const externalRegex = /^(https?:|\/\/)/;

function Link(props) {
  const {to, href} = props;
  const targetLink = to || href;
  const isExternal = externalRegex.test(targetLink);
  return !targetLink || isExternal ? (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a {...props} href={targetLink} />
  ) : (
    <NavLink {...props} to={targetLink} />
  );
}

export default Link;
