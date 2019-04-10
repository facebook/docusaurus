/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useContext} from 'react';
import Perimeter from 'react-perimeter';
import {NavLink} from 'react-router-dom';

import DocusaurusContext from '@docusaurus/context';

import preload from '../preload';

const externalRegex = /^(https?:|\/\/)/;

function Link(props) {
  const {routes} = useContext(DocusaurusContext);
  const {to, href, preloadProximity = 20} = props;
  const targetLink = to || href;
  const isExternal = externalRegex.test(targetLink);
  return !targetLink || isExternal ? (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a {...props} href={targetLink} />
  ) : (
    <Perimeter
      padding={preloadProximity}
      onBreach={() => preload(routes, targetLink)}
      once>
      <NavLink {...props} to={targetLink} />
    </Perimeter>
  );
}

export default Link;
