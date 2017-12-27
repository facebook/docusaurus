/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Imports
const CWD = process.cwd();
const path = require('path');
const join = path.join;
const render = require('../render');
const siteConfig = require(CWD + '/siteConfig');
const readMetadata = require('../readMetadata.js');
const { copyFile, writeData, readFile, checkFile } = require('./common');
const glob = require('glob');
const env = require('../env.js');

// Local constants
const duplicateContent = true; // We can make it redirect, but then translations have super confusing behavour
const buildDir = join(CWD, 'build', siteConfig.projectName);
const possibleLanguages = env.translation.enabledLanguageTags();
possibleLanguages[possibleLanguages.length] = undefined; // Add undefined

const getLanguagePart = (file) => {
  let split = path.dirname(file);

  // See if it matches any of the available langauges;
  let matches = possibleLanguages.filter(lang => lang == split);
  return split.length > 1 && matches.length > 0 ? matches[0] : undefined;
} 

const createPage = (target, source, language, overwrite = true) => {
  let isJs = path.extname(source) == ".js";
  let isHtml = path.extname(source) == ".html";

  // Don't overwrite
  if (!overwrite && checkFile(target))
  {
    return;
  }

  // HTML (copy paste)
  if (isHtml && siteConfig.wrapPagesHTML) {
    const rawHtml = render.page.renderPageHtml(source, language);
    writeData(target, rawHtml);
    return;
  }
  
  // JS (React)
  if (isJs) {
    const rawHtml = render.page.renderPageJs(source, language)
    writeData(target, rawHtml);
    return;
  }

  // HTML files that aren't being wrapped just get copied. 
  if (!siteConfig.wrapPagesHTML) {
    copyFile(original, target);
  }
}

const buildPages = () => {
  console.log("Creating pages...")

  let websitePages = join(CWD, 'pages', '**');
  let files = glob.sync(websitePages, { nodir: true });

  files.forEach(original => {
    const language = getLanguagePart(original);
    let filename = path.basename(original, path.extname(original)) + '.html';

    possibleLanguages.every((langTag) => {
    
      let langFolder = langTag ? langTag : '';
      let langFolderExcluded = join(buildDir, filename);
      let langFolderIncluded = join(buildDir, langFolder, filename);
      
      let isOriginal = language === langTag; // We always force correct language versions.

      createPage(langFolderIncluded, original, langTag, isOriginal); 

      // Current behavour is to default sites to English.
      // We create another page based on the English translation
      if (langTag == 'en') {
        createPage(langFolderExcluded, original, undefined, false);
      }
    });
  });
}

module.exports = buildPages;