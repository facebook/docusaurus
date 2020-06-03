/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {flatten, uniqBy, difference, groupBy} from 'lodash';
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

import chalk from 'chalk';

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
  // we don't want to create twice the same redirect
  // that would lead to writing twice the same html redirection file
  Object.entries(
    groupBy(redirects, (redirect) => redirect.fromRoutePath),
  ).forEach(([from, groupedFromRedirects]) => {
    if (groupedFromRedirects.length > 1) {
      console.error(
        chalk.red(
          `@docusaurus/plugin-client-redirects: multiple redirects are created with the same "from" pathname=${from}
It is not possible to redirect the same pathname to multiple destinations:
- ${groupedFromRedirects.map((r) => JSON.stringify(r)).join('\n- ')}
`,
        ),
      );
    }
  });
  redirects = uniqBy(redirects, (redirect) => redirect.fromRoutePath);

  // We don't want to override an already existing route with a redirect file!
  const redirectsOverridingExistingPath = redirects.filter((redirect) =>
    pluginContext.routesPaths.includes(redirect.fromRoutePath),
  );
  if (redirectsOverridingExistingPath.length > 0) {
    console.error(
      chalk.red(
        `@docusaurus/plugin-client-redirects: some redirects would override existing paths, and will be ignored:
- ${redirectsOverridingExistingPath.map((r) => JSON.stringify(r)).join('\n- ')}
`,
      ),
    );
  }
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
  const fromRoutePathsMixed: string | string[] =
    redirectCreator(routePath) || [];

  const fromRoutePaths: string[] =
    typeof fromRoutePathsMixed === 'string'
      ? [fromRoutePathsMixed]
      : fromRoutePathsMixed;

  return fromRoutePaths.map((fromRoutePath) => {
    return {
      fromRoutePath,
      toRoutePath: routePath,
    };
  });
}
