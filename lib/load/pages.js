const globby = require('globby');
const {encodePath, fileToPath} = require('./utils');

async function loadPages(pagesDir) {
  const pagesFiles = await globby(['**/*.js'], {
    cwd: pagesDir
  });

  const pagesMetadata = await Promise.all(
    pagesFiles.map(async source => ({
      path: encodePath(fileToPath(source)),
      source
    }))
  );
  return pagesMetadata;
}

module.exports = loadPages;
