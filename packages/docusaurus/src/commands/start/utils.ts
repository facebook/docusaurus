/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {prepareUrls} from 'react-dev-utils/WebpackDevServerUtils';
import {normalizeUrl} from '@docusaurus/utils';
import {getHostPort} from '../../server/getHostPort';
import type {StartCLIOptions} from './start';

export type OpenUrlContext = {
  host: string;
  port: number;
  getOpenUrl: ({baseUrl}: {baseUrl: string}) => string;
};

export async function createOpenUrlContext({
  cliOptions,
}: {
  cliOptions: StartCLIOptions;
}): Promise<OpenUrlContext> {
  const protocol: string = process.env.HTTPS === 'true' ? 'https' : 'http';

  const {host, port} = await getHostPort(cliOptions);
  if (port === null) {
    return process.exit();
  }

  const getOpenUrl: OpenUrlContext['getOpenUrl'] = ({baseUrl}) => {
    const urls = prepareUrls(protocol, host, port);
    return normalizeUrl([urls.localUrlForBrowser, baseUrl]);
  };

  return {host, port, getOpenUrl};
}
