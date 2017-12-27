/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs-extra');

// These arguably make the code easier to read.
// I'm not sure if this is good practice, but being able to mock these might be useful

// Also, you could forward any write request to say an FTP server for instance here.

// Not sure if this should stay.

// write raw content to the file
const writeData = (file, content) => {
  // console.log(`Creating: ${file}`);
  var parsed = path.parse(file);
  mkdirp.sync(parsed.dir);
  fs.writeFileSync(file, content);
};

// create the folder path for a file if it does not exist, then write the file
const copyFile = (source, target) => {
  // console.log(`Copying: ${target}`);
  var parsed = path.parse(target);
  mkdirp.sync(parsed.dir);
  fs.copyFileSync(source, target);
};

const readFile = file => {
  return fs.readFileSync(file, 'utf8');
};

const checkFile = file => {
  return fs.existsSync(file);
};

module.exports = {
  checkFile,
  readFile,
  copyFile,
  writeData,
};
