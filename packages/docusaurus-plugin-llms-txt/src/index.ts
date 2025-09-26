/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import path from 'path';
import logger from '@docusaurus/logger';
import createLlmsTxt from './createLlmsTxt';
import {DEFAULT_OPTIONS} from './options';
import type {PluginOptions, Options} from '@docusaurus/plugin-llms-txt';

// Define the minimal types we need
type LoadContext = {
  siteConfig: {
    title: string;
    url: string;
    baseUrl: string;
    tagline?: string;
    noIndex?: boolean;
    future?: {
      experimental_router?: 'hash' | 'browser';
    };
  };
};

type RouteConfig = {
  path: string;
  component: string | unknown;
  exact?: boolean;
  routes?: RouteConfig[];
};

type Plugin<_T = void> = {
  name: string;
  postBuild?: (props: {
    siteConfig: LoadContext['siteConfig'];
    routes: RouteConfig[];
    outDir: string;
  }) => Promise<void> | void;
};

const PluginName = 'docusaurus-plugin-llms-txt';

export default function pluginLlmsTxt(
  context: LoadContext,
  options: PluginOptions,
): Plugin<void> | null {
  const {siteConfig} = context;

  // Disable plugin for hash router since it doesn't support static file
  // generation
  if (siteConfig.future?.experimental_router === 'hash') {
    logger.warn(
      `${PluginName} does not support the Hash Router and will be disabled.`,
    );
    return null;
  }

  // Merge options with defaults
  const normalizedOptions: PluginOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return {
    name: PluginName,

    async postBuild({siteConfig: buildSiteConfig, routes, outDir}) {
      // Check if the site should be indexed
      if (buildSiteConfig.noIndex) {
        logger.info(
          `${PluginName}: Skipping llms.txt generation because site has noIndex enabled.`,
        );
        return;
      }

      logger.info(`${PluginName}: Generating llms.txt...`);

      try {
        // Generate llms.txt content
        const generatedLlmsTxt = await createLlmsTxt({
          siteConfig: buildSiteConfig,
          routes,
          options: normalizedOptions,
        });

        if (!generatedLlmsTxt) {
          logger.warn(
            `${PluginName}: No content found to generate llms.txt. The file will not be created.`,
          );
          return;
        }

        // Write llms.txt file
        const llmsTxtPath = path.join(outDir, normalizedOptions.filename);
        await fs.outputFile(llmsTxtPath, generatedLlmsTxt);

        logger.success(
          `${PluginName}: Generated ${normalizedOptions.filename} with ${
            generatedLlmsTxt
              .split('\n')
              .filter((line) => line.startsWith('- [')).length
          } entries.`,
        );
      } catch (error) {
        logger.error(`${PluginName}: Failed to generate llms.txt.`);
        throw error;
      }
    },
  };
}

export {validateOptions} from './options';
export type {PluginOptions, Options};
