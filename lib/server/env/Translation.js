/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const CWD = process.cwd();
const path = require('path');
const glob = require('glob');
const fs = require('fs-extra');
const escapeStringRegexp = require('escape-string-regexp');
const {idx} = require('../../core/utils.js');

const languagesFile = path.join(CWD, 'languages.js');
const DEFAULT_LANG = 'en';

class Translation {
  enabled = false;

  languages = [
    {
      enabled: true,
      name: 'English',
      tag: DEFAULT_LANG,
    },
  ];

  language = DEFAULT_LANG;

  setLanguage(language) {
    this.language = language;
  }

  getLanguage() {
    return this.language;
  }

  /**
   * Translates string by its key
   *
   * @param {string|Array<string>} key
   * @param {'default' | 'pages'} [category='default']
   * @param {Object} options
   * @param {string} options.language
   *
   * @return {string} - translation or key
   */
  t(key, category = 'default', options = {}) {
    const language = options.language || this.getLanguage();

    const categoryMap = {
      default: 'localized-strings',
      pages: 'pages-strings',
    };

    if (!categoryMap[category]) {
      throw new Error(`Unknown category name: ${category}`);
    }

    const message = idx(
      this.translations,
      [language, categoryMap[category]].concat(key)
    );

    if (message) {
      if (category === 'pages' && options.fallbackFrom) {
        console.error(
          `Could not find a string translation in '${
            options.fallbackFrom
          }' for string '${key}'. Using English version instead.`
        );
      }

      return this.parseEscapeSequences(message);
    }

    if (options.fallbackFrom) {
      if (category === 'pages') {
        // for pages we have more strict rules
        throw new Error(
          `Text that you've identified for translation ('${key}') hasn't been added to the global list in 'en.json'. To solve this problem run 'yarn write-translations'.`
        );
      }
    } else {
      return this.t(key, category, {
        language: DEFAULT_LANG,
        fallbackFrom: language,
      });
    }

    return null;
  }

  enabledLanguages = () => this.languages.filter(lang => lang.enabled);

  /**
   * Parse locale from doc file path
   *
   * @param  {string} file
   * @param  {string} refDir
   *
   * @return {?string}
   */
  getFileLanguage(file, refDir) {
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

    this.loadTranslations();
  }

  loadTranslations() {
    const translations = {languages: this.enabledLanguages()};

    const files = glob.sync(`${CWD}/i18n/**`);
    const langRegex = /\/i18n\/(.*)\.json$/;
    let wasWarned = false;

    files.forEach(file => {
      const extension = path.extname(file);

      if (extension === '.json') {
        const match = langRegex.exec(file);
        const language = match[1];

        translations[language] = require(file);

        if (!Object.hasOwnProperty.call(this, language)) {
          Object.defineProperty(this, language, {
            get() {
              if (!wasWarned) {
                wasWarned = true;

                console.error(
                  "translation[language][category][key] api is deprecated. Please use translation.t(key, category = 'default')"
                );
              }

              return translations[language];
            },
            set() {
              // noop
            },
          });
        }
      }
    });

    this.translations = translations;
  }

  /* handle escaped characters that get converted into json strings */
  parseEscapeSequences(str) {
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
}

module.exports = Translation;
