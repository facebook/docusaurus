/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import logger from '@docusaurus/logger';
import type {
  MinimizerOptions as JsMinimizerOptions,
  CustomOptions,
} from 'terser-webpack-plugin';
import type {MinimizerOptions as CssMinimizerOptions} from 'css-minimizer-webpack-plugin';

export type FasterModule = Awaited<typeof import('@docusaurus/faster')>;

async function importFaster(): Promise<FasterModule> {
  return import('@docusaurus/faster');
}

async function ensureFaster(): Promise<FasterModule> {
  try {
    return await importFaster();
  } catch (error) {
    throw new Error(
      `To enable Docusaurus Faster options, your site must add the ${logger.name(
        '@docusaurus/faster',
      )} package as a dependency.`,
      {cause: error},
    );
  }
}

export async function importRspack(): Promise<FasterModule['rspack']> {
  const faster = await ensureFaster();
  return faster.rspack;
}

export async function importSwcLoader(): Promise<string> {
  const faster = await ensureFaster();
  return faster.swcLoader;
}

export async function importGetSwcLoaderOptions(): Promise<
  FasterModule['getSwcLoaderOptions']
> {
  const faster = await ensureFaster();
  return faster.getSwcLoaderOptions;
}

export async function importSwcJsMinimizerOptions(): Promise<
  JsMinimizerOptions<CustomOptions>
> {
  const faster = await ensureFaster();
  return faster.getSwcJsMinimizerOptions() as JsMinimizerOptions<CustomOptions>;
}

export async function importSwcHtmlMinifier(): Promise<
  ReturnType<FasterModule['getSwcHtmlMinifier']>
> {
  const faster = await ensureFaster();
  return faster.getSwcHtmlMinifier();
}

export async function importGetBrowserslistQueries(): Promise<
  FasterModule['getBrowserslistQueries']
> {
  const faster = await ensureFaster();
  return faster.getBrowserslistQueries;
}

export async function importLightningCssMinimizerOptions(): Promise<
  CssMinimizerOptions<CustomOptions>
> {
  const faster = await ensureFaster();
  return faster.getLightningCssMinimizerOptions() as CssMinimizerOptions<CustomOptions>;
}
