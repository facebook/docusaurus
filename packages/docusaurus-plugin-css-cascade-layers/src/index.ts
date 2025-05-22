/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {LoadContext, Plugin} from '@docusaurus/types';
import type {PluginOptions, Options} from './options';
import type {Plugin as PostCssPlugin, Root} from 'postcss';

function wrapCssRootInLayer(root: Root, layer: string): void {
  const rootBefore = root.clone();
  root.removeAll();
  root.append({
    type: 'atrule',
    name: 'layer',
    params: layer,
    nodes: rootBefore.nodes,
  });
}

function isInfima(filePath: string) {
  return filePath.includes('node_modules/infima/dist');
}

function findAppropriateLayer(filePath: string): string | undefined {
  if (isInfima(filePath)) {
    return 'docusaurus.infima';
  } else if (filePath.includes('docusaurus-theme-common/lib')) {
    return 'docusaurus.theme-common';
  } else if (
    filePath.includes('docusaurus-theme-classic/lib') &&
    !filePath.endsWith('docusaurus-theme-classic/lib/layers.css')
  ) {
    return 'docusaurus.theme-classic';
  } else {
    return undefined;
  }
}

export default function pluginCssCascadeLayers(
  _context: LoadContext,
  _options: PluginOptions,
): Plugin | null {
  return {
    name: 'docusaurus-plugin-css-cascade-layers',
    configurePostCss(postCssOptions) {
      const wrapInLayerPlugin: PostCssPlugin = {
        postcssPlugin: 'postcss-wrap-in-layer',
        Once(root) {
          const filePath = root.source?.input.file;
          if (!filePath) {
            return;
          }
          const layer = findAppropriateLayer(filePath);
          if (layer) {
            wrapCssRootInLayer(root, layer);
          }
          console.log(`CSS layer @${layer} for ${filePath}`);
        },
      };
      postCssOptions.plugins.push(wrapInLayerPlugin);
      return postCssOptions;
    },

    injectHtmlTags() {
      // TODO ?
      return {
        preBodyTags: [
          {
            tagName: 'svg',
            attributes: {
              xmlns: 'http://www.w3.org/2000/svg',
              style: 'display: none;',
            },
            innerHTML: '',
          },
        ],
      };
    },
  };
}

export {validateOptions} from './options';

export type {PluginOptions, Options};
