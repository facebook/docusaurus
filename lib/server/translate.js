/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

const translation = require("./translation.js");

let language = "en";

function setLanguage(lang) {
  language = lang;
}

function translate(str) {
  return translation[language]["pages-strings"][str];
}

module.exports = {
  setLanguage: setLanguage,
  translate: translate
};
