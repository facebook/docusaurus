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
import {load, type LoadContextOptions} from '../../server';
import {type HostPortOptions} from '../../server/getHostPort';
import {PerfLogger} from '../../utils';
import {setupSiteFileWatchers} from './watcher';
import {createWebpackDevServer} from './webpack';
import {createOpenUrlContext} from './utils';
import type {LoadedPlugin} from '@docusaurus/types';

export type StartCLIOptions = HostPortOptions &
  Pick<LoadContextOptions, 'locale' | 'config'> & {
    hotOnly?: boolean;
    open?: boolean;
    poll?: boolean | number;
    minify?: boolean;
  };

export async function start(
  siteDirParam: string = '.',
  cliOptions: Partial<StartCLIOptions> = {},
): Promise<void> {
  // Temporary workaround to unlock the ability to translate the site config
  // We'll remove it if a better official API can be designed
  // See https://github.com/facebook/docusaurus/issues/4542
  process.env.DOCUSAURUS_CURRENT_LOCALE = cliOptions.locale;
  const siteDir = await fs.realpath(siteDirParam);
  logger.info('Starting the development server...');

  async function loadSite() {
    PerfLogger.start('Loading site');
    const result = await load({
      siteDir,
      config: cliOptions.config,
      locale: cliOptions.locale,
      localizePath: undefined, // Should this be configurable?
    });
    PerfLogger.end('Loading site');
    return result;
  }

  // Process all related files as a prop.
  const props = await loadSite();

  const openUrlContext = await createOpenUrlContext({cliOptions});
  const openUrl = openUrlContext.getOpenUrl({baseUrl: props.baseUrl});

  logger.success`Docusaurus website is running at: url=${openUrl}`;

  const reloadSite = _.debounce(() => {
    loadSite()
      .then(({baseUrl: newBaseUrl}) => {
        const newOpenUrl = openUrlContext.getOpenUrl({baseUrl: newBaseUrl});
        if (newOpenUrl !== openUrl) {
          logger.success`Docusaurus website is running at: url=${newOpenUrl}`;
        }
      })
      .catch((err: Error) => {
        logger.error(err.stack);
      });
  }, 500);

  const reloadPlugin = (plugin: LoadedPlugin) => {
    console.log('reload plugin', plugin);
    // TODO this is historically not optimized!
    //  When any site file changes, we reload absolutely everything :/
    //  At least we should try to reload only one plugin individually?
    reloadSite();
  };

  setupSiteFileWatchers({props, cliOptions}, ({plugin}) => {
    if (plugin) {
      reloadPlugin(plugin);
    } else {
      reloadSite();
    }
  });

  const devServer = await createWebpackDevServer({
    props,
    cliOptions,
    openUrlContext,
  });

  ['SIGINT', 'SIGTERM'].forEach((sig) => {
    process.on(sig, () => {
      devServer.stop();
      process.exit();
    });
  });

  await devServer.start();
  if (cliOptions.open) {
    openBrowser(openUrlContext.getOpenUrl({baseUrl: props.baseUrl}));
  }
}
