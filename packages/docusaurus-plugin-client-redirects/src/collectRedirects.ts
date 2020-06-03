/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {flatten, uniqBy, difference} from 'lodash';
import {
  RedirectsCreator,
  PluginContext,
  RedirectMetadata,
  PluginOptions,
  RedirectOption,
} from './types';
import {
  fromExtensionsRedirectCreator,
  toExtensionsRedirectCreator,
} from './redirectCreators';
import {validateRedirect} from './redirectValidation';

export default function collectRedirects(
  pluginContext: PluginContext,
): RedirectMetadata[] {
  const redirects = doCollectRedirects(pluginContext);
  validateCollectedRedirects(redirects, pluginContext);
  return filterUnwantedRedirects(redirects, pluginContext);
}

function validateCollectedRedirects(
  redirects: RedirectMetadata[],
  pluginContext: PluginContext,
) {
  const redirectValidationErrors: string[] = redirects
    .map((redirect) => {
      try {
        validateRedirect(redirect);
      } catch (e) {
        return e.message;
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

  const allowedToPaths = pluginContext.routesPaths;

  const toPaths = redirects.map((redirect) => redirect.toRoutePath);

  const illegalToPaths = difference(toPaths, allowedToPaths);

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
  // TODO how should we warn the user of filtered redirects?

  // we don't want to create twice the same redirect
  redirects = uniqBy(redirects, (redirect) => redirect.fromRoutePath);

  // We don't want to override an existing route
  redirects = redirects.filter(
    (redirect) => !pluginContext.routesPaths.includes(redirect.fromRoutePath),
  );

  return redirects;
}

function doCollectRedirects(pluginContext: PluginContext): RedirectMetadata[] {
  const redirectsCreators: RedirectsCreator[] = buildRedirectCreators(
    pluginContext.options,
  );

  const optionsRedirects = collectPluginOptionRedirects(pluginContext);

  const redirectCreatorsRedirects = flatten(
    redirectsCreators.map((redirectCreator) => {
      return createRoutesPathsRedirects(redirectCreator, pluginContext);
    }),
  );

  return [...optionsRedirects, ...redirectCreatorsRedirects];
}

function collectPluginOptionRedirects(
  pluginContext: PluginContext,
): RedirectMetadata[] {
  // For conveniency, user can use a string or a string[]
  function optionToRedirects(option: RedirectOption): RedirectMetadata[] {
    if (typeof option.from === 'string') {
      return [{fromRoutePath: option.from, toRoutePath: option.to}];
    } else {
      return option.from.map((fromRoutePath) => ({
        fromRoutePath,
        toRoutePath: option.to,
      }));
    }
  }

  return flatten(pluginContext.options.redirects.map(optionToRedirects));
}

function buildRedirectCreators(options: PluginOptions): RedirectsCreator[] {
  const redirectCreators = [
    fromExtensionsRedirectCreator(options.fromExtensions),
    toExtensionsRedirectCreator(options.toExtensions),
  ];
  options.createRedirects && redirectCreators.push(options.createRedirects);
  return redirectCreators;
}

// Create all redirects for a list of route path
function createRoutesPathsRedirects(
  redirectCreator: RedirectsCreator,
  pluginContext: PluginContext,
): RedirectMetadata[] {
  return flatten(
    pluginContext.routesPaths.map((routePath) =>
      createRoutePathRedirects(routePath, redirectCreator),
    ),
  );
}

// Create all redirects for a single route path
function createRoutePathRedirects(
  routePath: string,
  redirectCreator: RedirectsCreator,
): RedirectMetadata[] {
  const fromRoutePaths: string[] = redirectCreator(routePath) ?? [];
  return fromRoutePaths.map((fromRoutePath) => {
    return {
      fromRoutePath,
      toRoutePath: routePath,
    };
  });
}
