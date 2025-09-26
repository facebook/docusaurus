/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import webpack from 'webpack';
import WebpackBar from 'webpackbar';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import {importRspack} from './importFaster';
import type {FasterModule} from './importFaster';
import type {CurrentBundler, DocusaurusConfig} from '@docusaurus/types';

// We inject a site config slice because the Rspack flag might change place
type SiteConfigSlice = {
  future: {
    experimental_faster: Pick<
      DocusaurusConfig['future']['experimental_faster'],
      'rspackBundler'
    >;
  };
};

function isRspack(siteConfig: SiteConfigSlice): boolean {
  return siteConfig.future.experimental_faster.rspackBundler;
}

export async function getCurrentBundler({
  siteConfig,
}: {
  siteConfig: SiteConfigSlice;
}): Promise<CurrentBundler> {
  if (isRspack(siteConfig)) {
    return {
      name: 'rspack',
      instance: (await importRspack()) as unknown as typeof webpack,
    };
  }
  return {
    name: 'webpack',
    instance: webpack,
  };
}

export function getCurrentBundlerAsRspack({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): FasterModule['rspack'] {
  if (currentBundler.name !== 'rspack') {
    throw new Error(
      `Can't getCurrentBundlerAsRspack() because current bundler is ${currentBundler.name}`,
    );
  }
  return currentBundler.instance as unknown as FasterModule['rspack'];
}

export async function getCSSExtractPlugin({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): Promise<typeof MiniCssExtractPlugin> {
  if (currentBundler.name === 'rspack') {
    // @ts-expect-error: this exists only in Rspack
    return currentBundler.instance.CssExtractRspackPlugin;
  }
  return MiniCssExtractPlugin;
}

export async function getCopyPlugin({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): Promise<typeof CopyWebpackPlugin> {
  if (currentBundler.name === 'rspack') {
    // @ts-expect-error: this exists only in Rspack
    return currentBundler.instance.CopyRspackPlugin;
  }
  return CopyWebpackPlugin;
}

export async function getProgressBarPlugin({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): Promise<typeof WebpackBar> {
  if (currentBundler.name === 'rspack') {
    const rspack = getCurrentBundlerAsRspack({currentBundler});
    class CustomRspackProgressPlugin extends rspack.ProgressPlugin {
      constructor({name, color = 'green'}: {name?: string; color?: string}) {
        // Unfortunately rspack.ProgressPlugin does not have name/color options
        // See https://rspack.dev/plugins/webpack/progress-plugin
        super({
          prefix: name,
          template: `● {prefix:.bold} {bar:50.${color}/white.dim} ({percent}%) {wide_msg:.dim}`,
          progressChars: '██',
        });
      }
    }
    return CustomRspackProgressPlugin as unknown as typeof WebpackBar;
  }

  return WebpackBar;
}

export async function registerBundlerTracing({
  currentBundler,
}: {
  currentBundler: CurrentBundler;
}): Promise<() => Promise<void>> {
  if (currentBundler.name === 'rspack') {
    const Rspack = await importRspack();

    // See https://rspack.dev/contribute/development/profiling
    // File can be opened with https://ui.perfetto.dev/
    if (process.env.DOCUSAURUS_RSPACK_TRACE) {
      // We use the env variable as the "filter" attribute
      // See values here: https://rspack.dev/contribute/development/tracing#tracing-filter
      let filter = process.env.DOCUSAURUS_RSPACK_TRACE;

      if (filter === 'true' || filter === '1') {
        // Default value recommended by the Rspack team
        // It's also what the CLI uses for the "overview" preset:
        // https://github.com/web-infra-dev/rspack/blob/v1.3.10/packages/rspack-cli/src/utils/profile.ts
        filter = 'info';
      }

      await Rspack.experiments.globalTrace.register(
        filter,
        'perfetto',
        './rspack-tracing.pftrace',
      );

      console.info(`Rspack tracing registered, filter=${filter}`);

      return async () => {
        await Rspack.experiments.globalTrace.cleanup();
        console.log(`Rspack tracing cleaned up, filter=${filter}`);
      };
    }
  }

  // We don't support Webpack tracing at the moment
  return async () => {
    // noop
  };
}
