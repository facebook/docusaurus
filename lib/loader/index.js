const fs = require('fs-extra');
const path = require('path');
const loadConfig = require('./config');
const loadBlog = require('./blog');

module.exports = async function load(sourceDir) {
  // load siteConfig
  const siteConfig = loadConfig(sourceDir);

  // extract data from all blog files
  const blogDatas = await loadBlog(sourceDir);

  // resolve outDir
  const outDir = siteConfig.dest
    ? path.resolve(siteConfig.dest)
    : path.resolve(sourceDir, '.blogi/dist');

  // resolve the path of our app theme/ layout
  const themePath =
    !siteConfig.themePath ||
    !fs.existsSync(path.resolve(sourceDir, siteConfig.themePath))
      ? path.resolve(__dirname, '../theme')
      : siteConfig.themePath;

  const publicPath = siteConfig.base || '/';

  return {
    siteConfig,
    blogDatas,
    sourceDir,
    outDir,
    themePath,
    publicPath
  };
};
