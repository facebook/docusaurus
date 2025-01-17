/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as eta from 'eta';
import {getBundles} from 'react-loadable-ssr-addon-v5-slorber';
import {PerfLogger} from '@docusaurus/logger';
import type {SSGParams} from './ssgParams';
import type {AppRenderResult} from '../common';
import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';

// TODO Docusaurus v4 breaking change - this is historical server template data
//  that does not look super clean nor typesafe
//  Note: changing it is a breaking change because template is configurable
export type SSGTemplateData = {
  appHtml: string;
  baseUrl: string;
  htmlAttributes: string;
  bodyAttributes: string;
  headTags: string;
  preBodyTags: string;
  postBodyTags: string;
  metaAttributes: string[];
  scripts: string[];
  stylesheets: string[];
  noIndex: boolean;
  version: string;
};

export type SSGTemplateCompiled = (data: SSGTemplateData) => string;

export async function compileSSGTemplate(
  template: string,
): Promise<SSGTemplateCompiled> {
  const compiledTemplate = eta.compile(template.trim(), {
    rmWhitespace: true,
  });

  return (data: SSGTemplateData) => compiledTemplate(data, eta.defaultConfig);
}

/**
 * Given a list of modules that were SSR an d
 * @param modules
 * @param manifest
 */
function getScriptsAndStylesheets({
  modules,
  manifest,
}: {
  modules: string[];
  manifest: Manifest;
}) {
  // Get all required assets for this particular page
  // based on client manifest information.
  const modulesToBeLoaded = [...manifest.entrypoints, ...Array.from(modules)];
  const bundles = getBundles(manifest, modulesToBeLoaded);
  const stylesheets = (bundles.css ?? []).map((b) => b.file);
  const scripts = (bundles.js ?? []).map((b) => b.file);
  return {scripts, stylesheets};
}

export function renderSSGTemplate({
  params,
  result,
  ssgTemplate,
}: {
  params: SSGParams;
  result: AppRenderResult;
  ssgTemplate: SSGTemplateCompiled;
}): string {
  const {
    baseUrl,
    headTags,
    preBodyTags,
    postBodyTags,
    manifest,
    noIndex,
    DOCUSAURUS_VERSION,
  } = params;
  const {
    html: appHtml,
    collectedData: {modules, metadata},
  } = result;

  const {scripts, stylesheets} = getScriptsAndStylesheets({manifest, modules});

  const {htmlAttributes, bodyAttributes} = metadata.internal;
  const metaStrings = [
    metadata.internal.title,
    metadata.internal.meta,
    metadata.internal.link,
    metadata.internal.script,
  ];
  const metaAttributes = metaStrings.filter(Boolean);

  const data: SSGTemplateData = {
    appHtml,
    baseUrl,
    htmlAttributes,
    bodyAttributes,
    headTags,
    preBodyTags,
    postBodyTags,
    metaAttributes,
    scripts,
    stylesheets,
    noIndex,
    version: DOCUSAURUS_VERSION,
  };

  return ssgTemplate(data);
}

export async function renderHashRouterTemplate({
  params,
}: {
  params: SSGParams;
}): Promise<string> {
  const {
    // baseUrl,
    headTags,
    preBodyTags,
    postBodyTags,
    manifest,
    DOCUSAURUS_VERSION,
    ssgTemplateContent,
  } = params;

  const ssgTemplate = await PerfLogger.async('Compile SSG template', () =>
    compileSSGTemplate(ssgTemplateContent),
  );

  const {scripts, stylesheets} = getScriptsAndStylesheets({
    manifest,
    modules: [],
  });

  const data: SSGTemplateData = {
    appHtml: '',
    baseUrl: './',
    htmlAttributes: '',
    bodyAttributes: '',
    headTags,
    preBodyTags,
    postBodyTags,
    metaAttributes: [],
    scripts,
    stylesheets,
    noIndex: false,
    version: DOCUSAURUS_VERSION,
  };

  return ssgTemplate(data);
}
