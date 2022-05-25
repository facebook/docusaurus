/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import logger from '@docusaurus/logger';
import {
  applyTrailingSlash,
  type ApplyTrailingSlashParams,
} from '@docusaurus/utils-common';
import {
  createFromExtensionsRedirects,
  createToExtensionsRedirects,
} from './extensionRedirects';
import {validateRedirect} from './redirectValidation';
import type {PluginOptions, RedirectOption} from './options';
import type {PluginContext, RedirectMetadata} from './types';

export default function collectRedirects(
  pluginContext: PluginContext,
  trailingSlash: boolean | undefined,
): RedirectMetadata[] {
  let redirects = doCollectRedirects(pluginContext);

  redirects = applyRedirectsTrailingSlash(redirects, {
    trailingSlash,
    baseUrl: pluginContext.baseUrl,
  });

  validateCollectedRedirects(redirects, pluginContext);
  return filterUnwantedRedirects(redirects, pluginContext);
}

// If users wants to redirect to=/abc and they enable trailingSlash=true then
// => we don't want to reject the to=/abc (as only /abc/ is an existing/valid
// path now)
// => we want to redirect to=/abc/ without the user having to change all its
// redirect plugin options
// It should be easy to toggle siteConfig.trailingSlash option without having to
// change other configs
function applyRedirectsTrailingSlash(
  redirects: RedirectMetadata[],
  params: ApplyTrailingSlashParams,
) {
  return redirects.map((redirect) => ({
    ...redirect,
    to: applyTrailingSlash(redirect.to, params),
  }));
}

function validateCollectedRedirects(
  redirects: RedirectMetadata[],
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
  redirects: RedirectMetadata[],
  pluginContext: PluginContext,
): RedirectMetadata[] {
  // We don't want to create the same redirect twice, since that would lead to
  // writing the same html redirection file twice.
  Object.entries(_.groupBy(redirects, (redirect) => redirect.from)).forEach(
    ([from, groupedFromRedirects]) => {
      if (groupedFromRedirects.length > 1) {
        logger.error`name=${'@docusaurus/plugin-client-redirects'}: multiple redirects are created with the same "from" pathname: path=${from}
It is not possible to redirect the same pathname to multiple destinations: ${groupedFromRedirects.map(
          (r) => JSON.stringify(r),
        )}`;
      }
    },
  );
  const collectedRedirects = _.uniqBy(redirects, (redirect) => redirect.from);

  // We don't want to override an already existing route with a redirect file!
  const redirectsOverridingExistingPath = collectedRedirects.filter(
    (redirect) => pluginContext.relativeRoutesPaths.includes(redirect.from),
  );
  if (redirectsOverridingExistingPath.length > 0) {
    logger.error`name=${'@docusaurus/plugin-client-redirects'}: some redirects would override existing paths, and will be ignored: ${redirectsOverridingExistingPath.map(
      (r) => JSON.stringify(r),
    )}`;
  }
  return collectedRedirects.filter(
    (redirect) => !pluginContext.relativeRoutesPaths.includes(redirect.from),
  );
}

// For each plugin config option, create the appropriate redirects
function doCollectRedirects(pluginContext: PluginContext): RedirectMetadata[] {
  return [
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
  ];
}

function createRedirectsOptionRedirects(
  redirectsOption: PluginOptions['redirects'],
): RedirectMetadata[] {
  // For convenience, user can use a string or a string[]
  function optionToRedirects(option: RedirectOption): RedirectMetadata[] {
    if (typeof option.from === 'string') {
      return [{from: option.from, to: option.to}];
    }
    return option.from.map((from) => ({
      from,
      to: option.to,
    }));
  }

  return redirectsOption.flatMap(optionToRedirects);
}

// Create redirects from the "createRedirects" fn provided by the user
function createCreateRedirectsOptionRedirects(
  paths: string[],
  createRedirects: PluginOptions['createRedirects'],
): RedirectMetadata[] {
  function createPathRedirects(path: string): RedirectMetadata[] {
    const fromsMixed: string | string[] = createRedirects?.(path) ?? [];

    const froms: string[] =
      typeof fromsMixed === 'string' ? [fromsMixed] : fromsMixed;

    return froms.map((from) => ({
      from,
      to: path,
    }));
  }

  return paths.flatMap(createPathRedirects);
}
