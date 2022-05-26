/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';
import {DEFAULT_PLUGIN_ID} from './constants';
import type {GlobalData, UseDataOptions} from '@docusaurus/types';

export default function useGlobalData(): GlobalData {
  const {globalData} = useDocusaurusContext();
  return globalData;
}

export function useAllPluginInstancesData(
  pluginName: string,
  options: UseDataOptions = {},
): GlobalData[string] | undefined {
  const globalData = useGlobalData();
  const pluginGlobalData = globalData[pluginName];
  if (!pluginGlobalData && options.failfast) {
    throw new Error(
      `Docusaurus plugin global data not found for "${pluginName}" plugin.`,
    );
  }
  return pluginGlobalData;
}

export function usePluginData(
  pluginName: string,
  pluginId: string = DEFAULT_PLUGIN_ID,
  options: UseDataOptions = {},
): GlobalData[string][string] {
  const pluginGlobalData = useAllPluginInstancesData(pluginName);
  const pluginInstanceGlobalData = pluginGlobalData?.[pluginId];
  if (!pluginInstanceGlobalData && options.failfast) {
    throw new Error(
      `Docusaurus plugin global data not found for "${pluginName}" plugin with id "${pluginId}".`,
    );
  }
  return pluginInstanceGlobalData;
}
