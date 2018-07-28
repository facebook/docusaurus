const path = require('path');
const loadConfig = require('./config');

module.exports = async function load(sourceDir) {
  // 1. load siteConfig
  const siteConfig = loadConfig(sourceDir);

  // 2. extract metadata from markdown files
  const metadatas = [];

  return null; // todo
};
