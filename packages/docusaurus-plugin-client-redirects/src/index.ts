/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import {flatten} from 'lodash';

import {LoadContext, Plugin, Props} from '@docusaurus/types';

import {PluginOptions, RedirectsCreator} from './types';
import createRedirectPageContent from './createRedirectPageContent';
import {addTrailingSlash, getFilePathForRoutePath} from './utils';
import {
  fromExtensionsRedirectCreator,
  toExtensionsRedirectCreator,
} from './redirectCreators';

const DEFAULT_OPTIONS: PluginOptions = {
  fromExtensions: [],
  toExtensions: [],
};

type RedirectMetadata = {
  fromRoutePath: string;
  toRoutePath: string;
  toUrl: string;
  redirectPageContent: string;
  redirectAbsoluteFilePath: string;
};

type PluginContext = {
  props: Props;
  options: PluginOptions;
  redirectsCreators: RedirectsCreator[];
};

export default function pluginClientRedirectsPages(
  _context: LoadContext,
  opts: Partial<PluginOptions>,
): Plugin<unknown> {
  const options = {...DEFAULT_OPTIONS, ...opts};
  return {
    name: 'docusaurus-plugin-client-redirects',
    async postBuild(props: Props) {
      const redirectsCreators: RedirectsCreator[] = buildRedirectCreators(
        options,
      );

      const pluginContext: PluginContext = {props, options, redirectsCreators};
      // Process in 2 steps, to make code more easy to test
      const redirects: RedirectMetadata[] = collectRoutePathRedirects(
        pluginContext,
      );

      console.log('redirects=', redirects);

      await writeRedirectFiles(redirects);
    },
  };
}

function buildRedirectCreators(options: PluginOptions): RedirectsCreator[] {
  const noopRedirectCreator: RedirectsCreator = (_routePath: string) => [];
  return [
    fromExtensionsRedirectCreator(options.fromExtensions),
    toExtensionsRedirectCreator(options.toExtensions),
    options.createRedirects ?? noopRedirectCreator,
  ];
}

function collectRoutePathRedirects(
  pluginContext: PluginContext,
): RedirectMetadata[] {
  return flatten(
    pluginContext.redirectsCreators.map((redirectCreator) => {
      return createRoutesPathsRedirects(redirectCreator, pluginContext);
    }),
  );
}

// Create all redirects for a list of route path
function createRoutesPathsRedirects(
  redirectCreator: RedirectsCreator,
  pluginContext: PluginContext,
): RedirectMetadata[] {
  return flatten(
    pluginContext.props.routesPaths.map((routePath) =>
      createRoutePathRedirects(routePath, redirectCreator, pluginContext),
    ),
  );
}

// Create all redirects for a single route path
function createRoutePathRedirects(
  routePath: string,
  redirectCreator: RedirectsCreator,
  {props}: PluginContext,
): RedirectMetadata[] {
  const {siteConfig, outDir} = props;

  // TODO do we receive absolute urls???
  if (!path.isAbsolute(routePath)) {
    return [];
  }

  // TODO addTrailingSlash ?
  const toUrl = addTrailingSlash(`${siteConfig.url}${routePath}`);

  const redirectPageContent = createRedirectPageContent({toUrl});

  const fromRoutePaths: string[] = redirectCreator(routePath) ?? [];

  return fromRoutePaths.map((fromRoutePath) => {
    const redirectAbsoluteFilePath = path.join(
      outDir,
      getFilePathForRoutePath(fromRoutePath),
    );
    return {
      fromRoutePath,
      toRoutePath: routePath,
      toUrl,
      redirectPageContent,
      redirectAbsoluteFilePath,
    };
  });
}

async function writeRedirectFiles(redirects: RedirectMetadata[]) {
  async function writeRedirectFile(redirect: RedirectMetadata) {
    try {
      await fs.writeFile(
        redirect.redirectAbsoluteFilePath,
        redirect.redirectPageContent,
      );
    } catch (err) {
      throw new Error(`Redirect file creation error: ${err}`);
    }
  }
  await Promise.all(redirects.map(writeRedirectFile));
}
