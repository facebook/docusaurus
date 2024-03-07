/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as eta from 'eta';
import {getBundles} from 'react-loadable-ssr-addon-v5-slorber';
import type {SSGParams} from '../ssg';
import type {AppRenderResult} from '../common';
import type {Manifest} from 'react-loadable-ssr-addon-v5-slorber';

// TODO this is historical server template data
//  that does not look super clean nor typesafe
//  Note: changing it is a breaking change because template is configurable
export type SSRTemplateData = {
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

export type SSRTemplateCompiled = (data: SSRTemplateData) => string;

export async function compileSSRTemplate(
  template: string,
): Promise<SSRTemplateCompiled> {
  const compiledTemplate = eta.compile(template.trim(), {
    rmWhitespace: true,
  });

  return (data: SSRTemplateData) => compiledTemplate(data, eta.defaultConfig);
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

export function renderSSRTemplate({
  params,
  result,
}: {
  params: SSGParams;
  result: AppRenderResult;
}): string {
  const {
    baseUrl,
    headTags,
    preBodyTags,
    postBodyTags,
    manifest,
    noIndex,
    DOCUSAURUS_VERSION,
    ssrTemplate,
  } = params;
  const {
    html: appHtml,
    collectedData: {modules, helmet},
  } = result;

  const {scripts, stylesheets} = getScriptsAndStylesheets({manifest, modules});

  const htmlAttributes = helmet.htmlAttributes.toString();
  const bodyAttributes = helmet.bodyAttributes.toString();
  const metaStrings = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ];
  const metaAttributes = metaStrings.filter(Boolean);

  const data: SSRTemplateData = {
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

  return ssrTemplate(data);
}

export function renderHashRouterTemplate({
  params,
}: {
  params: SSGParams;
}): string {
  const {
    // baseUrl,
    headTags,
    preBodyTags,
    postBodyTags,
    manifest,
    DOCUSAURUS_VERSION,
    ssrTemplate,
  } = params;

  const {scripts, stylesheets} = getScriptsAndStylesheets({
    manifest,
    modules: [],
  });

  const data: SSRTemplateData = {
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

  return ssrTemplate(data);
}
