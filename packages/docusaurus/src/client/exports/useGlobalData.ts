/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';
import {DEFAULT_PLUGIN_ID} from './constants';
import type {GlobalData} from '@docusaurus/types';

export default function useGlobalData(): GlobalData {
  const {globalData} = useDocusaurusContext();
  if (!globalData) {
    throw new Error('Docusaurus global data not found.');
  }
  return globalData;
}

export function useAllPluginInstancesData(
  pluginName: string,
): GlobalData[string] {
  const globalData = useGlobalData();
  const pluginGlobalData = globalData[pluginName];
  if (!pluginGlobalData) {
    throw new Error(
      `Docusaurus plugin global data not found for "${pluginName}" plugin.`,
    );
  }
  return pluginGlobalData;
}

export function usePluginData(
  pluginName: string,
  pluginId: string = DEFAULT_PLUGIN_ID,
): GlobalData[string][string] {
  const pluginGlobalData = useAllPluginInstancesData(pluginName);
  const pluginInstanceGlobalData = pluginGlobalData[pluginId];
  if (!pluginInstanceGlobalData) {
    throw new Error(
      `Docusaurus plugin global data not found for "${pluginName}" plugin with id "${pluginId}".`,
    );
  }
  return pluginInstanceGlobalData;
}
