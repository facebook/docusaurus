const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const {encodePath, fileToPath} = require('./utils');

async function loadPages(pagesDir) {
  const pagesFiles = await globby(['**/*.js'], {
    cwd: pagesDir
  });

  const pagesData = await Promise.all(
    pagesFiles.map(async source => {
      const filepath = path.resolve(pagesDir, source);
      return {
        path: encodePath(fileToPath(source)),
        source
      };
    })
  );
  return pagesData;
}

module.exports = loadPages;
