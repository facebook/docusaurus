/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadContext} from '../index';
import {PluginConfig} from '../plugins';

import importFresh from 'import-fresh';
import _ from 'lodash';

export interface Preset {
  plugins?: PluginConfig[];
  themes?: PluginConfig[];
}

export function loadPresets(
  context: LoadContext,
): {
  plugins: PluginConfig[];
  themes: PluginConfig[];
} {
  const presets: any[] = context.siteConfig.presets || [];
  const plugins: (PluginConfig[] | undefined)[] = [];
  const themes: (PluginConfig[] | undefined)[] = [];

  presets.forEach(presetItem => {
    let presetModuleImport;
    let presetOptions = {};
    if (typeof presetItem === 'string') {
      presetModuleImport = presetItem;
    } else if (Array.isArray(presetItem)) {
      [presetModuleImport, presetOptions] = presetItem;
    }

    const presetModule = importFresh(presetModuleImport);
    const preset: Preset = presetModule(context, presetOptions);

    plugins.push(preset.plugins);
    themes.push(preset.themes);
  });

  return {
    plugins: _.compact(_.flatten<PluginConfig | undefined>(plugins)),
    themes: _.compact(_.flatten<PluginConfig | undefined>(themes)),
  };
}
