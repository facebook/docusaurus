/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';

export function useGlobalData() {
  const {globalData} = useDocusaurusContext();
  if (!globalData) {
    throw new Error('Docusaurus global data not found');
  }
  return globalData;
}

export function usePluginData<T = unknown>(
  pluginName: string,
): Record<string, T> {
  const globalData = useGlobalData();
  const pluginGlobalData = globalData[pluginName];
  if (!pluginGlobalData) {
    throw new Error(
      `Docusaurus plugin global data not found for pluginName=${pluginName}`,
    );
  }
  return pluginGlobalData;
}

export function usePluginInstanceData<T = unknown>(
  pluginName: string,
  pluginId: string = 'default',
): T {
  const pluginGlobalData = usePluginData(pluginName);
  const pluginInstanceGlobalData = pluginGlobalData[pluginId];
  if (!pluginInstanceGlobalData) {
    throw new Error(
      `Docusaurus plugin global data not found for pluginName=${pluginName} and pluginId=${pluginId}`,
    );
  }
  return pluginInstanceGlobalData as T;
}
