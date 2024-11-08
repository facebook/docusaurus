/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import _ from 'lodash';
import {getCustomBabelConfigFilePath} from '@docusaurus/babel';
import logger from '@docusaurus/logger';
import type {Site} from './site';

type Params = {site: Site};

type SiteMessage = {type: 'warning' | 'error'; message: string};

type SiteMessageCreator = (params: Params) => Promise<SiteMessage[]>;

const uselessBabelConfigMessages: SiteMessageCreator = async ({site}) => {
  const {
    props: {siteDir, siteConfig},
  } = site;
  if (siteConfig.future.experimental_faster.swcJsLoader) {
    const babelConfigFilePath = await getCustomBabelConfigFilePath(siteDir);
    if (babelConfigFilePath) {
      return [
        {
          type: 'warning',
          message: `Your site is using the SWC js loader. You can safely remove the Babel config file at ${logger.code(
            path.relative(process.cwd(), babelConfigFilePath),
          )}.`,
        },
      ];
    }
  }
  return [];
};

export async function collectAllSiteMessages(
  params: Params,
): Promise<SiteMessage[]> {
  const messageCreators: SiteMessageCreator[] = [uselessBabelConfigMessages];
  return (
    await Promise.all(
      messageCreators.map((createMessages) => createMessages(params)),
    )
  ).flat();
}

function printSiteMessages(siteMessages: SiteMessage[]): void {
  const [errors, warnings] = _.partition(
    siteMessages,
    (sm) => sm.type === 'error',
  );
  if (errors.length > 0) {
    logger.error(`Docusaurus site errors:
- ${errors.map((sm) => sm.message).join('\n- ')}`);
  }
  if (warnings.length > 0) {
    logger.warn(`Docusaurus site warnings:
- ${warnings.map((sm) => sm.message).join('\n- ')}`);
  }
}

export async function emitSiteMessages(params: Params): Promise<void> {
  const siteMessages = await collectAllSiteMessages(params);
  printSiteMessages(siteMessages);
}
