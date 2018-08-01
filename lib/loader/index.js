const fs = require('fs-extra');
const path = require('path');
const loadConfig = require('./config');
const loadBlog = require('./blog');
const {generate} = require('../helpers');

module.exports = async function load(sourceDir) {
  // load siteConfig
  const siteConfig = loadConfig(sourceDir);

  // extract data from all blog files
  const blogDatas = await loadBlog(sourceDir);

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
    : path.resolve(sourceDir, '.blogi/dist');

  // resolve the path of our app user interface layout
  const uiPath =
    !siteConfig.uiPath ||
    !fs.existsSync(path.resolve(sourceDir, siteConfig.uiPath))
      ? path.resolve(__dirname, '../ui')
      : siteConfig.uiPath;

  const publicPath = siteConfig.base || '/';

  return {
    siteConfig,
    blogDatas,
    sourceDir,
    outDir,
    uiPath,
    publicPath
  };
};
