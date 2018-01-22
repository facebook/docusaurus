/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const translation = require('./translation.js');

let language = 'en';

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

function setLanguage(lang) {
  language = lang;
}

function doesTranslationExist(str, lang) {
  return (
    translation[lang] &&
    translation[lang]['pages-strings'] &&
    translation[lang]['pages-strings'][str]
  );
}

function translate(str) {
  if (!language || language === '') {
    // Check English, just in case; otherwise, just return the raw string back
    if (doesTranslationExist(str, 'en')) {
      return parseEscapeSequences(translation['en']['pages-strings'][str]);
    }
    return str;
  }

  if (!doesTranslationExist(str, language)) {
    // if a translated string doesn't exist, but english does then fallback
    if (doesTranslationExist(str, 'en')) {
      console.error(
        "Could not find a string translation in '" +
          language +
          "' for string '" +
          str +
          "'. Using English version instead."
      );

      return parseEscapeSequences(translation['en']['pages-strings'][str]);
    }
    throw new Error(
      "Text that you've identified for translation ('" +
        str +
        "') hasn't been added to the global list in 'en.json'. To solve this problem run 'yarn write-translations'."
    );
  }
  return parseEscapeSequences(translation[language]['pages-strings'][str]);
}

module.exports = {
  setLanguage: setLanguage,
  translate: translate,
};
