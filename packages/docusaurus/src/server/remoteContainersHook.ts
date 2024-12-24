/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';

export function forceV4OnRemoteContainers(
  userCLIConfig: OptionallyProvidedHost,
): void {
  if (process.env.REMOTE_CONTAINERS === 'true') {
    if (!userCLIConfig.host) {
      userCLIConfig.host = '127.0.0.1';
      logger.info(
        'Will default to binding to IPv4 local address to better support VSCode Remote port forwarding',
      );
    } else {
      logger.warn('VSCode Remote may not support IPv6');
    }
  }
}

export type OptionallyProvidedHost = {
  host?: string;
};
