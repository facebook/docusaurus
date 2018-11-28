/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const CWD = process.cwd();
const {join} = require('path');
const fs = require('fs-extra');
const React = require('react');
const loadConfig = require('./config');

const siteConfig = loadConfig(`${CWD}/siteConfig.js`);
const env = require('./env.js');
const {renderToStaticMarkupWithDoctype} = require('./renderUtils');
const readMetadata = require('./readMetadata.js');
const {insertTOC} = require('../core/toc.js');
const {getPath} = require('../core/utils.js');

const docsPart = `${siteConfig.docsUrl ? `${siteConfig.docsUrl}/` : ''}`;

function getFilePath(metadata) {
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
  return file;
}

function getFile(metadata) {
  if (!metadata) {
    return null;
  }
  const file = getFilePath(metadata);
  if (!fs.existsSync(file)) {
    return null;
  }
  return fs.readFileSync(file, 'utf8');
}

function mdToHtmlify(oldContent, mdToHtml, metadata) {
  let content = oldContent;
  const mdLinks = [];
  const mdReferences = [];
  const mdBrokenLinks = [];

  // find any inline-style links to markdown files
  const linkRegex = /(?:\]\()(?:\.\/)?([^'")\]\s>]+\.md)/g;
  let linkMatch = linkRegex.exec(content);
  while (linkMatch !== null) {
    mdLinks.push(linkMatch[1]);
    linkMatch = linkRegex.exec(content);
  }
  // find any reference-style links to markdown files
  const refRegex = /(?:\]:)(?:\s)?(?:\.\/|\.\.\/)?([^'")\]\s>]+\.md)/g;
  let refMatch = refRegex.exec(content);
  while (refMatch !== null) {
    mdReferences.push(refMatch[1]);
    refMatch = refRegex.exec(content);
  }

  // replace markdown links to their website html links
  new Set(mdLinks).forEach(mdLink => {
    let htmlLink = mdToHtml[mdLink];
    if (htmlLink) {
      htmlLink = getPath(htmlLink, siteConfig.cleanUrl);
      htmlLink = htmlLink.replace('/en/', `/${metadata.language}/`);
      htmlLink = htmlLink.replace(
        '/VERSION/',
        metadata.version && metadata.version !== env.versioning.latestVersion
          ? `/${metadata.version}/`
          : '/',
      );
      content = content.replace(
        new RegExp(`\\]\\((\\./)?${mdLink}`, 'g'),
        `](${htmlLink}`,
      );
    } else {
      mdBrokenLinks.push(mdLink);
    }
  });

  // replace markdown refernces to their website html links
  new Set(mdReferences).forEach(refLink => {
    let htmlLink = mdToHtml[refLink];
    if (htmlLink) {
      htmlLink = getPath(htmlLink, siteConfig.cleanUrl);
      htmlLink = htmlLink.replace('/en/', `/${metadata.language}/`);
      htmlLink = htmlLink.replace(
        '/VERSION/',
        metadata.version && metadata.version !== env.versioning.latestVersion
          ? `/${metadata.version}/`
          : '/',
      );
      content = content.replace(
        new RegExp(`\\]:(?:\\s)?(\\./|\\.\\./)?${refLink}`, 'g'),
        `]: ${htmlLink}`,
      );
    } else {
      mdBrokenLinks.push(refLink);
    }
  });

  if (mdBrokenLinks.length) {
    console.log(
      `[WARN] unresolved links in file '${metadata.source}' >`,
      mdBrokenLinks,
    );
  }
  return content;
}

function replaceAssetsLink(oldContent) {
  let fencedBlock = false;
  const lines = oldContent.split('\n').map(line => {
    if (line.trim().startsWith('```')) {
      fencedBlock = !fencedBlock;
    }
    return fencedBlock
      ? line
      : line.replace(
          /\]\(assets\//g,
          `](${siteConfig.baseUrl}${docsPart}assets/`,
        );
  });
  return lines.join('\n');
}

function getMarkup(rawContent, mdToHtml, metadata) {
  // generate table of contents
  let content = insertTOC(rawContent);

  // replace any links to markdown files to their website html links
  content = mdToHtmlify(content, mdToHtml, metadata);

  // replace any relative links to static assets (not in fenced code blocks) to absolute links
  content = replaceAssetsLink(content);

  const DocsLayout = require('../core/DocsLayout.js');
  return renderToStaticMarkupWithDoctype(
    <DocsLayout
      metadata={metadata}
      language={metadata.language}
      config={siteConfig}>
      {content}
    </DocsLayout>,
  );
}

function getRedirectMarkup(metadata) {
  if (
    !env.translation.enabled ||
    !metadata.permalink.includes(`${docsPart}en`)
  ) {
    return null;
  }
  const Redirect = require('../core/Redirect.js');
  const redirectlink = getPath(metadata.permalink, siteConfig.cleanUrl);
  return renderToStaticMarkupWithDoctype(
    <Redirect
      metadata={metadata}
      language={metadata.language}
      config={siteConfig}
      redirect={siteConfig.baseUrl + redirectlink}
    />,
  );
}

module.exports = {
  getMarkup,
  getFile,
  getFilePath,
  getRedirectMarkup,
  mdToHtmlify,
  replaceAssetsLink,
};
