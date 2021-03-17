/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Module from 'module';
import importFresh from 'import-fresh';
import {
  LoadContext,
  PluginConfig,
  Preset,
  PresetConfig,
} from '@docusaurus/types';

export default function loadPresets(
  context: LoadContext,
): {
  plugins: PluginConfig[];
  themes: PluginConfig[];
} {
  // We need to resolve plugins from the perspective of the siteDir, since the siteDir's package.json
  // declares the dependency on these plugins.
  // We need to fallback to createRequireFromPath since createRequire is only available in node v12.
  // See: https://nodejs.org/api/modules.html#modules_module_createrequire_filename
  const createRequire = Module.createRequire || Module.createRequireFromPath;
  const pluginRequire = createRequire(context.siteConfigPath);

  const presets: PresetConfig[] = (context.siteConfig || {}).presets || [];
  const unflatPlugins: PluginConfig[][] = [];
  const unflatThemes: PluginConfig[][] = [];

  presets.forEach((presetItem) => {
    let presetModuleImport;
    let presetOptions = {};
    if (typeof presetItem === 'string') {
      presetModuleImport = presetItem;
    } else if (Array.isArray(presetItem)) {
      [presetModuleImport, presetOptions = {}] = presetItem;
    } else {
      throw new Error('Invalid presets format detected in config.');
    }

    type PresetInitializeFunction = (
      context: LoadContext,
      presetOptions: Record<string, unknown>,
    ) => Preset;
    const presetModule = importFresh<
      PresetInitializeFunction & {
        default?: PresetInitializeFunction;
      }
    >(pluginRequire.resolve(presetModuleImport));
    const preset: Preset = (presetModule.default || presetModule)(
      context,
      presetOptions,
    );

    if (preset.plugins) {
      unflatPlugins.push(preset.plugins);
    }
    if (preset.themes) {
      unflatThemes.push(preset.themes);
    }
  });

  return {
    plugins: ([] as PluginConfig[]).concat(...unflatPlugins).filter(Boolean),
    themes: ([] as PluginConfig[]).concat(...unflatThemes).filter(Boolean),
  };
}
