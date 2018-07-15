/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const CWD = process.cwd();
const siteConfig = require(`${CWD}/siteConfig.js`);
const {join} = require('path');
const fs = require('fs-extra');
const React = require('react');
const env = require('./env.js');
const readMetadata = require('./readMetadata.js');
const metadataUtils = require('./metadataUtils');
const DocsLayout = require('../core/DocsLayout.js');
const {insertTOC} = require('../core/toc');
const {getPath} = require('../core/utils');

function getRawContent(metadata) {
  if (!metadata) {
    return null;
  }
  let file;
  if (env.versioning.enabled && metadata.original_id) {
    if (env.translation.enabled && metadata.language !== 'en') {
      file = join(CWD, 'translated_docs', metadata.language, metadata.source);
    } else {
      file = join(CWD, 'versioned_docs', metadata.source);
    }
  } else if (env.translation.enabled && metadata.language !== 'en') {
    file = join(CWD, 'translated_docs', metadata.language, metadata.source);
  } else {
    file = join(CWD, '..', readMetadata.getDocsPath(), metadata.source);
  }
  if (!fs.existsSync(file)) {
    return null;
  }
  return metadataUtils.extractMetadata(fs.readFileSync(file, 'utf8'))
    .rawContent;
}

function getComponent(rawContent, metadata, mdToHtml) {
  // generate table of contents
  let content = insertTOC(rawContent);
  // replace any links to markdown files to their website html links
  Object.keys(mdToHtml).forEach(key => {
    let link = mdToHtml[key];
    link = getPath(link, siteConfig.cleanUrl);
    link = link.replace('/en/', `/${metadata.language}/`);
    link = link.replace(
      '/VERSION/',
      metadata.version && metadata.version !== env.versioning.defaultVersion
        ? `/${metadata.version}/`
        : '/'
    );
    // replace relative links with & without "./"
    content = content.replace(
      new RegExp(`\\]\\((${key}|\\./${key})`, 'g'),
      `](${link}`
    );
  });

  // replace any relative links to static assets to absolute links
  content = content.replace(
    /\]\(assets\//g,
    `](${siteConfig.baseUrl}docs/assets/`
  );

  return (
    <DocsLayout
      metadata={metadata}
      language={metadata.language}
      config={siteConfig}>
      {content}
    </DocsLayout>
  );
}

module.exports = {
  getRawContent,
  getComponent,
};
