/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadContext, Plugin, Props} from '@docusaurus/types';
import {UserPluginOptions, PluginContext, RedirectMetadata} from './types';

import normalizePluginOptions from './normalizePluginOptions';
import collectRedirects from './collectRedirects';
import writeRedirectFiles, {
  toRedirectFilesMetadata,
  RedirectFileMetadata,
} from './writeRedirectFiles';

export default function pluginClientRedirectsPages(
  _context: LoadContext,
  opts: UserPluginOptions,
): Plugin<unknown> {
  const options = normalizePluginOptions(opts);

  return {
    name: 'docusaurus-plugin-client-redirects',
    async postBuild(props: Props) {
      const pluginContext: PluginContext = {
        relativeRoutesPaths: props.routesPaths.map((path) =>
          trimBaseUrl(path, props.baseUrl),
        ),
        baseUrl: props.baseUrl,
        outDir: props.outDir,
        options,
      };

      const redirects: RedirectMetadata[] = collectRedirects(pluginContext);

      const redirectFiles: RedirectFileMetadata[] = toRedirectFilesMetadata(
        redirects,
        pluginContext,
      );

      // Write files only at the end: make code more easy to test without IO
      await writeRedirectFiles(redirectFiles);
    },
  };
}

export function trimBaseUrl(path: string, baseUrl: string) {
  return path.startsWith(baseUrl) ? path.replace(baseUrl, '/') : path;
}
