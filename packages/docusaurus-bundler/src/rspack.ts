/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Rspack is imported lazily: sites using webpack shouldn't pay its load cost
export type Rspack = (typeof import('@rspack/core'))['rspack'];

export type RspackDevServer =
  (typeof import('@rspack/dev-server'))['RspackDevServer'];

export async function importRspack(): Promise<Rspack> {
  const {rspack} = await import('@rspack/core');
  return rspack;
}

export async function importRspackDevServer(): Promise<RspackDevServer> {
  const {RspackDevServer} = await import('@rspack/dev-server');
  return RspackDevServer;
}
