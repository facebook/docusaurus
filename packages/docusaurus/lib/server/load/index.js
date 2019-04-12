/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ejs = require('ejs');
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');

const {generate} = require('@docusaurus/utils');
const loadConfig = require('./config');
const loadEnv = require('./env');
const loadTheme = require('./theme');
const loadRoutes = require('./routes');
const loadPlugins = require('./plugins');
const constants = require('../../constants');

module.exports = async function load(siteDir, cliOptions = {}) {
  const generatedFilesDir = path.resolve(
    siteDir,
    constants.GENERATED_FILES_DIR_NAME,
  );

  const siteConfig = loadConfig(siteDir);
  await generate(
    generatedFilesDir,
    constants.CONFIG_FILE_NAME,
    `export default ${JSON.stringify(siteConfig, null, 2)};`,
  );

  const env = loadEnv({siteDir, siteConfig});
  await generate(
    generatedFilesDir,
    'env.js',
    `export default ${JSON.stringify(env, null, 2)};`,
  );

  // Process plugins.
  const pluginConfigs = siteConfig.plugins || [];
  const context = {env, siteDir, generatedFilesDir, siteConfig, cliOptions};
  const {
    plugins,
    pluginsRouteConfigs,
    pluginsLoadedContent,
  } = await loadPlugins({
    pluginConfigs,
    context,
  });

  const outDir = path.resolve(siteDir, 'build');
  const {baseUrl} = siteConfig;

  // Resolve theme. TBD (Experimental)
  const themePath = loadTheme(siteDir);

  // Routing
  const {
    routesConfig,
    routesPaths,
    routesHashPath,
    routesHashPathFileName,
    routesMetadata,
    routesMetadataFileName,
    routesComponentStr,
    routesComponentFileName,
    routesAsyncModules,
    routesAsyncModulesFileName,
  } = await loadRoutes(pluginsRouteConfigs);

  await generate(
    generatedFilesDir,
    routesHashPathFileName,
    JSON.stringify(routesHashPath, null, 2),
  );
  await Promise.all(
    routesPaths.map(async routesPath => {
      const hashPath = routesHashPath[routesPath];
      const targetDir = path.join(
        generatedFilesDir,
        hashPath.replace(/^@generated\//, ''),
      );

      const metadata = routesMetadata[routesPath] || {};
      await generate(
        targetDir,
        routesMetadataFileName,
        JSON.stringify(metadata, null, 2),
      );

      const componentStr = routesComponentStr[routesPath];
      await generate(targetDir, routesComponentFileName, componentStr);

      const asyncModules = routesAsyncModules[routesPath] || [];
      await generate(
        targetDir,
        routesAsyncModulesFileName,
        JSON.stringify(asyncModules, null, 2),
      );
    }),
  );

  await generate(generatedFilesDir, 'routes.js', routesConfig);

  // -------------------------- TBD (Experimental) ----------------------
  // Generate contents metadata.
  const metadataTemplateFile = path.resolve(
    __dirname,
    '../../client/templates/metadata.template.ejs',
  );
  const metadataTemplate = fs.readFileSync(metadataTemplateFile).toString();
  const pluginMetadataImports = _.compact(pluginsLoadedContent).map(
    ({metadataKey, contentPath}) => ({
      name: metadataKey,
      path: contentPath,
    }),
  );

  const metadataFile = ejs.render(metadataTemplate, {
    imports: [
      ...pluginMetadataImports,
      {
        name: 'env',
        path: '@generated/env',
      },
    ],
  });
  await generate(generatedFilesDir, 'metadata.js', metadataFile);

  // ------------- END OF TBD -----------------------------------------

  const props = {
    siteConfig,
    siteDir,
    env,
    outDir,
    themePath,
    baseUrl,
    generatedFilesDir,
    routesPaths,
    plugins,
    cliOptions,
  };

  return props;
};
