/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const siteConfig = require(`${CWD}/siteConfig.js`);

const join = path.join;

const languagesFile = join(CWD, 'languages.js');
const versionsJSONFile = join(CWD, 'versions.json');
const versionsFile = join(CWD, 'pages/en/versions.js');

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

    this.load();
  }

  enabledLanguages = () => this.languages.filter(lang => lang.enabled);

  load() {
    if (fs.existsSync(languagesFile)) {
      this.enabled = true;
      this.languages = require(languagesFile);
    }
  }
}

class Versioning {
  constructor() {
    this.enabled = false;
    this.defaultVersion = null;
    this.versions = [];
    this.missingVersionsPage = false;

    this.load();
  }

  printMissingVersionsPageError() {
    console.error(
      `${chalk.yellow('No versions.js file found!')}` +
        `\nYou should create your versions.js file in pages/en directory.` +
        `\nPlease refer to https://docusaurus.io/docs/en/versioning.html.`
    );
  }

  load() {
    if (fs.existsSync(versionsJSONFile)) {
      this.enabled = true;
      this.versions = JSON.parse(fs.readFileSync(versionsJSONFile, 'utf8'));
      this.defaultVersion = siteConfig.defaultVersionShown
        ? siteConfig.defaultVersionShown
        : this.versions[0]; // otherwise show the latest version (other than next/master)
    }

    if (!fs.existsSync(versionsFile)) {
      this.missingVersionsPage = true;
    }
  }
}

const env = {
  translation: new Translation(),
  versioning: new Versioning(),
};

module.exports = env;
