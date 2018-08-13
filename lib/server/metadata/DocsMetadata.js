/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const utils = require('../utils.js');
const metadataUtils = require('../metadataUtils.js');
const createDocsIndex = require('./createDocsIndex');

const SupportedHeaderFields = new Set([
  'id',
  'title',
  'author',
  'authorURL',
  'authorFBID',
  'sidebar_label',
  'original_id',
  'hide_title',
  'layout',
  'custom_edit_url',
]);

class DocsMetadata {
  /**
   * @param {string} docsDir
   * @param {string} translatedDir
   * @param {Object} versionFallback
   * @param {Object} sidebars - sidebars.json file contents
   * @param {Translation} translation
   * @param {Versioning} versioning
   * @param {boolean} [useEnglishUrl=false]
   */
  constructor({
    docsDir,
    translatedDir,
    versionFallback,
    sidebars,
    translation,
    versioning,
    useEnglishUrl = false,
  }) {
    this.docsDir = docsDir;
    this.translatedDir = translatedDir;
    this.versionFallback = versionFallback;
    this.sidebars = sidebars;
    this.translation = translation;
    this.versioning = versioning;
    this.useEnglishUrl = useEnglishUrl;

    this.sidebarIndex = this.readSidebar();
  }

  populate() {
    const docsDir = this.docsDir;
    const translatedDir = this.translatedDir;
    const versionFallback = this.versionFallback;
    const sidebarIndex = this.sidebarIndex;
    const translation = this.translation;

    const metadatas = {};
    const defaultMetadatas = {};
    const enabledLanguages = translation
      .enabledLanguages()
      .map(language => language.tag);

    // metadata for english files
    let files = glob.sync(path.join(docsDir, '**'));

    files.forEach(file => {
      const extension = path.extname(file);

      if (extension === '.md' || extension === '.markdown') {
        const res = this.processMetadata(file, docsDir);

        const metadata = res.metadata;
        metadatas[metadata.id] = metadata;

        // create a default list of documents for each enabled language based on docs in English
        // these will get replaced if/when the localized file is downloaded from crowdin
        enabledLanguages
          .filter(currentLanguage => currentLanguage !== 'en')
          .forEach(currentLanguage => {
            const baseMetadata = Object.assign({}, metadata);
            baseMetadata.id = baseMetadata.id
              .toString()
              .replace(/^en-/, `${currentLanguage}-`);

            baseMetadata.permalink = baseMetadata.permalink
              .toString()
              .replace(/^docs\/en\//, `docs/${currentLanguage}/`);

            if (baseMetadata.next) {
              baseMetadata.next = baseMetadata.next
                .toString()
                .replace(/^en-/, `${currentLanguage}-`);
            }

            if (baseMetadata.previous) {
              baseMetadata.previous = baseMetadata.previous
                .toString()
                .replace(/^en-/, `${currentLanguage}-`);
            }

            baseMetadata.language = currentLanguage;
            defaultMetadatas[baseMetadata.id] = baseMetadata;
          });

        Object.assign(metadatas, defaultMetadatas);
      }
    });

    // metadata for non-english docs
    files = glob.sync(path.join(translatedDir, '**'));

    files.forEach(file => {
      if (!translation.getLanguage(file, translatedDir)) {
        return;
      }

      const extension = path.extname(file);

      if (extension === '.md' || extension === '.markdown') {
        const {metadata} = this.processMetadata(file, translatedDir);

        metadatas[metadata.id] = metadata;
      }
    });

    // metadata for versioned docs
    const versionData = versionFallback.docData();
    versionData.forEach(metadata => {
      const id = metadata.localized_id;

      if (sidebarIndex[id]) {
        Object.assign(
          metadata,
          this.resolveSidebarMetadata(metadata, sidebarIndex[id])
        );
      }

      metadatas[metadata.id] = metadata;
    });

    // Get the titles of the previous and next ids so that we can use them in
    // navigation buttons in DocsLayout.js
    Object.keys(metadatas).forEach(docId => {
      const defaultTitles = {
        next: 'Next',
        previous: 'Previous',
      };

      ['next', 'previous'].forEach(key => {
        const siblingId = metadatas[docId][key];

        metadatas[docId][`${key}_title`] =
          (metadatas[siblingId] || {}).title || defaultTitles[siblingId];
      });
    });

    return metadatas;
  }

  /**
   * @return {Object} - map from id to object containing sidebar ordering info
   */
  readSidebar() {
    return createDocsIndex({
      ...this.sidebars,
      ...this.versionFallback.sidebarData(),
    });
  }

  processMetadata(file, refDir) {
    const translation = this.translation;
    const versioning = this.versioning;
    const useEnglishUrl = this.useEnglishUrl;
    const sidebarIndex = this.sidebarIndex;

    const result = metadataUtils.extractMetadata(fs.readFileSync(file, 'utf8'));
    const language = translation.getLanguage(file, refDir) || 'en';

    const metadata = {};
    Object.keys(result.metadata).forEach(fieldName => {
      if (SupportedHeaderFields.has(fieldName)) {
        metadata[fieldName] = result.metadata[fieldName];
      } else {
        console.warn(
          `Header field "${fieldName}" in ${file} is not supported.`
        );
      }
    });

    const rawContent = result.rawContent;

    if (!metadata.id) {
      metadata.id = path.basename(file, path.extname(file));
    }

    if (metadata.id.includes('/')) {
      throw new Error('Document id cannot include "/".');
    }

    // If a file is located in a subdirectory, prepend the subdir to it's ID
    // Example:
    //  (file: 'docusaurus/docs/projectA/test.md', ID 'test', refDir: 'docusaurus/docs')
    //  returns 'projectA/test'
    const subDir = utils.getSubDir(file, refDir);
    if (subDir) {
      metadata.id = `${subDir}/${metadata.id}`;
    }

    // Example: `docs/projectA/test.md` source is `projectA/test.md`
    metadata.source = subDir
      ? `${subDir}/${path.basename(file)}`
      : path.basename(file);

    if (!metadata.title) {
      metadata.title = metadata.id;
    }

    const langPart = translation.enabled || useEnglishUrl ? `${language}/` : '';
    let versionPart = '';

    if (versioning.enabled) {
      metadata.version = 'next';
      versionPart = 'next/';
    }

    metadata.permalink = `docs/${langPart}${versionPart}${metadata.id}.html`;

    // change ids previous, next
    metadata.localized_id = metadata.id;
    metadata.id = (translation.enabled ? `${language}-` : '') + metadata.id;
    metadata.language = translation.enabled ? language : 'en';

    const id = metadata.localized_id;

    if (sidebarIndex[id]) {
      Object.assign(
        metadata,
        this.resolveSidebarMetadata(metadata, sidebarIndex[id])
      );
    }

    return {metadata, rawContent};
  }

  /**
   * Populates metadata with info about previous and next docs,
   * including sidebar id and category name for current doc
   *
   * @param {Object} metadata - doc metadata
   * @param {Object} sidebarIndex - sidebar index data received from createDocsIndex
   * @param {Object} options
   * @param {Translation} options.translation
   *
   * @return {Object}
   * {
   *   sidebar: string,
   *   category: string,
   *   next?: string,
   *   next_id?: string,
   *   previous?: string,
   *   previous_id?: string
   * }
   */
  resolveSidebarMetadata(metadata, sidebarIndex) {
    const {translation} = this;

    const sidebarData = {};
    sidebarData.sidebar = sidebarIndex.sidebar;
    sidebarData.category = sidebarIndex.category;

    ['next', 'previous'].forEach(key => {
      if (sidebarIndex[key]) {
        sidebarData[`${key}_id`] = sidebarIndex[key].replace(
          `version-${metadata.version}-`,
          ''
        );
        sidebarData[key] =
          (translation.enabled ? `${metadata.language}-` : '') +
          sidebarIndex[key];
      }
    });

    return sidebarData;
  }
}

module.exports = DocsMetadata;
