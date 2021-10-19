#!/usr/bin/env node

/**
 * Copyright (c) Facebook, Inc. and its affiliates.
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

const toHex = (color) => {
  const hex = color.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

const colorScheme = () => {
  let primaryColor = '#';
  let secondaryColor = '#';
  for (let i = 0; i < 3; i++) {
    // 175 is our ceiling to prevent the color from being too bright
    const color = Math.floor(Math.random() * 176);
    const darkColor = Math.floor(color * 0.7);
    primaryColor += toHex(color);
    secondaryColor += toHex(darkColor);
  }
  return {primaryColor, secondaryColor};
};

let feature;

commander
  .arguments('[feature]')
  .action((feat) => {
    feature = feat;
  })
  .parse(process.argv);

// add scripts to package.json file
if (fs.existsSync(`${CWD}/package.json`)) {
  const packageContent = JSON.parse(
    fs.readFileSync(`${CWD}/package.json`, 'utf8'),
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
    `${JSON.stringify(packageContent, null, 2)}\n`,
  );
  console.log(
    `${chalk.green('Wrote docusaurus scripts to package.json file.')}\n`,
  );
}

const outerFolder = path.basename(path.dirname(CWD));

let docsCreatedInIntendedDirectory = true;

// handles cases where feature is "translations", "versions" or neither/not present
if (feature === 'translations') {
  // copy files for translations
  const folder = path.join(__dirname, '..', 'examples', 'translations');
  if (fs.existsSync(`${CWD}/../crowdin.yaml`)) {
    console.log(
      `${chalk.yellow('crowdin.yaml already exists')} in ${chalk.yellow(
        `${outerFolder}/`,
      )}. Rename or remove the file to regenerate an example version.\n`,
    );
  } else {
    fs.copySync(`${folder}/crowdin.yaml`, `${CWD}/../crowdin.yaml`);
  }
  const files = glob.sync(`${folder}/**/*`);
  files.forEach((file) => {
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
    } catch (e) {
      console.log(
        `${chalk.yellow(
          `${path.basename(filePath)} already exists`,
        )} in ${chalk.yellow(
          `website${filePath.split(path.basename(filePath))[0]}`,
        )}. Rename or remove the file to regenerate an example version.\n`,
      );
    }
  });
} else if (feature === 'versions') {
  // copy files for versions
  const folder = path.join(__dirname, '..', 'examples', 'versions');
  const files = glob.sync(`${folder}/**/*`);
  files.forEach((file) => {
    if (fs.lstatSync(file).isDirectory()) {
      return;
    }
    const filePath = path.resolve(file).split(path.resolve(folder))[1];
    try {
      fs.copySync(file, CWD + filePath, {
        overwrite: false,
        errorOnExist: true,
      });
    } catch (e) {
      console.log(
        `${chalk.yellow(
          `${path.basename(filePath)} already exists`,
        )} in ${chalk.yellow(
          `website${filePath.split(path.basename(filePath))[0]}`,
        )}. Rename or remove the file to regenerate an example version.\n`,
      );
    }
  });
} else {
  const folder = path.join(__dirname, '..', 'examples', 'basics');
  // copy docs examples
  let targetDocsDir = `${CWD}/../docs`;
  if (fs.existsSync(targetDocsDir)) {
    console.log(
      `- ${chalk.green('docs')} already exists in ${chalk.blue(
        outerFolder,
      )}. Copying into ${CWD}/../docs-examples-from-docusaurus instead.`,
    );
    targetDocsDir = `${CWD}/../docs-examples-from-docusaurus`;
    docsCreatedInIntendedDirectory = false;
  }

  fs.copySync(`${folder}/docs`, targetDocsDir);

  // copy blog examples
  if (fs.existsSync(`${CWD}/blog`)) {
    console.log(
      `- ${chalk.green('blog')} already exists in ${chalk.blue(
        `${outerFolder}/website`,
      )}.`,
    );
  } else {
    fs.copySync(path.join(folder, 'blog'), path.join(CWD, 'blog'));
  }

  const copyFileToProjectFolder = (fileNameFrom, fileNameTo) => {
    const copiedFileName = fileNameTo || fileNameFrom;
    const src = path.join(folder, fileNameFrom);
    const dest = path.join(CWD, '..', copiedFileName);
    if (fs.existsSync(dest)) {
      console.log(
        `- ${chalk.green(copiedFileName)} already exists in ${chalk.blue(
          outerFolder,
        )}.`,
      );
    } else {
      fs.copySync(src, dest);
    }
  };

  // copy .gitignore file
  copyFileToProjectFolder('gitignore', '.gitignore');

  // copy Dockerfile file
  copyFileToProjectFolder('Dockerfile');

  // copy docker-compose.yml file
  copyFileToProjectFolder('docker-compose.yml');

  // copy .dockerignore file
  copyFileToProjectFolder('dockerignore', '.dockerignore');

  // copy other files
  const files = glob.sync(`${folder}/**/*`);
  const {primaryColor, secondaryColor} = colorScheme();
  files.forEach((file) => {
    if (fs.lstatSync(file).isDirectory()) {
      return;
    }
    const containingFolder = path.basename(path.dirname(file));
    if (
      path.basename(file) === 'gitignore' ||
      path.basename(file) === 'Dockerfile' ||
      path.basename(file) === 'docker-compose.yml' ||
      path.basename(file) === 'dockerignore' ||
      containingFolder === 'blog' ||
      containingFolder === 'docs'
    ) {
      return;
    }
    const filePath = path.resolve(file).split(path.resolve(folder))[1];
    if (
      path.basename(file) === 'siteConfig.js' &&
      !fs.existsSync(CWD + filePath)
    ) {
      const siteConfig = fs
        .readFileSync(file, 'utf8')
        .replace('{{primaryColor}}', primaryColor)
        .replace('{{secondaryColor}}', secondaryColor);
      fs.writeFileSync(CWD + filePath, siteConfig);
    } else {
      try {
        fs.copySync(file, CWD + filePath, {
          overwrite: false,
          errorOnExist: true,
        });
      } catch (e) {
        console.log(
          `- ${chalk.green(
            `${path.basename(filePath)}`,
          )} already exists in ${chalk.blue(
            `${outerFolder}/website${
              filePath.split(path.basename(filePath))[0]
            }`,
          )}.`,
        );
      }
    }
  });

  const svgs = glob.sync(`${CWD}/static/img/**/*.svg`);
  svgs.forEach((file) => {
    // Replace primary colors of SVGs.
    const newImage = fs
      .readFileSync(file, 'utf8')
      .replace(/{{primaryColor}}/g, primaryColor);
    fs.writeFileSync(file, newImage);
  });

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

if (!docsCreatedInIntendedDirectory) {
  console.log(
    `The ${chalk.yellow(
      `${outerFolder}/docs`,
    )} directory was not created because it already exists. ` +
      `Please manually convert the contents into a Docusaurus-compatible format ` +
      `by referring to the examples from ${chalk.yellow(
        `${outerFolder}/docs-examples-from-docusaurus`,
      )}.\n`,
  );
}
