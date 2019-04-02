/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const globby = require('globby');
const importFresh = require('import-fresh');
const path = require('path');
const {getSubFolder, idx, normalizeUrl} = require('@docusaurus/utils');

const createOrder = require('./order');
const loadSidebars = require('./sidebars');
const processMetadata = require('./metadata');

const DEFAULT_OPTIONS = {
  metadataKey: 'docsMetadata',
  metadataFileName: 'docsMetadata.json',
  path: 'docs', // Path to data on filesystem, relative to site dir.
  routeBasePath: 'docs', // URL Route.
  include: ['**/*.md', '**/*.mdx'], // Extensions to include.
  // TODO: Change format to array.
  sidebarPath: '', // Path to sidebar configuration for showing a list of markdown pages.
  // TODO: Settle themeing.
  docLayoutComponent: '@theme/Doc',
  docItemComponent: '@theme/DocBody',
};

class DocusaurusPluginContentDocs {
  constructor(opts, context) {
    this.options = {...DEFAULT_OPTIONS, ...opts};
    this.context = context;
    this.contentPath = path.resolve(this.context.siteDir, this.options.path);
  }

  getName() {
    return 'docusaurus-plugin-content-docs';
  }

  getPathsToWatch() {
    return [this.contentPath, this.options.sidebarPath];
  }

  // Fetches blog contents and returns metadata for the contents.
  async loadContent() {
    const {include, routeBasePath, sidebarPath} = this.options;
    const {siteDir, env, siteConfig, cliOptions = {}} = this.context;
    const {skipNextRelease} = cliOptions;
    const docsDir = this.contentPath;

    // We don't want sidebars to be cached because of hotreloading.
    const sidebar = importFresh(sidebarPath);
    const docsSidebars = loadSidebars({siteDir, env, sidebar});

    // @tested - build the docs ordering such as next, previous, category and sidebar
    const order = createOrder(docsSidebars);

    // Settle versions & translations from environment.
    const translationEnabled = idx(env, ['translation', 'enabled']);
    const enabledLanguages =
      translationEnabled && idx(env, ['translation', 'enabledLanguages']);
    const enabledLangTags =
      (enabledLanguages && enabledLanguages.map(lang => lang.tag)) || [];
    const defaultLangTag = idx(env, ['translation', 'defaultLanguage', 'tag']);
    const versioningEnabled = idx(env, ['versioning', 'enabled']);
    const versions =
      (versioningEnabled && idx(env, ['versioning', 'versions'])) || [];

    // Prepare metadata container.
    const docs = {};

    if (!(versioningEnabled && skipNextRelease)) {
      // Metadata for default docs files.
      const docsFiles = await globby(include, {
        cwd: docsDir,
      });
      await Promise.all(
        docsFiles.map(async source => {
          // Do not allow reserved version/ translated folder name in 'docs'
          // e.g: 'docs/version-1.0.0/' should not be allowed as it can cause unwanted bug
          const subFolder = getSubFolder(
            path.resolve(docsDir, source),
            docsDir,
          );
          const versionsFolders = versions.map(version => `version-${version}`);
          if ([...enabledLangTags, ...versionsFolders].includes(subFolder)) {
            throw new Error(
              `You cannot have a folder named 'docs/${subFolder}/'`,
            );
          }

          const metadata = await processMetadata(
            source,
            docsDir,
            env,
            order,
            siteConfig,
            routeBasePath,
          );
          docs[metadata.id] = metadata;
        }),
      );
    }

    // Metadata for non-default-language docs.
    if (translationEnabled) {
      const translatedDir = path.join(siteDir, 'translated_docs');
      const translatedFiles = await globby(include, {
        cwd: translatedDir,
      });
      await Promise.all(
        translatedFiles.map(async source => {
          /*
            Do not process disabled & default languages folder in `translated_docs`
            e.g: 'translated_docs/ja/**' should not be processed if lang 'ja' is disabled
          */
          const translatedFilePath = path.resolve(translatedDir, source);
          const detectedLangTag = getSubFolder(
            translatedFilePath,
            translatedDir,
          );
          if (
            detectedLangTag === defaultLangTag ||
            !enabledLangTags.includes(detectedLangTag)
          ) {
            return;
          }

          const metadata = await processMetadata(
            source,
            translatedDir,
            env,
            order,
            siteConfig,
            routeBasePath,
          );
          docs[metadata.id] = metadata;
        }),
      );
    }

    // Metadata for versioned docs.
    if (versioningEnabled) {
      const versionedDir = path.join(siteDir, 'versioned_docs');
      const versionedFiles = await globby(include, {
        cwd: versionedDir,
      });
      await Promise.all(
        versionedFiles.map(async source => {
          const metadata = await processMetadata(
            source,
            versionedDir,
            env,
            order,
            siteConfig,
            routeBasePath,
          );
          docs[metadata.id] = metadata;
        }),
      );
    }

    // Get the titles of the previous and next ids so that we can use them.
    Object.keys(docs).forEach(currentID => {
      const previousID = idx(docs, [currentID, 'previous']);
      if (previousID) {
        const previousTitle = idx(docs, [previousID, 'title']);
        docs[currentID].previous_title = previousTitle || 'Previous';
      }
      const nextID = idx(docs, [currentID, 'next']);
      if (nextID) {
        const nextTitle = idx(docs, [nextID, 'title']);
        docs[currentID].next_title = nextTitle || 'Next';
      }
    });

    // Create source to metadata mapping.
    const sourceToMetadata = {};
    Object.values(docs).forEach(({source, version, permalink, language}) => {
      sourceToMetadata[source] = {
        version,
        permalink,
        language,
      };
    });

    return {
      docs,
      docsDir,
      docsSidebars,
      sourceToMetadata,
    };
  }

  async contentLoaded({content, actions}) {
    const {docLayoutComponent, docItemComponent, routeBasePath} = this.options;
    const {addRoute} = actions;

    addRoute({
      path: normalizeUrl([this.context.siteConfig.baseUrl, routeBasePath]),
      component: docLayoutComponent,
      routes: Object.values(content.docs).map(metadataItem => ({
        path: metadataItem.permalink,
        component: docItemComponent,
        metadata: metadataItem,
        modules: [metadataItem.source],
      })),
    });
  }
}

module.exports = DocusaurusPluginContentDocs;
