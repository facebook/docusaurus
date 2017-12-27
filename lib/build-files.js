#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


const chalk = require('chalk');
const fs = require('fs-extra');
const CWD = process.cwd();
const path = require('path');
const join = path.join;
const writeTranslations = require('./write-translations');

require('babel-register')({
  babelrc: false,
  only: [__dirname, process.cwd() + '/core'],
  plugins: [require('./server/translate-plugin.js')],
  presets: ['react', 'env'],
});

const siteConfig = require(CWD + '/siteConfig.js');
const buildDir = join(CWD, 'build', siteConfig.projectName);

// Main entry point for build
const buildEverything = () => {
  
  console.log(chalk.red(`Removing existing build directory!`));
  fs.removeSync(buildDir);
  // We need to ensure we have tranlsations as the build dependencies need them.
  writeTranslations();

  
  if (!fs.existsSync(CWD + '/siteConfig.js')) {
    console.error(
      chalk.red('Error: No siteConfig.js file found in website folder!')
    );
    process.exit(1);
  }
  
  // Start Message
  console.log(`Building site to directory: ${chalk.blue(buildDir)}`);
  
  const build = require('./server/build');
  // Build Steps. The order of these doesn't matter
  build.docs();
  build.pages();
  build.blog();
  build.staticFiles.buildMainCss();
  build.staticFiles.buildStatic();
  build.misc();

  // Success message
  console.log(
    chalk.green("Success: Site Built! Generated files in 'build' folder.")
  );
};

// Execute
buildEverything();
