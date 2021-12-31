/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';
import importFresh from 'import-fresh';
import type {
  LoadContext,
  PluginConfig,
  PresetConfig,
  ImportedPresetModule,
} from '@docusaurus/types';
import {resolveModuleName} from '../moduleShorthand';

export default function loadPresets(context: LoadContext): {
  plugins: PluginConfig[];
  themes: PluginConfig[];
} {
  // We need to resolve presets from the perspective of the siteDir, since the siteDir's package.json
  // declares the dependency on these presets.
  const presetRequire = createRequire(context.siteConfigPath);

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
    const presetName = resolveModuleName(
      presetModuleImport,
      presetRequire,
      'preset',
    );

    const presetModule = importFresh<ImportedPresetModule>(
      presetRequire.resolve(presetName),
    );
    const preset = (presetModule.default ?? presetModule)(
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
    plugins: unflatPlugins.flat().filter(Boolean),
    themes: unflatThemes.flat().filter(Boolean),
  };
}
