#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const CWD = process.cwd();
const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

let examplesFolder = "examples";
if (process.argv.indexOf("translations") !== -1) {
  examplesFolder = "examples-translations";
}
const files = glob.sync(path.join(__dirname, "..", examplesFolder, "**"));
files.forEach(file => {
  if (!fs.lstatSync(file).isDirectory()) {
    let target = CWD;
    if (file.includes("-examples")) {
      target = path.join(CWD, "..");
    }
    let fileName = file.substring(file.indexOf(examplesFolder) + examplesFolder.length);
    try {
      fs.copySync(file, path.join(target, fileName), {
        overwrite: false,
        errorOnExist: true
      });
      console.log(fileName + " created in " + path.basename(target));
    } catch (e) {
      console.log(
        fileName + " already exists in " + path.basename(target)
      );
    }
  }
});
