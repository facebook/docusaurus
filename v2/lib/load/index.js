/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs-extra');
const path = require('path');
const loadConfig = require('./config');
const loadDocs = require('./docs');
const loadEnv = require('./env');
const loadPages = require('./pages');
const loadTheme = require('./theme');
const {generate} = require('./utils');
const genRoutesConfig = require('./routes');
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

  const contentsStore = {};

  // Process plugins.
  if (siteConfig.plugins) {
    const context = {env, siteDir, siteConfig};
    // Currently runs all plugins in parallel and not order-dependent. We could change
    // this in future if there's a need.
    await Promise.all(
      siteConfig.plugins.map(async ({name, options: opts}) => {
        // TODO: Resolve using node_modules as well.
        // eslint-disable-next-line
        const Plugin = require(path.resolve(__dirname, '../../plugins', name));
        const plugin = new Plugin(opts, context);
        const {options} = plugin;
        const contents = await plugin.load();
        const pluginContents = {
          options,
          contents,
        };
        contentsStore[options.contentKey] = pluginContents;
        await generate(
          generatedFilesDir,
          options.cachePath,
          `export default ${JSON.stringify(contents, null, 2)};`,
        );
      }),
    );
  }

  // Resolve outDir.
  const outDir = path.resolve(siteDir, 'build');

  // Resolve theme.
  const themePath = loadTheme(siteDir);

  const {baseUrl} = siteConfig;
  const versionedDir = path.join(siteDir, 'versioned_docs');
  const translatedDir = path.join(siteDir, 'translated_docs');

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
    contentsStore,
  };

  // Generate React Router Config.
  const routesConfig = await genRoutesConfig(props);
  await generate(generatedFilesDir, 'routes.js', routesConfig);

  return props;
};
