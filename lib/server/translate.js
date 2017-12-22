/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const translation = require('./translation.js');
const chalk = require('chalk');

let language = undefined;
  
const env = require('./env.js');

/* handle escaped characters that get converted into json strings */
function parseEscapeSequences(str) {
  return str
    .replace(new RegExp('\\\\n', 'g'), '\n')
    .replace(new RegExp('\\\\b', 'g'), '\b')
    .replace(new RegExp('\\\\f', 'g'), '\f')
    .replace(new RegExp('\\\\r', 'g'), '\r')
    .replace(new RegExp('\\\\t', 'g'), '\t')
    .replace(new RegExp("\\\\'", 'g'), "'")
    .replace(new RegExp('\\\\"', 'g'), '"')
    .replace(new RegExp('\\\\', 'g'), '\\');
}

const setLanguage = (lang) => {
  language = lang;
}

const translate = (str) => {

  let defaulted = language != undefined ? language : 'default';
  let found = undefined;

  // Fallback order. Eventually we can get rid of en.
  [defaulted, 'default', 'en'].forEach (language => {
    if (found != undefined) return; // No need to look anymore

    found = translation[language] && translation[language]['pages-strings'] && translation[language]['pages-strings'][str];

    if (found != undefined) {
      if (language != defaulted && defaulted != 'en') { // We only warn when falling back from a non-english language 
        // Because this module is recreated every page load, it is impossible to cache this without using a global variable. Spam is inevitable
        console.error(chalk.red(`Translation strings are missing in '${defaulted}' for string ${str} Using '${language}' instead.`));
      }
      found = parseEscapeSequences(found);
    }
  });

  if (found) return found;
  
  throw new Error(
  `Text that you've identified for translation '${str}' hasn't been added to the global list in 'default.json'. 
  To solve this problem run 'yarn write-translations'.`);
}

module.exports = {
  setLanguage: setLanguage,
  translate: translate,
};
