const fs = require('fs-extra');
const path = require('path');
const loadConfig = require('./config');
const loadBlog = require('./blog');
const loadDocs = require('./docs');
const {generate} = require('../helpers');

module.exports = async function load(siteDir) {
  // load siteConfig
  const siteConfig = loadConfig(siteDir);

  // docs
  const docsRelativeDir = siteConfig.customDocsPath || 'docs';
  const docsMetadata = await loadDocs(
    path.resolve(siteDir, '..', docsRelativeDir)
  );
  await generate(
    'docsMetadata.js',
    `${'/**\n * @generated\n */\n' + 'module.exports = '}${JSON.stringify(
      docsMetadata,
      null,
      2
    )};\n`
  );

  // blog
  const blogMetadata = await loadBlog(path.resolve(siteDir, 'blog'));
  await generate(
    'blogMetadata.js',
    `${'/**\n * @generated\n */\n' + 'module.exports = '}${JSON.stringify(
      blogMetadata,
      null,
      2
    )};\n`
  );

  // resolve outDir
  const outDir = siteConfig.dest
    ? path.resolve(siteConfig.dest)
    : path.resolve(siteDir, '.munseo/dist');

  // resolve the path of our app user interface layout
  const uiPath =
    !siteConfig.uiPath ||
    !fs.existsSync(path.resolve(siteDir, siteConfig.uiPath))
      ? path.resolve(__dirname, '../ui')
      : siteConfig.uiPath;

  const baseUrl = siteConfig.baseUrl || '/';

  return {
    siteConfig,
    siteDir,
    outDir,
    uiPath,
    baseUrl
  };
};
