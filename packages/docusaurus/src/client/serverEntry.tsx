/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {StaticRouter} from 'react-router-dom';
import {HelmetProvider, type FilledContext} from 'react-helmet-async';
import Loadable from 'react-loadable';
import {renderToHtml} from './renderToHtml';
import preload from './preload';
import App from './App';
import {
  createStatefulBrokenLinks,
  BrokenLinksProvider,
} from './BrokenLinksContext';
import type {PageCollectedData, AppRenderer} from '../common';

const render: AppRenderer = async ({pathname}) => {
  await preload(pathname);

  const modules = new Set<string>();
  const routerContext = {};
  const helmetContext = {};
  const statefulBrokenLinks = createStatefulBrokenLinks();

  const app = (
    // @ts-expect-error: we are migrating away from react-loadable anyways
    <Loadable.Capture report={(moduleName) => modules.add(moduleName)}>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={pathname} context={routerContext}>
          <BrokenLinksProvider brokenLinks={statefulBrokenLinks}>
            <App />
          </BrokenLinksProvider>
        </StaticRouter>
      </HelmetProvider>
    </Loadable.Capture>
  );

  const html = await renderToHtml(app);

  const collectedData: PageCollectedData = {
    helmet: (helmetContext as FilledContext).helmet,
    anchors: statefulBrokenLinks.getCollectedAnchors(),
    links: statefulBrokenLinks.getCollectedLinks(),
    modules: Array.from(modules),
  };

  return {html, collectedData};
};

export default render;
