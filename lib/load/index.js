const fs = require('fs-extra');
const path = require('path');
const loadConfig = require('./config');
const loadDocs = require('./docs');
const {generate} = require('./utils');
const genRoutesConfig = require('./routes');

module.exports = async function load(siteDir) {
  // siteConfig
  const siteConfig = loadConfig(siteDir);

  // docs
  const docsDir = path.resolve(
    siteDir,
    '..',
    siteConfig.customDocsPath || 'docs'
  );
  const docsData = await loadDocs(docsDir);
  await generate(
    'docsData.js',
    `export const docsData = ${JSON.stringify(docsData, null, 2)}`
  );

  // resolve outDir
  const outDir = path.resolve(siteDir, 'build');

  // resolve the theme
  const themePath =
    siteConfig.themePath &&
    fs.existsSync(path.resolve(siteDir, siteConfig.themePath))
      ? siteConfig.themePath
      : path.resolve(__dirname, '../theme');

  const baseUrl = siteConfig.baseUrl || '/';

  const props = {
    siteConfig,
    siteDir,
    docsDir,
    docsData,
    outDir,
    themePath,
    baseUrl
  };

  // Generate React Router Config
  const routesConfig = await genRoutesConfig(props);
  await generate('routes.js', routesConfig);

  return props;
};
