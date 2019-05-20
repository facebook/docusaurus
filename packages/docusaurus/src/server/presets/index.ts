/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import importFresh from 'import-fresh';
import _ from 'lodash';
import {LoadContext} from '../index';

export function loadPresets(context: LoadContext) {
  const presets: any[] = context.siteConfig.presets || [];
  const plugins: any[] = [];
  const themes: any[] = [];

  presets.forEach(presetItem => {
    let presetModule;
    let presetOptions = {};
    if (typeof presetItem === 'string') {
      presetModule = presetItem;
    } else if (Array.isArray(presetItem)) {
      [presetModule, presetOptions] = presetItem;
    }

    const preset = importFresh(presetModule);
    plugins.push(preset(context, presetOptions).plugins);
    themes.push(preset(context, presetOptions).themes);
  });

  return {
    plugins: _.compact(_.flatten(plugins)),
    themes: _.compact(_.flatten(themes)),
  };
}
