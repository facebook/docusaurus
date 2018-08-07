const fs = require('fs-extra');
const path = require('path');
const fm = require('front-matter');
const globby = require('globby');
const {encodePath, fileToPath} = require('./utils');

function parse(fileString) {
  if (!fm.test(fileString)) {
    return {metadata: null, content: fileString};
  }
  const {attributes: metadata, body: content} = fm(fileString);

  return {metadata, content};
}

async function loadDocs(docsDir) {
  const docsFiles = await globby(['**/*.md'], {
    cwd: docsDir
  });

  const docsData = await Promise.all(
    docsFiles.map(async source => {
      const filepath = path.resolve(docsDir, source);
      const fileString = await fs.readFile(filepath, 'utf-8');
      const {metadata} = parse(fileString);

      return {
        path: encodePath(fileToPath(source)),
        source,
        ...metadata
      };
    })
  );
  return docsData;
}

module.exports = loadDocs;
