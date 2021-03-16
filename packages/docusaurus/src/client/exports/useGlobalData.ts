/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';

// TODO annoying constant duplication
// if we import something from outside the /client folder,
// the tsc directory structure is affected
// import {DEFAULT_PLUGIN_ID} from '../../constants';
const DEFAULT_PLUGIN_ID = 'default';

export default function useGlobalData(): Record<string, unknown> {
  const {globalData} = useDocusaurusContext();
  if (!globalData) {
    throw new Error('Docusaurus global data not found');
  }
  return globalData;
}

export function useAllPluginInstancesData<T = unknown>(
  pluginName: string,
): Record<string, T> {
  const globalData = useGlobalData();
  const pluginGlobalData = globalData[pluginName];
  if (!pluginGlobalData) {
    throw new Error(
      `Docusaurus plugin global data not found for pluginName=${pluginName}`,
    );
  }
  return pluginGlobalData as Record<string, T>;
}

export function usePluginData<T = unknown>(
  pluginName: string,
  pluginId: string = DEFAULT_PLUGIN_ID,
): T {
  const pluginGlobalData = useAllPluginInstancesData(pluginName);
  const pluginInstanceGlobalData = pluginGlobalData[pluginId];
  if (!pluginInstanceGlobalData) {
    throw new Error(
      `Docusaurus plugin global data not found for pluginName=${pluginName} and pluginId=${pluginId}`,
    );
  }
  return pluginInstanceGlobalData as T;
}
