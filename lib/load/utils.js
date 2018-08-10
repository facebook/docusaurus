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

const indexRE = /(^|.*\/)index\.(md|js)$/i;
const extRE = /\.(md|js)$/;

function fileToPath(file) {
  if (indexRE.test(file)) {
    return file.replace(indexRE, '/$1');
  }
  return `/${file.replace(extRE, '').replace(/\\/g, '/')}`;
}

function encodePath(userpath) {
  return userpath
    .split('/')
    .map(item => encodeURIComponent(item))
    .join('/');
}

function fileToComponentName(file) {
  const ext = extRE.exec(file)[1];
  let str = file.replace(extRE, '');
  str = str.replace(/([A-Z])/g, ' $1');
  str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase();
  str = str.charAt(0).toUpperCase() + str.slice(1);
  str = str.replace(/[\W_]+(\w|$)/g, (_, ch) => ch.toUpperCase());
  return ext ? ext.toUpperCase() + str : str;
}

module.exports = {
  encodePath,
  generate,
  fileToPath,
  fileToComponentName
};
