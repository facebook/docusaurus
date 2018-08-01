const path = require('path');
const fs = require('fs-extra');

const genPath = path.resolve(__dirname, '../generated');
fs.ensureDirSync(genPath);

const genCache = new Map();
module.exports = async function(file, content) {
  const cached = genCache.get(file);
  if (cached !== content) {
    await fs.writeFile(path.join(genPath, file), content);
    genCache.set(file, content);
  }
};
