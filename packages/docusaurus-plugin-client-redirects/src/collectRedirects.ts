/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import {applyTrailingSlash} from '@docusaurus/utils-common';
import {
  createFromExtensionsRedirects,
  createToExtensionsRedirects,
} from './extensionRedirects';
import {validateRedirect} from './redirectValidation';
import type {PluginOptions, RedirectOption} from './options';
import type {PluginContext, RedirectItem} from './types';

export default function collectRedirects(
  pluginContext: PluginContext,
  trailingSlash: boolean | undefined,
): RedirectItem[] {
  // For each plugin config option, create the appropriate redirects
  const redirects = [
    ...createFromExtensionsRedirects(
      pluginContext.relativeRoutesPaths,
      pluginContext.options.fromExtensions,
    ),
    ...createToExtensionsRedirects(
      pluginContext.relativeRoutesPaths,
      pluginContext.options.toExtensions,
    ),
    ...createRedirectsOptionRedirects(pluginContext.options.redirects),
    ...createCreateRedirectsOptionRedirects(
      pluginContext.relativeRoutesPaths,
      pluginContext.options.createRedirects,
    ),
  ].map((redirect) => ({
    ...redirect,
    // Given a redirect with `to: "/abc"` and `trailingSlash` enabled:
    //
    // - We don't want to reject `to: "/abc"`, as that unambiguously points to
    // `/abc/` now;
    // - We want to redirect `to: /abc/` without the user having to change all
    // her redirect plugin options
    //
    // It should be easy to toggle `trailingSlash` option without having to
    // change other configs
    to: applyTrailingSlash(redirect.to, {
      trailingSlash,
      baseUrl: pluginContext.baseUrl,
    }),
  }));

  validateCollectedRedirects(redirects, pluginContext);
  return filterUnwantedRedirects(redirects, pluginContext);
}

function validateCollectedRedirects(
  redirects: RedirectItem[],
  pluginContext: PluginContext,
) {
  const redirectValidationErrors = redirects
    .map((redirect) => {
      try {
        validateRedirect(redirect);
        return undefined;
      } catch (err) {
        return (err as Error).message;
      }
    })
    .filter(Boolean);
  if (redirectValidationErrors.length > 0) {
    throw new Error(
      `Some created redirects are invalid:
- ${redirectValidationErrors.join('\n- ')}
`,
    );
  }

  const allowedToPaths = pluginContext.relativeRoutesPaths;
  const toPaths = redirects.map((redirect) => redirect.to);
  const illegalToPaths = _.difference(toPaths, allowedToPaths);
  if (illegalToPaths.length > 0) {
    throw new Error(
      `You are trying to create client-side redirections to paths that do not exist:
- ${illegalToPaths.join('\n- ')}

Valid paths you can redirect to:
- ${allowedToPaths.join('\n- ')}
`,
    );
  }
}

function filterUnwantedRedirects(
  redirects: RedirectItem[],
  pluginContext: PluginContext,
): RedirectItem[] {
  // We don't want to create the same redirect twice, since that would lead to
  // writing the same html redirection file twice.
  Object.entries(_.groupBy(redirects, (redirect) => redirect.from)).forEach(
    ([from, groupedFromRedirects]) => {
      if (groupedFromRedirects.length > 1) {
        logger.report(
          pluginContext.siteConfig.onDuplicateRoutes,
        )`name=${'@docusaurus/plugin-client-redirects'}: multiple redirects are created with the same "from" pathname: path=${from}
It is not possible to redirect the same pathname to multiple destinations:${groupedFromRedirects.map(
          (r) => JSON.stringify(r),
        )}`;
      }
    },
  );
  const collectedRedirects = _.uniqBy(redirects, (redirect) => redirect.from);

  const {false: newRedirects = [], true: redirectsOverridingExistingPath = []} =
    _.groupBy(collectedRedirects, (redirect) =>
      pluginContext.relativeRoutesPaths.includes(redirect.from),
    );
  if (redirectsOverridingExistingPath.length > 0) {
    logger.report(
      pluginContext.siteConfig.onDuplicateRoutes,
    )`name=${'@docusaurus/plugin-client-redirects'}: some redirects would override existing paths, and will be ignored:${redirectsOverridingExistingPath.map(
      (r) => JSON.stringify(r),
    )}`;
  }
  return newRedirects;
}

function createRedirectsOptionRedirects(
  redirectsOption: PluginOptions['redirects'],
): RedirectItem[] {
  // For convenience, user can use a string or a string[]
  function optionToRedirects(option: RedirectOption): RedirectItem[] {
    if (typeof option.from === 'string') {
      return [{from: option.from, to: option.to}];
    }
    return option.from.map((from) => ({from, to: option.to}));
  }

  return redirectsOption.flatMap(optionToRedirects);
}

// Create redirects from the "createRedirects" fn provided by the user
function createCreateRedirectsOptionRedirects(
  paths: string[],
  createRedirects: PluginOptions['createRedirects'],
): RedirectItem[] {
  function createPathRedirects(path: string): RedirectItem[] {
    const fromsMixed: string | string[] = createRedirects?.(path) ?? [];

    const froms: string[] =
      typeof fromsMixed === 'string' ? [fromsMixed] : fromsMixed;

    return froms.map((from) => ({from, to: path}));
  }

  return paths.flatMap(createPathRedirects);
}
