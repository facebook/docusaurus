/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from './useDocusaurusContext';

export default function usePluginGlobalData(
  pluginName: string,
  pluginId: string = 'default',
) {
  const {globalData} = useDocusaurusContext();
  if (!globalData) {
    throw new Error('Docusaurus global data not found');
  }
  const pluginGlobalData = globalData?.[pluginName]?.[pluginId];
  if (!pluginGlobalData) {
    throw new Error(
      `Docusaurus plugin global data not found for pluginName=${pluginName} and pluginId=${pluginId}`,
    );
  }
  return pluginGlobalData;
}
