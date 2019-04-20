/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Perimeter from 'react-perimeter';
import {NavLink} from 'react-router-dom';

const internalRegex = /^\/(?!\/)/;

function Link(props) {
  const {to, href, preloadProximity = 20} = props;
  const targetLink = to || href;
  const isInternal = internalRegex.test(targetLink);
  return !targetLink || !isInternal ? (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a {...props} href={targetLink} />
  ) : (
    <Perimeter
      padding={preloadProximity}
      onBreach={() => window.__docusaurus.preload(targetLink)}
      once>
      <NavLink {...props} to={targetLink} />
    </Perimeter>
  );
}

export default Link;
