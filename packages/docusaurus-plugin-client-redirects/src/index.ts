/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {removePrefix, addLeadingSlash} from '@docusaurus/utils';
import collectRedirects from './collectRedirects';
import writeRedirectFiles, {
  toRedirectFilesMetadata,
  type RedirectFileMetadata,
} from './writeRedirectFiles';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginContext, RedirectMetadata} from './types';
import type {PluginOptions, Options} from './options';

export default function pluginClientRedirectsPages(
  context: LoadContext,
  options: PluginOptions,
): Plugin<void> {
  const {trailingSlash} = context.siteConfig;

  return {
    name: 'docusaurus-plugin-client-redirects',
    async postBuild(props) {
      const pluginContext: PluginContext = {
        relativeRoutesPaths: props.routesPaths.map(
          (path) => `${addLeadingSlash(removePrefix(path, props.baseUrl))}`,
        ),
        baseUrl: props.baseUrl,
        outDir: props.outDir,
        options,
      };

      const redirects: RedirectMetadata[] = collectRedirects(
        pluginContext,
        trailingSlash,
      );

      const redirectFiles: RedirectFileMetadata[] = toRedirectFilesMetadata(
        redirects,
        pluginContext,
        trailingSlash,
      );

      // Write files only at the end: make code more easy to test without IO
      await writeRedirectFiles(redirectFiles);
    },
  };
}

export {validateOptions} from './options';
export type {PluginOptions, Options};
