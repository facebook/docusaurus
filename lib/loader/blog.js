const fs = require('fs-extra');
const path = require('path');
const fm = require('front-matter');
const globby = require('globby');
const indexRE = /(^|.*\/)index\.md$/i;
const extRE = /\.md$/;

function fileToPath(file) {
  if (indexRE.test(file)) {
    // index.md -> /
    // foo/index.md -> /foo/
    return file.replace(indexRE, '/$1');
  } else {
    // foo.md -> /foo.html
    // foo/bar.md -> /foo/bar.html
    return `/${file.replace(extRE, '').replace(/\\/g, '/')}.html`;
  }
}

function parse(fileString) {
  if (!fm.test(fileString)) {
    return {metadata: null, content: fileString};
  }
  const {attributes: metadata, body: content} = fm(fileString);

  return {metadata, content};
}

async function loadBlog(sourceDir) {
  const blogFiles = await globby(['**/*.md', '!.blogi', '!node_modules'], {
    cwd: sourceDir
  });

  const blogDatas = await Promise.all(
    blogFiles.map(async file => {
      const filepath = path.resolve(sourceDir, file);
      const fileString = await fs.readFile(filepath, 'utf-8');
      const {metadata, content} = parse(fileString);

      return {
        path: fileToPath(file),
        content: content,
        title: metadata.title,
        date: metadata.date
      };
    })
  );
  blogDatas.sort((a, b) => b.date - a.date);
  return blogDatas;
}

module.exports = loadBlog;
