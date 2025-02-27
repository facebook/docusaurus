/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs-extra';
import {DOCUSAURUS_VERSION} from '@docusaurus/utils';
import {PerfLogger} from '@docusaurus/logger';
import DefaultSSGTemplate from './ssgTemplate.html';
import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';
import type {Props} from '@docusaurus/types';

import type {HtmlMinifierType} from '@docusaurus/bundler';

// Keep these params serializable
// This makes it possible to use workers
export type SSGParams = {
  trailingSlash: boolean | undefined;
  manifest: Manifest;
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
  outDir: string;
  baseUrl: string;
  noIndex: boolean;
  DOCUSAURUS_VERSION: string;

  htmlMinifierType: HtmlMinifierType;
  serverBundlePath: string;
  ssgTemplateContent: string;

  // TODO Docusaurus v4: remove deprecated postBuild({head}) API
  v4RemoveLegacyPostBuildHeadAttribute: boolean;
};

export async function createSSGParams({
  props,
  serverBundlePath,
  clientManifestPath,
}: {
  props: Props;
  serverBundlePath: string;
  clientManifestPath: string;
}): Promise<SSGParams> {
  const manifest: Manifest = await PerfLogger.async(
    'Read client manifest',
    () => fs.readJSON(clientManifestPath, 'utf-8'),
  );

  const params: SSGParams = {
    trailingSlash: props.siteConfig.trailingSlash,
    outDir: props.outDir,
    baseUrl: props.baseUrl,
    manifest,
    headTags: props.headTags,
    preBodyTags: props.preBodyTags,
    postBodyTags: props.postBodyTags,
    ssgTemplateContent: props.siteConfig.ssrTemplate ?? DefaultSSGTemplate,
    noIndex: props.siteConfig.noIndex,
    DOCUSAURUS_VERSION,
    serverBundlePath,
    htmlMinifierType: props.siteConfig.future.experimental_faster
      .swcHtmlMinimizer
      ? 'swc'
      : 'terser',

    v4RemoveLegacyPostBuildHeadAttribute:
      props.siteConfig.future.v4.removeLegacyPostBuildHeadAttribute,
  };

  // Useless but ensures that SSG params remain serializable
  return structuredClone(params);
}
