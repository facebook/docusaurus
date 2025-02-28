/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import url from 'url';
import address from 'address';
import chalk from 'chalk';

// TODO Legacy CRA react-dev-utils package code
//  This code was in CRA/react-dev-utils (deprecated in 2025)
//  We just copied the code as-is to remove a fat/useless dependency subtree
//  See https://github.com/facebook/docusaurus/issues/7289
//  See https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/WebpackDevServerUtils.js

/* eslint-disable */

interface Urls {
  lanUrlForConfig?: string | undefined;
  lanUrlForTerminal?: string | undefined;
  localUrlForTerminal: string;
  localUrlForBrowser: string;
}

export function prepareUrls(
  protocol: string,
  host: string,
  port: number,
): Urls {
  const pathname = '/';

  const formatUrl = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port,
      pathname,
    });
  const prettyPrintUrl = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port: chalk.bold(port),
      pathname,
    });

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::';

  let prettyHost;
  let lanUrlForConfig;
  let lanUrlForTerminal;

  if (isUnspecifiedHost) {
    prettyHost = 'localhost';
    try {
      // This can only return an IPv4 address
      lanUrlForConfig = address.ip();
      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (
          /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
            lanUrlForConfig,
          )
        ) {
          // Address is private, format it for later use
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined;
        }
      }
    } catch (_e) {
      // ignored
    }
  } else {
    prettyHost = host;
  }
  const localUrlForTerminal = prettyPrintUrl(prettyHost);
  const localUrlForBrowser = formatUrl(prettyHost);
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser,
  };
}
