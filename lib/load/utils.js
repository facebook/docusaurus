const path = require('path');
const fs = require('fs-extra');

const genPath = path.resolve(__dirname, '../core/generated');
fs.ensureDirSync(genPath);

const genCache = new Map();
async function generate(file, content) {
  const cached = genCache.get(file);
  if (cached !== content) {
    await fs.writeFile(path.join(genPath, file), content);
    genCache.set(file, content);
  }
}

const indexRE = /(^|.*\/)index\.md$/i;
const mdRE = /\.md$/;

function fileToPath(file) {
  if (indexRE.test(file)) {
    return file.replace(indexRE, '/$1');
  }
  return `/${file.replace(mdRE, '').replace(/\\/g, '/')}`;
}

function encodePath(userpath) {
  return userpath
    .split('/')
    .map(item => encodeURIComponent(item))
    .join('/');
}

function fileToComponentName(file) {
  let str = file.replace(/([A-Z])/g, ' $1');
  if (str.length === 1) {
    return str.toUpperCase();
  }
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase();
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str.replace(/[\W_]+(\w|$)/g, (_, ch) => ch.toUpperCase());
}

module.exports = {
  encodePath,
  generate,
  fileToPath,
  fileToComponentName
};
