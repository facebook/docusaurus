const path = require('path');
const loadConfig = require('./config');
const loadDocs = require('./docs');
const loadEnv = require('./env');
const loadPages = require('./pages');
const loadTheme = require('./theme');
const {generate} = require('./utils');
const genRoutesConfig = require('./routes');

module.exports = async function load(siteDir) {
  // @tested - siteConfig
  const siteConfig = loadConfig(siteDir);
  await generate(
    'siteConfig.js',
    `export default ${JSON.stringify(siteConfig, null, 2)};`,
  );

  // @tested - env
  const env = loadEnv({siteDir, siteConfig});

  // docs
  const docsDir = path.resolve(siteDir, '..', siteConfig.customDocsPath);
  const {docsMetadatas, docsSidebars} = await loadDocs({
    siteDir,
    docsDir,
    env,
    siteConfig,
  });
  await generate(
    'docsMetadatas.js',
    `export default ${JSON.stringify(docsMetadatas, null, 2)};`,
  );
  await generate(
    'docsSidebars.js',
    `export default ${JSON.stringify(docsSidebars, null, 2)};`,
  );

  /* Create source to metadata mapping */
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

  // pages
  const pagesDir = path.resolve(siteDir, 'pages');
  const pagesMetadatas = await loadPages(pagesDir);
  await generate(
    'pagesMetadatas.js',
    `export default ${JSON.stringify(pagesMetadatas, null, 2)};`,
  );

  // resolve outDir
  const outDir = path.resolve(siteDir, 'build');

  // resolve the theme
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
  };

  // Generate React Router Config
  const routesConfig = await genRoutesConfig(props);
  await generate('routes.js', routesConfig);

  return props;
};
