/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ejs = require('ejs');
const fs = require('fs-extra');
const path = require('path');
const loadConfig = require('./config');
const loadDocs = require('./docs');
const loadEnv = require('./env');
const loadPages = require('./pages');
const loadTheme = require('./theme');
const {generate} = require('./utils');
const loadRoutes = require('./routes');
const constants = require('../constants');

module.exports = async function load(siteDir) {
  const generatedFilesDir = path.resolve(
    siteDir,
    constants.GENERATED_FILES_DIR_NAME,
  );
  fs.ensureDirSync(generatedFilesDir);

  // Site Config - @tested
  const siteConfig = loadConfig.loadConfig(siteDir);
  await generate(
    generatedFilesDir,
    loadConfig.configFileName,
    `export default ${JSON.stringify(siteConfig, null, 2)};`,
  );

  // Env - @tested
  const env = loadEnv({siteDir, siteConfig});
  await generate(
    generatedFilesDir,
    'env.js',
    `export default ${JSON.stringify(env, null, 2)};`,
  );

  // Docs
  const docsDir = path.resolve(siteDir, '..', siteConfig.customDocsPath);
  const {docsMetadatas, docsSidebars} = await loadDocs({
    siteDir,
    docsDir,
    env,
    siteConfig,
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

  // Pages.
  const pagesDir = path.resolve(siteDir, 'pages');
  const pagesMetadatas = await loadPages({pagesDir, env, siteConfig});
  await generate(
    generatedFilesDir,
    'pagesMetadatas.js',
    `export default ${JSON.stringify(pagesMetadatas, null, 2)};`,
  );

  // Process plugins.
  const pluginConfigs = siteConfig.plugins || [];
  const context = {env, siteDir, siteConfig};

  // Initialize plugins.
  const plugins = pluginConfigs.map(({name, options: opts}) => {
    // TODO: Resolve using node_modules as well.
    // eslint-disable-next-line
    const Plugin = require(path.resolve(__dirname, '../../plugins', name));
    return new Plugin(opts, context);
  });

  // Plugin lifecycle - loadContents().
  // Currently plugins run lifecycle in parallel and are not order-dependent. We could change
  // this in future if there are plugins which need to run in certain order or depend on
  // others for data.
  const pluginsLoadedMetadata = await Promise.all(
    plugins.map(async plugin => {
      if (!plugin.loadContents) {
        return null;
      }

      const name = plugin.getName();
      const {options} = plugin;
      const {metadataKey, metadataFileName} = options;
      const metadata = await plugin.loadContents();
      const pluginContentPath = path.join(name, metadataFileName);
      const pluginContentDir = path.join(generatedFilesDir, name);
      fs.ensureDirSync(pluginContentDir);
      await generate(
        pluginContentDir,
        metadataFileName,
        JSON.stringify(metadata, null, 2),
      );
      const contentPath = path.join('@generated', pluginContentPath);

      return {
        metadataKey,
        contentPath,
        metadata,
      };
    }),
  );

  // Plugin lifecycle - generateRoutes().
  const pluginRouteConfigs = [];
  const actions = {
    addRoute: config => pluginRouteConfigs.push(config),
  };
  await Promise.all(
    plugins.map(async (plugin, index) => {
      if (!plugin.generateRoutes) {
        return;
      }
      const loadedMetadata = pluginsLoadedMetadata[index];
      await plugin.generateRoutes({
        metadata: loadedMetadata.metadata,
        actions,
      });
    }),
  );

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
    pagesMetadatas,
    pluginRouteConfigs,
  });
  await generate(generatedFilesDir, 'routes.js', routesConfig);

  // Generate contents metadata.
  const metadataTemplateFile = path.resolve(
    __dirname,
    '../core/metadata.template.ejs',
  );
  const metadataTemplate = fs.readFileSync(metadataTemplateFile).toString();
  const pluginMetadataImports = pluginsLoadedMetadata.map(
    ({metadataKey, contentPath}) => ({
      name: metadataKey,
      path: contentPath,
    }),
  );

  const metadataFile = ejs.render(metadataTemplate, {
    imports: [
      ...pluginMetadataImports,
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
      {
        name: 'pagesMetadatas',
        path: '@generated/pagesMetadatas',
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
    pagesDir,
    pagesMetadatas,
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
