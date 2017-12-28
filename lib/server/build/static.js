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


const processFile = (source, target) => {
  /**
   * If it's a CSS file, we need to work out if we should serve it or not.
   * Most CSS files will get included in the main.css unless marked as seperate
   */
  if (source.match(/\.css$/)) {
    // This returns null if the main includes it.
    var seperateCss = render.css.renderSeperateCss(source);

    if (seperateCss == null) return;
    writeData(target, seperateCss);
  }

  // Otherwise write to file. Their files always over-write ours.
  copyFile(source, target, true);
}

/** These are Docusaurus static files. The users should always over-write them
 * For example, replacing a favicon. These get added to the root of the build site. */
const buildStatic = () => {
  console.log('Creating static files...');

  // WEBSITE STATIC and User CSS
  let libStaticFolder = join(CWD, '..', 'lib', 'static');
  let staticFolder = join(CWD, 'static');
  let libFiles = glob.sync(join(libStaticFolder, '**'), {dot: true, nodir: true});
  let files = glob.sync(join(staticFolder, '**'), {dot: true, nodir: true});

  // Maybe there is a better way to get the path
  libFiles.forEach(file => {
    // Determine file destination
    let target = join(buildDir, path.relative(libStaticFolder, file));
    processFile(file, target)
  });

  // Than this?
  files.forEach(file => {
    // Determine file destination
    let target = join(buildDir, path.relative(staticFolder, file));
    processFile(file, target)
  });
};

const buildMainCss = () => {
  console.log('Creating main.css file...');
  writeData(mainFileTarget, render.css.renderMainCss());
};

module.exports = {buildStatic, buildMainCss};
