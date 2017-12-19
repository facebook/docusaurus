/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const translation = require('./translation.js');

let language = undefined;

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

function translate(str) {
  var defaulted = language != undefined ? language : "default";

  if (
    !translation[defaulted] ||
    !translation[defaulted]['pages-strings'] ||
    !translation[defaulted]['pages-strings'][str]
  ) {
    // if a translated string doesn't exist, but english does then fallback
    if (
      translation['default'] &&
      translation['default']['pages-strings'] &&
      translation['default']['pages-strings'][str]
    ) {
      console.error(
        "Could not find a string translation in '" +
          defaulted +
          "' for string '" +
          str +
          "'. Using Generic version instead."
      );

      return parseEscapeSequences(translation['en']['pages-strings'][str]);
    }
    throw new Error(
      "Text that you've identified for translation ('" +
        str +
        "') hasn't been added to the global list in 'en.json'. To solve this problem run 'yarn write-translations'."
    );
  }
  return parseEscapeSequences(translation[defaulted]['pages-strings'][str]);
}

module.exports = {
  setLanguage: setLanguage,
  translate: translate,
};
