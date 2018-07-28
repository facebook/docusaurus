const path = require('path');
const loadConfig = require('./config');
const loadBlog = require('./blog');

module.exports = async function load(sourceDir) {
  // 1. load siteConfig
  const siteConfig = loadConfig(sourceDir);

  // 2. extract data from all blog files
  const blogDatas = await loadBlog(sourceDir);

  // 3. TODO

  return {
    siteConfig,
    blogDatas
  };
};
