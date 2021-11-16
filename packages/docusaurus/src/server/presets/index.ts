/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createRequire} from 'module';
import importFresh from 'import-fresh';
import {
  LoadContext,
  PluginConfig,
  Preset,
  PresetConfig,
  PresetModuleImport,
} from '@docusaurus/types';

function resolvePresetModule(
  pluginModuleImport: string,
  pluginRequire: NodeRequire,
): PresetModuleImport | undefined {
  try {
    const pluginPath = pluginRequire.resolve(pluginModuleImport);
    return importFresh<PresetModuleImport>(pluginPath);
  } catch (e) {
    return undefined;
  }
}

function loadPresetModule(
  presetModuleImport: string,
  pluginRequire: NodeRequire,
): PresetModuleImport {
  const resolvedPresetModules = [
    `docusaurus-preset-${presetModuleImport}`,
    `@docusaurus/preset-${presetModuleImport}`,
    `@${presetModuleImport}/docusaurus-preset`,
    presetModuleImport,
  ]
    .map((presetModuleImportAttempt) =>
      resolvePresetModule(presetModuleImportAttempt, pluginRequire),
    )
    .filter(
      (presetModule) => presetModule !== undefined,
    ) as PresetModuleImport[];

  if (resolvedPresetModules.length === 0) {
    throw new Error(
      `Docusaurus was unable to resolve the ${presetModuleImport} preset. Make sure one of the following packages are installed:\n${resolvedPresetModules.map(
        (presetModuleImportAttempt) => `* ${presetModuleImportAttempt}\n`,
      )}`,
    );
  }

  return resolvedPresetModules[0];
}

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

    const presetModule = loadPresetModule(presetModuleImport, presetRequire);
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
