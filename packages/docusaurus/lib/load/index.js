/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');
const {generate} = require('@docusaurus/utils');
const loadConfig = require('./config');
const loadDocs = require('./docs');
const loadEnv = require('./env');
const loadTheme = require('./theme');
const loadRoutes = require('./routes');
const loadPlugins = require('./plugins');
const constants = require('../constants');

module.exports = async function load(siteDir, cliOptions = {}) {
  const generatedFilesDir = path.resolve(
    siteDir,
    constants.GENERATED_FILES_DIR_NAME,
  );
  fs.ensureDirSync(generatedFilesDir);

  // Site Config
  const siteConfig = loadConfig.loadConfig(siteDir);
  await generate(
    generatedFilesDir,
    loadConfig.configFileName,
    `export default ${JSON.stringify(siteConfig, null, 2)};`,
  );

  // Env
  const env = loadEnv({siteDir, siteConfig});
  await generate(
    generatedFilesDir,
    'env.js',
    `export default ${JSON.stringify(env, null, 2)};`,
  );

  // Docs
  const docsDir = path.resolve(siteDir, '..', siteConfig.customDocsPath);
  const {skipNextRelease} = cliOptions;
  const {docsMetadatas, docsSidebars} = await loadDocs({
    siteDir,
    docsDir,
    env,
    siteConfig,
    skipNextRelease,
  });
  await generate(
    generatedFilesDir,
    'docsMetadatas.js',
    `export default ${JSON.stringify(docsMetadatas, null, 2)};`,
  );
  await generate(
    generatedFilesDir,
    'docsSidebars.js',
    `export default ${JSON.stringify(docsSidebars, null, 2)};`,
  );

  // Create source to metadata mapping.
  const sourceToMetadata = {};
  Object.values(docsMetadatas).forEach(
    ({source, version, permalink, language}) => {
      sourceToMetadata[source] = {
        version,
        permalink,
        language,
      };
    },
  );

  // Process plugins.
  const pluginConfigs = siteConfig.plugins || [];
  const context = {env, siteDir, generatedFilesDir, siteConfig};
  const {plugins, pluginRouteConfigs} = await loadPlugins({
    pluginConfigs,
    context,
  });

  // Resolve outDir.
  const outDir = path.resolve(siteDir, 'build');

  // Resolve theme.
  const themePath = loadTheme(siteDir);

  const {baseUrl} = siteConfig;
  const versionedDir = path.join(siteDir, 'versioned_docs');
  const translatedDir = path.join(siteDir, 'translated_docs');

  // Generate React Router Config.
  const {routesConfig, routesPaths} = await loadRoutes({
    siteConfig,
    docsMetadatas,
    pluginRouteConfigs,
  });
  await generate(generatedFilesDir, 'routes.js', routesConfig);

  // Generate contents metadata.
  const metadataTemplateFile = path.resolve(
    __dirname,
    '../core/metadata.template.ejs',
  );
  const metadataTemplate = fs.readFileSync(metadataTemplateFile).toString();

  const metadataFile = ejs.render(metadataTemplate, {
    imports: [
      {
        name: 'docsMetadatas',
        path: '@generated/docsMetadatas',
      },
      {
        name: 'env',
        path: '@generated/env',
      },
      {
        name: 'docsSidebars',
        path: '@generated/docsSidebars',
      },
    ],
  });
  await generate(generatedFilesDir, 'metadata.js', metadataFile);

  const props = {
    siteConfig,
    siteDir,
    docsDir,
    docsMetadatas,
    docsSidebars,
    env,
    outDir,
    themePath,
    baseUrl,
    sourceToMetadata,
    versionedDir,
    translatedDir,
    generatedFilesDir,
    routesPaths,
    plugins,
  };

  return props;
};
