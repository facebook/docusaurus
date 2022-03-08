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
  ImportedPresetModule,
} from '@docusaurus/types';
import {resolveModuleName} from '../moduleShorthand';

export default async function loadPresets(context: LoadContext): Promise<{
  plugins: PluginConfig[];
  themes: PluginConfig[];
}> {
  // We need to resolve presets from the perspective of the siteDir, since the
  // siteDir's package.json declares the dependency on these presets.
  const presetRequire = createRequire(context.siteConfigPath);

  const {presets} = context.siteConfig;
  const plugins: PluginConfig[] = [];
  const themes: PluginConfig[] = [];

  presets.forEach((presetItem) => {
    let presetModuleImport: string;
    let presetOptions = {};
    if (typeof presetItem === 'string') {
      presetModuleImport = presetItem;
    } else {
      [presetModuleImport, presetOptions] = presetItem;
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
      plugins.push(...preset.plugins.filter(Boolean));
    }
    if (preset.themes) {
      themes.push(...preset.themes.filter(Boolean));
    }
  });

  return {plugins, themes};
}
