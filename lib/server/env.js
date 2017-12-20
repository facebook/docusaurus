/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const fs = require('fs-extra');
const path = require('path');

const join = path.join;

const languages_js = join(CWD, 'languages.js');
const versions_json = join(CWD, 'versions.json');

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

    this._load();
  }

  enabledLanguages() {
    return this.languages.filter(lang => lang.enabled);
  }

  _load() {
    if (fs.existsSync(languages_js)) {
      this.enabled = true;
      this.languages = require(languages_js);
    }
  }
}

class Versioning {
  constructor() {
    this.enabled = false;
    this.latestVersion = null;
    this.versions = [];

    this._load();
  }

  _load() {
    if (fs.existsSync(versions_json)) {
      this.enabled = true;
      this.versions = JSON.parse(fs.readFileSync(versions_json, 'utf8'));
      this.latestVersion = this.versions[0];
    }
  }
}

const env = {
  translation: new Translation(),
  versioning: new Versioning(),
};

module.exports = env;
