/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import _ from 'lodash';
import logger from '@docusaurus/logger';
import openBrowser from 'react-dev-utils/openBrowser';
import {loadSite, reloadSite, reloadSitePlugin} from '../../server';
import {PerfLogger} from '../../utils';
import {setupSiteFileWatchers} from './watcher';
import {createWebpackDevServer} from './webpack';
import {createOpenUrlContext} from './utils';
import type {LoadContextParams, LoadSiteParams} from '../../server';
import type {HostPortOptions} from '../../server/getHostPort';
import type {LoadedPlugin} from '@docusaurus/types';

export type StartCLIOptions = HostPortOptions &
  Pick<LoadContextParams, 'locale' | 'config'> & {
    hotOnly?: boolean;
    open?: boolean;
    poll?: boolean | number;
    minify?: boolean;
  };

async function createLoadSiteParams({
  siteDirParam,
  cliOptions,
}: StartParams): Promise<LoadSiteParams> {
  const siteDir = await fs.realpath(siteDirParam);
  return {
    siteDir,
    config: cliOptions.config,
    locale: cliOptions.locale,
    localizePath: undefined, // Should this be configurable?
  };
}

async function createReloadableSite(startParams: StartParams) {
  const openUrlContext = await createOpenUrlContext(startParams);

  let site = await PerfLogger.async('Loading site', async () => {
    const params = await createLoadSiteParams(startParams);
    return loadSite(params);
  });

  const get = () => site;

  const getOpenUrl = () =>
    openUrlContext.getOpenUrl({
      baseUrl: site.props.baseUrl,
    });

  const printOpenUrlMessage = () => {
    logger.success`Docusaurus website is running at: url=${getOpenUrl()}`;
  };
  printOpenUrlMessage();

  const reloadBase = async () => {
    try {
      const oldSite = site;
      site = await PerfLogger.async('Reloading site', () => reloadSite(site));
      if (oldSite.props.baseUrl !== site.props.baseUrl) {
        printOpenUrlMessage();
      }
    } catch (e) {
      logger.error('Site reload failure');
      console.error(e);
    }
  };

  // TODO instead of debouncing we should rather add AbortController support
  const reload = _.debounce(reloadBase, 500);

  const reloadPlugin = async (plugin: LoadedPlugin) => {
    try {
      site = await PerfLogger.async(
        `Reloading site plugin ${plugin.name}@${plugin.options.id}`,
        () => reloadSitePlugin(site, plugin),
      );
    } catch (e) {
      logger.error(
        `Site plugin reload failure - Plugin ${plugin.name}@${plugin.options.id}`,
      );
      console.error(e);
    }
  };

  return {get, getOpenUrl, reload, reloadPlugin, openUrlContext};
}

type StartParams = {
  siteDirParam: string;
  cliOptions: Partial<StartCLIOptions>;
};

export async function start(
  siteDirParam: string = '.',
  cliOptions: Partial<StartCLIOptions> = {},
): Promise<void> {
  logger.info('Starting the development server...');
  // Temporary workaround to unlock the ability to translate the site config
  // We'll remove it if a better official API can be designed
  // See https://github.com/facebook/docusaurus/issues/4542
  process.env.DOCUSAURUS_CURRENT_LOCALE = cliOptions.locale;

  const reloadableSite = await createReloadableSite({siteDirParam, cliOptions});
  setupSiteFileWatchers(
    {props: reloadableSite.get().props, cliOptions},
    ({plugin}) => {
      if (plugin) {
        reloadableSite.reloadPlugin(plugin);
      } else {
        reloadableSite.reload();
      }
    },
  );

  const devServer = await createWebpackDevServer({
    props: reloadableSite.get().props,
    cliOptions,
    openUrlContext: reloadableSite.openUrlContext,
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      devServer.stop();
      process.exit();
    });
  });

  await devServer.start();
  if (cliOptions.open) {
    openBrowser(reloadableSite.getOpenUrl());
  }
}
