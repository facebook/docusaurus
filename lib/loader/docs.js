const fs = require('fs-extra');
const path = require('path');
const fm = require('front-matter');
const globby = require('globby');

const indexRE = /(^|.*\/)index\.md$/i;
const mdRE = /\.md$/;

function fileToPath(file) {
  if (indexRE.test(file)) {
    return file.replace(indexRE, '/$1');
  }
  return `/${file.replace(mdRE, '').replace(/\\/g, '/')}.html`;
}

function parse(fileString) {
  if (!fm.test(fileString)) {
    return {metadata: null, content: fileString};
  }
  const {attributes: metadata, body: content} = fm(fileString);

  return {metadata, content};
}

async function loadDocs(siteDir) {
  const blogFiles = await globby(['**/*.md'], {
    cwd: siteDir
  });

  const blogDatas = await Promise.all(
    blogFiles.map(async file => {
      const filepath = path.resolve(siteDir, file);
      const fileString = await fs.readFile(filepath, 'utf-8');
      const {metadata, content} = parse(fileString);

      return {
        path: fileToPath(file),
        content,
        ...metadata
      };
    })
  );
  blogDatas.sort((a, b) => b.date - a.date);
  return blogDatas;
}

module.exports = loadDocs;
