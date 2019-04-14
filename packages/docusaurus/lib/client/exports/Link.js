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
import prefetch from '../prefetch';

const externalRegex = /^(https?:|\/\/)/;

function prefetchChunks(targetLink) {
  // We know targetLink, we know what are the modules that need to be prefetched
  import('@generated/routesAsyncModules.json')
    .then(({default: modules}) => {
      console.log(targetLink);
      const modulesNeeded = modules[targetLink];

      console.log(modulesNeeded);

      // We use chunk-map so that we know which chunk is related to the modules
      // TODO

      // We prefetch all chunks needed
      // Example only:
      const chunksNeeded = ['/component---theme-doc-body-f68.js'];
      chunksNeeded.map(prefetch);
    })
    .catch(err => console.log(`Failed to prefetch ${targetLink}`, err));
}

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
      onBreach={() => preload(routes, targetLink) && prefetchChunks(targetLink)}
      once>
      <NavLink {...props} to={targetLink} />
    </Perimeter>
  );
}

export default Link;
