/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const CWD = process.cwd();
const {join} = require('path');
const {resolve} = require('url');
const fs = require('fs-extra');
const React = require('react');

const env = require('./env.js');
const {renderToStaticMarkupWithDoctype} = require('./renderUtils');
const readMetadata = require('./readMetadata.js');
const {insertTOC} = require('../core/toc.js');
const {replaceAssetsLink} = require('./utils.js');
const {getPath} = require('../core/utils.js');

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

function mdToHtmlify(oldContent, mdToHtml, metadata, siteConfig) {
  /* Store broken links */
  const mdBrokenLinks = [];

  let content = oldContent;
  /* Replace internal markdown linking (except in fenced blocks) */
  let fencedBlock = false;
  const lines = content.split('\n').map(line => {
    if (line.trim().startsWith('```')) {
      fencedBlock = !fencedBlock;
    }
    if (fencedBlock) return line;

    let modifiedLine = line;
    /* Replace inline-style links or reference-style links e.g:
    This is [Document 1](doc1.md) -> we replace this doc1.md with correct link
    [doc1]: doc1.md -> we replace this doc1.md with correct link
    */
    const mdRegex = /(?:(?:\]\()|(?:\]:\s?))(?!https)([^'")\]\s>]+\.md)/g;
    let mdMatch = mdRegex.exec(modifiedLine);
    while (mdMatch !== null) {
      /* Replace it to correct html link */
      const docsSource = metadata.version
        ? metadata.source.replace(/version-.*?\//, '')
        : metadata.source;

      let htmlLink;

      if (readMetadata.shouldGenerateNextReleaseDocs()) {
        htmlLink =
          mdToHtml[resolve(docsSource, mdMatch[1])] || mdToHtml[mdMatch[1]];
      } else {
        /*
         * Check if the target file exists in the versioned doc.
         * If it exists with the versioned doc, resolve the link.
         * If it does not exist with the versioned doc,
         * check if it exists at the directory where the version
         *  was created from. If yes, resolve the link. Otherwise,
         * this is a broken link.
         */
        const originalFilePath = metadata.original_id.match('.+/')
          ? metadata.original_id.match('.+/')[0]
          : '';
        const targetFileAtRoot =
          '../' + siteConfig.docsUrl + '/' + originalFilePath + mdMatch[1];

        if (fs.existsSync(mdMatch[1])) {
          htmlLink = resolve(docsSource, mdMatch[1]).replace('.md', '.html');
        } else if (fs.existsSync(targetFileAtRoot)) {
          htmlLink = resolve(docsSource, mdMatch[1]).replace('.md', '.html');
        }
      }

      if (htmlLink) {
        htmlLink = getPath(htmlLink, siteConfig.cleanUrl);
        htmlLink = htmlLink.replace('/en/', `/${metadata.language}/`);
        htmlLink = htmlLink.replace(
          '/VERSION/',
          metadata.version && metadata.version !== env.versioning.latestVersion
            ? `/${metadata.version}/`
            : '/',
        );
        modifiedLine = modifiedLine.replace(mdMatch[1], htmlLink);
      } else {
        mdBrokenLinks.push(mdMatch[1]);
      }
      mdMatch = mdRegex.exec(modifiedLine);
    }
    return modifiedLine;
  });
  content = lines.join('\n');

  if (mdBrokenLinks.length) {
    console.log(
      `[WARN] unresolved links in file '${metadata.source}' >`,
      mdBrokenLinks,
    );
  }
  return content;
}

function getMarkup(rawContent, mdToHtml, metadata, siteConfig) {
  // generate table of contents
  let content = insertTOC(rawContent);

  // replace any links to markdown files to their website html links
  content = mdToHtmlify(content, mdToHtml, metadata, siteConfig);

  // replace any relative links to static assets (not in fenced code blocks) to absolute links
  const docsAssetsLocation = siteConfig.docsUrl
    ? `${siteConfig.baseUrl}${siteConfig.docsUrl}`
    : siteConfig.baseUrl.substring(0, siteConfig.baseUrl.length - 1);
  content = replaceAssetsLink(content, docsAssetsLocation);

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

function getRedirectMarkup(metadata, siteConfig) {
  const docsPart = `${siteConfig.docsUrl ? `${siteConfig.docsUrl}/` : ''}`;
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
};
