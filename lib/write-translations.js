#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* generate the i18n/en.json file */

require('babel-register')({
  babelrc: false,
  plugins: [
    require('./server/translate-plugin.js'),
    'transform-class-properties',
    'transform-object-rest-spread',
  ],
  presets: ['react', 'env'],
});

const traverse = require('babel-traverse').default;
const babylon = require('babylon');
const fs = require('fs-extra');
const glob = require('glob');
const mkdirp = require('mkdirp');
const nodePath = require('path');

const readMetadata = require('./server/readMetadata.js');

const CWD = process.cwd();
const siteConfig = require(CWD + '/siteConfig.js');
const sidebars = require(CWD + '/sidebars.json');

let customTranslations = {
  'localized-strings': {},
  'pages-strings': {},
};
if (fs.existsSync(CWD + '/data/custom-translation-strings.json')) {
  customTranslations = JSON.parse(
    fs.readFileSync(CWD + '/data/custom-translation-strings.json', 'utf8')
  );
}

function writeFileAndCreateFolder(file, content) {
  mkdirp.sync(file.replace(new RegExp('/[^/]*$'), ''));
  fs.writeFileSync(file, content);
}

function execute() {
  const translations = {
    'localized-strings': {
      next: 'Next',
      previous: 'Previous',
      tagline: siteConfig.tagline,
    },
    'pages-strings': {},
  };

  // look through markdown headers of docs for titles and categories to translate
  const docsDir = nodePath.join(CWD, '../', readMetadata.getDocsPath());
  let files = glob.sync(CWD + '/../' + readMetadata.getDocsPath() + '/**');
  files.forEach(file => {
    const extension = nodePath.extname(file);
    if (extension === '.md' || extension === '.markdown') {
      let res;
      try {
        res = readMetadata.processMetadata(file, docsDir);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
      if (!res) {
        return;
      }
      const metadata = res.metadata;

      translations['localized-strings'][metadata.localized_id] = metadata.title;

      if (metadata.sidebar_label) {
        translations['localized-strings'][metadata.sidebar_label] =
          metadata.sidebar_label;
      }
    }
  });
  // look through header links for text to translate
  siteConfig.headerLinks.forEach(link => {
    if (link.label) {
      translations['localized-strings'][link.label] = link.label;
    }
  });

  // find sidebar category titles to translate
  Object.keys(sidebars).forEach(sb => {
    const categories = sidebars[sb];
    Object.keys(categories).forEach(category => {
      translations['localized-strings'][category] = category;
    });
  });

  files = glob.sync(CWD + '/versioned_sidebars/*');
  files.forEach(file => {
    if (!file.endsWith('-sidebars.json')) {
      if (file.endsWith('-sidebar.json')) {
        console.warn(
          `Skipping ${file}. Make sure your sidebar filenames follow this format: 'version-VERSION-sidebars.json'.`
        );
      }
      return;
    }
    let sidebarContent;
    try {
      sidebarContent = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      console.error(`Could not parse ${file} into json. ${e}`);
      process.exit(1);
    }

    Object.keys(sidebarContent).forEach(sb => {
      const categories = sidebarContent[sb];
      Object.keys(categories).forEach(category => {
        translations['localized-strings'][category] = category;
      });
    });
  });

  // go through pages to look for text inside translate tags
  files = glob.sync(CWD + '/pages/en/**');
  files.forEach(file => {
    const extension = nodePath.extname(file);
    if (extension === '.js') {
      const ast = babylon.parse(fs.readFileSync(file, 'utf8'), {
        plugins: ['jsx'],
      });
      traverse(ast, {
        enter(path) {
          if (
            path.node.type === 'JSXElement' &&
            path.node.openingElement.name.name === 'translate'
          ) {
            const text = path.node.children[0].value
              .trim()
              .replace(/\s+/g, ' ');
            let description = 'no description given';
            const attributes = path.node.openingElement.attributes;
            for (let i = 0; i < attributes.length; i++) {
              if (attributes[i].name.name === 'desc') {
                description = attributes[i].value.value;
              }
            }
            translations['pages-strings'][text + '|' + description] = text;
          }
        },
      });
    }
  });

  // Manually add 'Help Translate' to en.json
  translations['pages-strings'][
    'Help Translate|recruit community translators for your project'
  ] =
    'Help Translate';
  translations['pages-strings'][
    'Edit this Doc|recruitment message asking to edit the doc source'
  ] =
    'Edit';
  translations['pages-strings'][
    'Translate this Doc|recruitment message asking to translate the docs'
  ] =
    'Translate';
  translations['pages-strings'] = Object.assign(
    translations['pages-strings'],
    customTranslations['pages-strings']
  );
  translations['localized-strings'] = Object.assign(
    translations['localized-strings'],
    customTranslations['localized-strings']
  );
  writeFileAndCreateFolder(
    CWD + '/i18n/en.json',
    JSON.stringify(
      Object.assign(
        {
          _comment: 'This file is auto-generated by write-translations.js',
        },
        translations
      ),
      null,
      2
    ) + '\n'
  );
}

execute();

module.exports = execute;
