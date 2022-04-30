/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useLocation} from '@docusaurus/router';
import {
  useAllPluginInstancesData,
  usePluginData,
} from '@docusaurus/useGlobalData';

import {
  getActivePlugin,
  getLatestVersion,
  getActiveVersion,
  getActiveDocContext,
  getDocVersionSuggestions,
} from './docsClientUtils';
import type {
  GlobalPluginData,
  GlobalVersion,
  ActivePlugin,
  ActiveDocContext,
  DocVersionSuggestions,
} from '@docusaurus/plugin-content-docs/client';
import type {UseDataOptions} from '@docusaurus/types';

// Important to use a constant object to avoid React useEffect executions etc.
// see https://github.com/facebook/docusaurus/issues/5089
const StableEmptyObject = {};

// In blog-only mode, docs hooks are still used by the theme. We need a fail-
// safe fallback when the docs plugin is not in use
export const useAllDocsData = (): {[pluginId: string]: GlobalPluginData} =>
  useAllPluginInstancesData('docusaurus-plugin-content-docs') ??
  StableEmptyObject;

export const useDocsData = (pluginId: string | undefined): GlobalPluginData =>
  usePluginData('docusaurus-plugin-content-docs', pluginId, {
    failfast: true,
  }) as GlobalPluginData;

// TODO this feature should be provided by docusaurus core
export function useActivePlugin(
  options: UseDataOptions = {},
): ActivePlugin | undefined {
  const data = useAllDocsData();
  const {pathname} = useLocation();
  return getActivePlugin(data, pathname, options);
}

export function useActivePluginAndVersion(
  options: UseDataOptions = {},
):
  | {activePlugin: ActivePlugin; activeVersion: GlobalVersion | undefined}
  | undefined {
  const activePlugin = useActivePlugin(options);
  const {pathname} = useLocation();
  if (!activePlugin) {
    return undefined;
  }
  const activeVersion = getActiveVersion(activePlugin.pluginData, pathname);
  return {
    activePlugin,
    activeVersion,
  };
}

export function useVersions(pluginId: string | undefined): GlobalVersion[] {
  const data = useDocsData(pluginId);
  return data.versions;
}

export function useLatestVersion(pluginId: string | undefined): GlobalVersion {
  const data = useDocsData(pluginId);
  return getLatestVersion(data);
}

export function useActiveVersion(
  pluginId: string | undefined,
): GlobalVersion | undefined {
  const data = useDocsData(pluginId);
  const {pathname} = useLocation();
  return getActiveVersion(data, pathname);
}

export function useActiveDocContext(
  pluginId: string | undefined,
): ActiveDocContext {
  const data = useDocsData(pluginId);
  const {pathname} = useLocation();
  return getActiveDocContext(data, pathname);
}

export function useDocVersionSuggestions(
  pluginId: string | undefined,
): DocVersionSuggestions {
  const data = useDocsData(pluginId);
  const {pathname} = useLocation();
  return getDocVersionSuggestions(data, pathname);
}
