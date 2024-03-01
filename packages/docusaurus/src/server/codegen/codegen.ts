/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  generate,
  escapePath,
  DEFAULT_CONFIG_FILE_NAME,
} from '@docusaurus/utils';
import {generateRouteFiles} from './codegenRoutes';
import type {
  CodeTranslations,
  DocusaurusConfig,
  GlobalData,
  I18n,
  RouteConfig,
  SiteMetadata,
} from '@docusaurus/types';

function genWarning({generatedFilesDir}: {generatedFilesDir: string}) {
  return generate(
    generatedFilesDir,
    // cSpell:ignore DONT
    'DONT-EDIT-THIS-FOLDER',
    `This folder stores temp files that Docusaurus' client bundler accesses.

DO NOT hand-modify files in this folder because they will be overwritten in the
next build. You can clear all build artifacts (including this folder) with the
\`docusaurus clear\` command.
`,
  );
}

function genSiteConfig({
  generatedFilesDir,
  siteConfig,
}: {
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
}) {
  return generate(
    generatedFilesDir,
    `${DEFAULT_CONFIG_FILE_NAME}.mjs`,
    `/*
 * AUTOGENERATED - DON'T EDIT
 * Your edits in this file will be overwritten in the next build!
 * Modify the docusaurus.config.js file at your site's root instead.
 */
export default ${JSON.stringify(siteConfig, null, 2)};
`,
  );
}

function genClientModules({
  generatedFilesDir,
  clientModules,
}: {
  generatedFilesDir: string;
  clientModules: string[];
}) {
  return generate(
    generatedFilesDir,
    'client-modules.js',
    `export default [
${clientModules
  // Use `require()` because `import()` is async but client modules can have CSS
  // and the order matters for loading CSS.
  .map((clientModule) => `  require("${escapePath(clientModule)}"),`)
  .join('\n')}
];
`,
  );
}

function genGlobalData({
  generatedFilesDir,
  globalData,
}: {
  generatedFilesDir: string;
  globalData: GlobalData;
}) {
  return generate(
    generatedFilesDir,
    'globalData.json',
    JSON.stringify(globalData, null, 2),
  );
}

function genI18n({
  generatedFilesDir,
  i18n,
}: {
  generatedFilesDir: string;
  i18n: I18n;
}) {
  return generate(
    generatedFilesDir,
    'i18n.json',
    JSON.stringify(i18n, null, 2),
  );
}

function genCodeTranslations({
  generatedFilesDir,
  codeTranslations,
}: {
  generatedFilesDir: string;
  codeTranslations: CodeTranslations;
}) {
  return generate(
    generatedFilesDir,
    'codeTranslations.json',
    JSON.stringify(codeTranslations, null, 2),
  );
}

function genSiteMetadata({
  generatedFilesDir,
  siteMetadata,
}: {
  generatedFilesDir: string;
  siteMetadata: SiteMetadata;
}) {
  return generate(
    generatedFilesDir,
    'site-metadata.json',
    JSON.stringify(siteMetadata, null, 2),
  );
}

type CodegenParams = {
  generatedFilesDir: string;
  siteConfig: DocusaurusConfig;
  baseUrl: string;
  clientModules: string[];
  globalData: GlobalData;
  i18n: I18n;
  codeTranslations: CodeTranslations;
  siteMetadata: SiteMetadata;
  routeConfigs: RouteConfig[];
};

export async function generateSiteFiles(params: CodegenParams): Promise<void> {
  await Promise.all([
    genWarning(params),
    genClientModules(params),
    genSiteConfig(params),
    generateRouteFiles(params),
    genGlobalData(params),
    genSiteMetadata(params),
    genI18n(params),
    genCodeTranslations(params),
  ]);
}