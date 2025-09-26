/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
// TODO eval is archived / unmaintained: https://github.com/pierrec/node-eval
//  We should internalize/modernize it
import evaluate from 'eval';
import pMap from 'p-map';
import logger, {PerfLogger} from '@docusaurus/logger';
import {getHtmlMinifier} from '@docusaurus/bundler';
import {
  compileSSGTemplate,
  renderSSGTemplate,
  type SSGTemplateCompiled,
} from './ssgTemplate';
import {SSGConcurrency} from './ssgEnv';
import {writeStaticFile} from './ssgUtils';
import {createSSGRequire} from './ssgNodeRequire';
import type {SSGParams} from './ssgParams';
import type {
  AppRenderer,
  PageCollectedData,
  PageCollectedDataInternal,
} from '../common';
import type {HtmlMinifier} from '@docusaurus/bundler';

export type SSGSuccess = {
  success: true;
  pathname: string;
  result: {
    collectedData: PageCollectedData;
    warnings: string[];
    // html: we don't include it on purpose!
    // we don't need to aggregate all html contents in memory!
    // html contents can be GC as soon as they are written to disk
  };
};

export type SSGError = {
  success: false;
  pathname: string;
  error: Error;
};

export type SSGResult = SSGSuccess | SSGError;

async function loadAppRenderer({
  serverBundlePath,
}: {
  serverBundlePath: string;
}): Promise<AppRenderer> {
  const source = await PerfLogger.async(`Load server bundle`, () =>
    fs.readFile(serverBundlePath),
  );

  const filename = path.basename(serverBundlePath);

  const ssgRequire = createSSGRequire(serverBundlePath);

  const globals = {
    // When using "new URL('file.js', import.meta.url)", Webpack will emit
    // __filename, and this plugin will throw. not sure the __filename value
    // has any importance for this plugin, just using an empty string to
    // avoid the error. See https://github.com/facebook/docusaurus/issues/4922
    __filename: '',

    // This uses module.createRequire() instead of very old "require-like" lib
    // See also: https://github.com/pierrec/node-eval/issues/33
    require: ssgRequire.require,
  };

  const serverEntry = await PerfLogger.async(
    `Evaluate server bundle`,
    () =>
      evaluate(
        source,
        /* filename: */ filename,
        /* scope: */ globals,
        /* includeGlobals: */ true,
      ) as {default?: AppRenderer},
  );

  if (!serverEntry?.default || typeof serverEntry.default !== 'function') {
    throw new Error(
      `Docusaurus Bug: server bundle export from "${filename}" must be a function that renders the Docusaurus React app, not ${typeof serverEntry?.default}`,
    );
  }

  async function shutdown() {
    ssgRequire.cleanup();
  }

  return {
    render: serverEntry.default,
    shutdown,
  };
}

export type SSGRenderer = {
  shutdown: () => Promise<void>;
  renderPathnames: (pathnames: string[]) => Promise<SSGResult[]>;
};

export async function loadSSGRenderer({
  params,
}: {
  params: SSGParams;
}): Promise<SSGRenderer> {
  const [appRenderer, htmlMinifier, ssgTemplate] = await Promise.all([
    PerfLogger.async('Load App renderer', () =>
      loadAppRenderer({
        serverBundlePath: params.serverBundlePath,
      }),
    ),
    PerfLogger.async('Load HTML minifier', () =>
      getHtmlMinifier({
        type: params.htmlMinifierType,
      }),
    ),
    PerfLogger.async('Compile SSG template', () =>
      compileSSGTemplate(params.ssgTemplateContent),
    ),
  ]);

  return {
    renderPathnames: (pathnames) => {
      return pMap<string, SSGResult>(
        pathnames,
        async (pathname) =>
          generateStaticFile({
            pathname,
            appRenderer,
            params,
            htmlMinifier,
            ssgTemplate,
          }),
        {concurrency: SSGConcurrency},
      );
    },
    shutdown: async () => {
      await appRenderer.shutdown();
    },
  };
}

// We reduce the page collected data structure after the HTML file is written
// Some data (modules, metadata.internal) is only useful to create the HTML file
// It's not useful to aggregate that collected data in memory
// Keep this data structure as small as possible
// See https://github.com/facebook/docusaurus/pull/11162
function reduceCollectedData(
  pageCollectedData: PageCollectedDataInternal,
): PageCollectedData {
  // We re-create the object from scratch
  // We absolutely want to avoid TS duck typing
  return {
    anchors: pageCollectedData.anchors,
    metadata: {
      public: pageCollectedData.metadata.public,
      helmet: pageCollectedData.metadata.helmet,
    },
    links: pageCollectedData.links,
  };
}

async function generateStaticFile({
  pathname,
  appRenderer,
  params,
  htmlMinifier,
  ssgTemplate,
}: {
  pathname: string;
  appRenderer: AppRenderer;
  params: SSGParams;
  htmlMinifier: HtmlMinifier;
  ssgTemplate: SSGTemplateCompiled;
}): Promise<SSGResult> {
  try {
    // This only renders the app HTML
    const appRenderResult = await appRenderer.render({
      pathname,
      v4RemoveLegacyPostBuildHeadAttribute:
        params.v4RemoveLegacyPostBuildHeadAttribute,
    });
    // This renders the full page HTML, including head tags...
    const fullPageHtml = renderSSGTemplate({
      params,
      result: appRenderResult,
      ssgTemplate,
    });
    const minifierResult = await htmlMinifier.minify(fullPageHtml);
    await writeStaticFile({
      pathname,
      content: minifierResult.code,
      params,
    });

    const collectedData = reduceCollectedData(appRenderResult.collectedData);

    return {
      success: true,
      pathname,
      result: {
        collectedData,
        // As of today, only the html minifier can emit SSG warnings
        warnings: minifierResult.warnings,
      },
    };
  } catch (errorUnknown) {
    const error = errorUnknown as Error;
    const tips = getSSGErrorTips(error);
    const message = logger.interpolate`Can't render static file for pathname path=${pathname}${
      tips ? `\n\n${tips}` : ''
    }`;
    return {
      success: false,
      pathname,
      error: new Error(message, {
        cause: error,
      }),
    };
  }
}

function getSSGErrorTips(error: Error): string {
  const parts = [];

  const isNotDefinedErrorRegex =
    /(?:window|document|localStorage|navigator|alert|location|buffer|self) is not defined/i;
  if (isNotDefinedErrorRegex.test(error.message)) {
    parts.push(`It looks like you are using code that should run on the client-side only.
To get around it, try using one of:
- ${logger.code('<BrowserOnly>')} (${logger.url(
      'https://docusaurus.io/docs/docusaurus-core/#browseronly',
    )})
- ${logger.code('ExecutionEnvironment')} (${logger.url(
      'https://docusaurus.io/docs/docusaurus-core/#executionenvironment',
    )}).
It might also require to wrap your client code in ${logger.code(
      'useEffect',
    )} hook and/or import a third-party library dynamically (if any).`);
  }

  return parts.join('\n');
}
