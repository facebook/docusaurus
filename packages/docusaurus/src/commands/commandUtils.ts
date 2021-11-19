/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import choosePort from '../choosePort';
import {HostPortCLIOptions} from '@docusaurus/types';
import {DEFAULT_PORT} from '../constants';

export function getCLIOptionHost(
  hostOption: HostPortCLIOptions['host'],
): string {
  return hostOption || 'localhost';
}

export async function getCLIOptionPort(
  portOption: HostPortCLIOptions['port'],
  host: string,
): Promise<number | null> {
  const basePort = portOption ? parseInt(portOption, 10) : DEFAULT_PORT;
  return choosePort(host, basePort);
}
