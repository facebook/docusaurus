/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
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

type LayerEntry = [string, (filePath: string) => boolean];

function findLayer(filePath: string, layers: LayerEntry[]): string | undefined {
  // Using find() => layers order matter
  // The first layer that matches is used in priority even if others match too
  const layerEntry = layers.find((layer) => layer[1](filePath));
  return layerEntry?.[0]; // return layer name
}

const PluginName = 'docusaurus-plugin-css-cascade-layers';

const LayersDeclarationModule = 'layers.css';

function generateLayersDeclaration(layers: LayerEntry[]) {
  return `@layer ${layers.map(([name]) => name).join(', ')};`;
}

export default function pluginCssCascadeLayers(
  context: LoadContext,
  options: PluginOptions,
): Plugin | null {
  const {generatedFilesDir} = context;

  const pluginId = options.id;
  if (pluginId !== 'default') {
    // Since it's only possible to declare a single layer order
    // using this plugin twice doesn't really make sense
    throw new Error(
      'The CSS Cascade Layers plugin does not support multiple instances.',
    );
  }

  const layersDeclarationPath = path.join(
    generatedFilesDir,
    PluginName,
    pluginId,
    LayersDeclarationModule,
  );

  // Convert to array form only once, better than for each file
  const layers = Object.entries(options.layers);

  return {
    name: PluginName,
    getClientModules() {
      return [layersDeclarationPath];
    },
    async contentLoaded({actions}) {
      await actions.createData(
        LayersDeclarationModule,
        generateLayersDeclaration(layers),
      );
    },
    configurePostCss(postCssOptions) {
      const wrapInLayerPlugin: PostCssPlugin = {
        postcssPlugin: 'postcss-wrap-in-layer',
        Once(root) {
          const filePath = root.source?.input.file;
          if (!filePath) {
            return;
          }
          const layer = findLayer(filePath, layers);
          if (layer) {
            wrapCssRootInLayer(root, layer);
          }
        },
      };
      postCssOptions.plugins.push(wrapInLayerPlugin);
      return postCssOptions;
    },
  };
}

export {validateOptions} from './options';

export type {PluginOptions, Options};
