/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {createMemoryHistory} from 'history';
import {HelmetProvider, type FilledContext} from 'react-helmet-async';
import Loadable from 'react-loadable';
import {renderToHtml} from './renderToHtml';
import preload from './preload';
import {DocusaurusRouter} from './exports/router';
import App from './App';
import {
  createStatefulBrokenLinks,
  BrokenLinksProvider,
} from './BrokenLinksContext';
import {toPageCollectedMetadataInternal} from './serverHelmetUtils';
import type {AppRenderer, PageCollectedDataInternal} from '../common';

const render: AppRenderer['render'] = async ({pathname}) => {
  await preload(pathname);

  const modules = new Set<string>();
  const helmetContext = {};
  const statefulBrokenLinks = createStatefulBrokenLinks();

  // We use a memory history seeded with the rendered pathname. Driving React
  // Router with a real history object (instead of <StaticRouter>) keeps
  // useHistory() working uniformly on both server and client.
  const history = createMemoryHistory({initialEntries: [pathname]});

  const app = (
    // @ts-expect-error: we are migrating away from react-loadable anyways
    <Loadable.Capture report={(moduleName) => modules.add(moduleName)}>
      <HelmetProvider context={helmetContext}>
        <DocusaurusRouter history={history}>
          <BrokenLinksProvider brokenLinks={statefulBrokenLinks}>
            <App />
          </BrokenLinksProvider>
        </DocusaurusRouter>
      </HelmetProvider>
    </Loadable.Capture>
  );

  const html = await renderToHtml(app);

  const {helmet} = helmetContext as FilledContext;

  const metadata = toPageCollectedMetadataInternal({helmet});

  const collectedData: PageCollectedDataInternal = {
    metadata,
    anchors: statefulBrokenLinks.getCollectedAnchors(),
    links: statefulBrokenLinks.getCollectedLinks(),
    modules: Array.from(modules),
  };

  return {html, collectedData};
};

export default render;
