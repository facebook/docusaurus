/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {LoadContext} from '../index';
import {DocusaurusPluginConfig} from '../plugins';

import importFresh from 'import-fresh';
import _ from 'lodash';

export interface DocusaurusPreset {
  plugins?: DocusaurusPluginConfig[];
  themes?: DocusaurusPluginConfig[];
}

export function loadPresets(
  context: LoadContext,
): {
  pluginConfigs: DocusaurusPluginConfig[];
  themeConfigs: DocusaurusPluginConfig[];
} {
  const presets: any[] = context.siteConfig.presets || [];
  const plugins: (DocusaurusPluginConfig[] | undefined)[] = [];
  const themes: (DocusaurusPluginConfig[] | undefined)[] = [];

  presets.forEach(presetItem => {
    let presetModuleImport;
    let presetOptions = {};
    if (typeof presetItem === 'string') {
      presetModuleImport = presetItem;
    } else if (Array.isArray(presetItem)) {
      [presetModuleImport, presetOptions] = presetItem;
    }

    const presetModule = importFresh(presetModuleImport);
    const preset: DocusaurusPreset = presetModule(context, presetOptions);

    plugins.push(preset.plugins);
    themes.push(preset.themes);
  });

  return {
    pluginConfigs: _.compact(
      _.flatten<DocusaurusPluginConfig | undefined>(plugins),
    ),
    themeConfigs: _.compact(
      _.flatten<DocusaurusPluginConfig | undefined>(themes),
    ),
  };
}
