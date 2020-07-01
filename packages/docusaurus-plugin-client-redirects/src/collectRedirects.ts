/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {flatten, uniqBy, difference, groupBy} from 'lodash';
import {
  PluginContext,
  RedirectMetadata,
  PluginOptions,
  RedirectOption,
} from './types';
import {
  createFromExtensionsRedirects,
  createToExtensionsRedirects,
} from './extensionRedirects';
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
        return undefined;
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

  const allowedToPaths = pluginContext.relativeRoutesPaths;
  const toPaths = redirects.map((redirect) => redirect.to);
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
  Object.entries(groupBy(redirects, (redirect) => redirect.from)).forEach(
    ([from, groupedFromRedirects]) => {
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
    },
  );
  redirects = uniqBy(redirects, (redirect) => redirect.from);

  // We don't want to override an already existing route with a redirect file!
  const redirectsOverridingExistingPath = redirects.filter((redirect) =>
    pluginContext.relativeRoutesPaths.includes(redirect.from),
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
    (redirect) => !pluginContext.relativeRoutesPaths.includes(redirect.from),
  );

  return redirects;
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
  // For conveniency, user can use a string or a string[]
  function optionToRedirects(option: RedirectOption): RedirectMetadata[] {
    if (typeof option.from === 'string') {
      return [{from: option.from, to: option.to}];
    }
    return option.from.map((from) => ({
      from,
      to: option.to,
    }));
  }

  return flatten(redirectsOption.map(optionToRedirects));
}

// Create redirects from the "createRedirects" fn provided by the user
function createCreateRedirectsOptionRedirects(
  paths: string[],
  createRedirects: PluginOptions['createRedirects'],
): RedirectMetadata[] {
  function createPathRedirects(path: string): RedirectMetadata[] {
    const fromsMixed: string | string[] = createRedirects
      ? createRedirects(path) || []
      : [];

    const froms: string[] =
      typeof fromsMixed === 'string' ? [fromsMixed] : fromsMixed;

    return froms.map((from) => {
      return {
        from,
        to: path,
      };
    });
  }

  return flatten(paths.map(createPathRedirects));
}
