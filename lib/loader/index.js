const fs = require('fs-extra');
const path = require('path');
const loadConfig = require('./config');
const loadBlog = require('./blog');
const {generate} = require('../helpers');

module.exports = async function load(siteDir) {
  // load siteConfig
  const siteConfig = loadConfig(siteDir);

  // extract data from all blog files
  const blogDatas = await loadBlog(siteDir);

  await generate(
    'blogDatas.js',
    `${'/**\n * @generated\n */\n' + 'module.exports = '}${JSON.stringify(
      blogDatas,
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

  const publicPath = siteConfig.base || '/';

  return {
    siteConfig,
    blogDatas,
    siteDir,
    outDir,
    uiPath,
    publicPath
  };
};
