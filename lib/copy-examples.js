#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const chalk = require('chalk');
const commander = require('commander');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');

const CWD = process.cwd();

let feature;

commander
  .arguments('[feature]')
  .action(feat => {
    feature = feat;
  })
  .parse(process.argv);

// add scripts to package.json file
if (fs.existsSync(`${CWD}/package.json`)) {
  const packageContent = JSON.parse(
    fs.readFileSync(`${CWD}/package.json`, 'utf8')
  );
  if (!packageContent.scripts) {
    packageContent.scripts = {};
  }
  packageContent.scripts.start = 'docusaurus-start';
  packageContent.scripts.build = 'docusaurus-build';
  packageContent.scripts['publish-gh-pages'] = 'docusaurus-publish';
  packageContent.scripts.examples = 'docusaurus-examples';
  packageContent.scripts['write-translations'] =
    'docusaurus-write-translations';
  packageContent.scripts.version = 'docusaurus-version';
  packageContent.scripts['rename-version'] = 'docusaurus-rename-version';
  fs.writeFileSync(
    `${CWD}/package.json`,
    `${JSON.stringify(packageContent, null, 2)}\n`
  );
  console.log(
    `${chalk.green('Wrote docusaurus scripts to package.json file.')}\n`
  );
}

const outerFolder = path.basename(path.dirname(CWD));

let docsCreated = false;
let blogCreated = false;
let exampleSiteCreated = false;

// handles cases where feature is "translations", "versions" or neither/not present
if (feature === 'translations') {
  // copy files for translations
  const folder = path.join(__dirname, '..', 'examples', 'translations');
  if (fs.existsSync(`${CWD}/../crowdin.yaml`)) {
    console.log(
      `${chalk.yellow('crowdin.yaml already exists')} in ${chalk.yellow(
        `${outerFolder}/`
      )}. Rename or remove the file to regenerate an example version.\n`
    );
  } else {
    fs.copySync(`${folder}/crowdin.yaml`, `${CWD}/../crowdin.yaml`);
    exampleSiteCreated = true;
  }
  const files = glob.sync(`${folder}/**/*`);
  files.forEach(file => {
    if (fs.lstatSync(file).isDirectory()) {
      return;
    }
    if (path.basename(file) === 'crowdin.yaml') {
      return;
    }
    const filePath = path.resolve(file).split(path.resolve(folder))[1];
    try {
      fs.copySync(file, CWD + filePath, {
        overwrite: false,
        errorOnExist: true,
      });
      exampleSiteCreated = true;
    } catch (e) {
      console.log(
        `${chalk.yellow(
          `${path.basename(filePath)} already exists`
        )} in ${chalk.yellow(
          `website${filePath.split(path.basename(filePath))[0]}`
        )}. Rename or remove the file to regenerate an example version.\n`
      );
    }
  });
} else if (feature === 'versions') {
  // copy files for versions
  const folder = path.join(__dirname, '..', 'examples', 'versions');
  const files = glob.sync(`${folder}/**/*`);
  files.forEach(file => {
    if (fs.lstatSync(file).isDirectory()) {
      return;
    }
    const filePath = path.resolve(file).split(path.resolve(folder))[1];
    try {
      fs.copySync(file, CWD + filePath, {
        overwrite: false,
        errorOnExist: true,
      });
      exampleSiteCreated = true;
    } catch (e) {
      console.log(
        `${chalk.yellow(
          `${path.basename(filePath)} already exists`
        )} in ${chalk.yellow(
          `website${filePath.split(path.basename(filePath))[0]}`
        )}. Rename or remove the file to regenerate an example version.\n`
      );
    }
  });
} else {
  const folder = path.join(__dirname, '..', 'examples', 'basics');
  // copy docs examples
  if (fs.existsSync(`${CWD}/../docs-examples-from-docusaurus`)) {
    console.log(
      `- ${chalk.green(
        'docs-examples-from-docusaurus'
      )} already exists in ${chalk.blue(outerFolder)}.`
    );
  } else {
    fs.copySync(
      `${folder}/docs-examples-from-docusaurus`,
      `${CWD}/../docs-examples-from-docusaurus`
    );
    exampleSiteCreated = true;
    docsCreated = true;
  }
  // copy blog examples
  if (fs.existsSync(`${CWD}/blog-examples-from-docusaurus`)) {
    console.log(
      `- ${chalk.green(
        'blog-examples-from-docusaurus'
      )} already exists in ${chalk.blue(`${outerFolder}/website`)}.`
    );
  } else {
    fs.copySync(
      path.join(folder, 'blog-examples-from-docusaurus'),
      path.join(CWD, 'blog-examples-from-docusaurus')
    );
    exampleSiteCreated = true;
    blogCreated = true;
  }

  const copyFileToWebsite = (fileNameFrom, fileNameTo) => {
    const copiedFileName = fileNameTo || fileNameFrom;
    const src = path.join(folder, fileNameFrom);
    const dest = path.join(CWD, '..', copiedFileName);
    if (fs.existsSync(dest)) {
      console.log(
        `- ${chalk.green(copiedFileName)} already exists in ${chalk.blue(
          outerFolder
        )}.`
      );
    } else {
      fs.copySync(src, dest);
    }
  };

  // copy .gitignore file
  copyFileToWebsite('gitignore', '.gitignore');

  // copy Dockerfile file
  copyFileToWebsite('Dockerfile');

  // copy docker-compose.yml file
  copyFileToWebsite('docker-compose.yml');

  // copy .dockerignore file
  copyFileToWebsite('dockerignore', '.dockerignore');

  // copy other files
  const files = glob.sync(`${folder}/**/*`);
  files.forEach(file => {
    if (fs.lstatSync(file).isDirectory()) {
      return;
    }
    const containingFolder = path.basename(path.dirname(file));
    if (
      path.basename(file) === 'gitignore' ||
      path.basename(file) === 'Dockerfile' ||
      path.basename(file) === 'docker-compose.yml' ||
      path.basename(file) === 'dockerignore' ||
      containingFolder === 'blog-examples-from-docusaurus' ||
      containingFolder === 'docs-examples-from-docusaurus'
    ) {
      return;
    }
    const filePath = path.resolve(file).split(path.resolve(folder))[1];
    try {
      fs.copySync(file, CWD + filePath, {
        overwrite: false,
        errorOnExist: true,
      });
      exampleSiteCreated = true;
    } catch (e) {
      console.log(
        `- ${chalk.green(
          `${path.basename(filePath)}`
        )} already exists in ${chalk.blue(
          `${outerFolder}/website${filePath.split(path.basename(filePath))[0]}`
        )}.`
      );
    }
  });

  if (exampleSiteCreated) {
    try {
      const tree = require('tree-node-cli');
      const dirString = tree(path.join(CWD, '..'), {
        exclude: [
          /node_modules/, // npm
          /vendor/, // composer
        ],
      });
      console.log(dirString);
    } catch (error) {
      console.warn(`Error printing directory: ${error}`);
    }
  }
}

if (docsCreated) {
  console.log(
    `Rename ${chalk.yellow(
      `${outerFolder}/docs-examples-from-docusaurus`
    )} to ${chalk.yellow(
      `${outerFolder}/docs`
    )} to see the example docs on your site.\n`
  );
}

if (blogCreated) {
  console.log(
    `Rename ${chalk.yellow(
      `${outerFolder}/website/blog-examples-from-docusaurus`
    )} to ${chalk.yellow(
      `${outerFolder}/website/blog`
    )} to see the example blog posts on your site.\n`
  );
}
