/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// translation object contains all translations for each string in i18n/en.json

const CWD = process.cwd();
const fs = require('fs');
const glob = require('glob');
const path = require('path');

let languages;
if (fs.existsSync(`${CWD}/languages.js`)) {
  languages = require(`${CWD}/languages.js`);
} else {
  languages = [
    {
      enabled: true,
      name: 'English',
      tag: 'en',
    },
  ];
}

const enabledLanguages = languages.filter(lang => lang.enabled);

const translation = {languages: enabledLanguages};

const files = glob.sync(`${CWD}/i18n/**`);
const langRegex = /\/i18n\/(.*)\.json$/;

files.forEach(file => {
  const extension = path.extname(file);
  if (extension === '.json') {
    const match = langRegex.exec(file);
    const language = match[1];
    translation[language] = require(file);
  }
});

module.exports = translation;
