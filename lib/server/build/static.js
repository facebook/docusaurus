/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const color = require('color');
const render = require('../render');
const siteConfig = require(CWD + '/siteConfig');
const join = path.join;
const buildDir = join(CWD, 'build', siteConfig.projectName);
const {copyFile, writeData, readFile, checkFile} = require('./common');

const mainFileTarget = join(buildDir, 'css', 'main.css');

/** These are Docusaurus static files. The users should always over-write them
 * For example, replacing a favicon. These get added to the root of the build site. */
const buildStatic = () => {
  console.log('Creating static files...');

  // WEBSITE STATIC and User CSS
  let websiteStatic = join(CWD, 'static');
  let files = glob.sync(join(websiteStatic, '**'), {dot: true, nodir: true});
  files.forEach(file => {
    // Determine file destination
    let targetFile = join(buildDir, path.relative(websiteStatic, file));

    /**
     * If it's a CSS file, we need to work out if we should serve it or not.
     * Most CSS files will get included in the main.css unless marked as seperate
     */
    if (file.match(/\.css$/)) {
      // This returns null if the main includes it.
      var seperateCss = render.css.renderSeperateCss(file);

      if (seperateCss == null) return;
      writeData(file, seperateCss);
    }

    // Otherwise write to file
    copyFile(file, targetFile);
  });
};

const buildMainCss = () => {
  console.log('Creating main.css file...');
  writeData(mainFileTarget, render.css.renderMainCss());
};

module.exports = {buildStatic, buildMainCss};
