/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const CWD = process.cwd();
const path = require('path');
const fs = require('fs-extra');
const escapeStringRegexp = require('escape-string-regexp');

const languagesFile = path.join(CWD, 'languages.js');

class Translation {
  constructor() {
    this.enabled = false;
    this.languages = [
      {
        enabled: true,
        name: 'English',
        tag: 'en',
      },
    ];
  }

  enabledLanguages = () => this.languages.filter(lang => lang.enabled);

  getLanguage(file, refDir) {
    const separator = escapeStringRegexp(path.sep);
    const baseDir = escapeStringRegexp(path.basename(refDir));
    const regexSubFolder = new RegExp(
      `${baseDir}${separator}(.*?)${separator}.*`
    );
    const match = regexSubFolder.exec(file);

    // Avoid misinterpreting subdirectory as language
    if (match && this.enabled) {
      const enabledLanguages = this.enabledLanguages().map(
        language => language.tag
      );
      if (enabledLanguages.indexOf(match[1]) !== -1) {
        return match[1];
      }
    }

    return null;
  }

  load() {
    if (fs.existsSync(languagesFile)) {
      this.enabled = true;
      this.languages = require(languagesFile);
    }
  }
}

module.exports = Translation;
