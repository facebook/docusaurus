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
import type {PageCollectedData, ServerEntryRenderer} from '../types';

function buildSSRErrorMessage({
  error,
  pathname,
}: {
  error: Error;
  pathname: string;
}): string {
  const parts = [
    `Docusaurus server-side rendering could not render static page with path ${pathname} because of error: ${error.message}`,
  ];

  const isNotDefinedErrorRegex =
    /(?:window|document|localStorage|navigator|alert|location|buffer|self) is not defined/i;

  if (isNotDefinedErrorRegex.test(error.message)) {
    // prettier-ignore
    parts.push(`It looks like you are using code that should run on the client-side only.
To get around it, try using \`<BrowserOnly>\` (https://docusaurus.io/docs/docusaurus-core/#browseronly) or \`ExecutionEnvironment\` (https://docusaurus.io/docs/docusaurus-core/#executionenvironment).
It might also require to wrap your client code in \`useEffect\` hook and/or import a third-party library dynamically (if any).`);
  }

  return parts.join('\n');
}

const doRender: ServerEntryRenderer = async ({pathname}) => {
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
  const {helmet} = helmetContext as FilledContext;

  const collectedData: PageCollectedData = {
    anchors: statefulBrokenLinks.getCollectedAnchors(),
    links: statefulBrokenLinks.getCollectedLinks(),
    headTags: helmet,
    modules: Array.from(modules),
  };

  return {html, collectedData};
};

const render: ServerEntryRenderer = async (params) => {
  try {
    return await doRender(params);
  } catch (errorUnknown) {
    const error = errorUnknown as Error;
    const message = buildSSRErrorMessage({error, pathname: params.pathname});
    throw new Error(message, {cause: error});
  }
};

export default render;
