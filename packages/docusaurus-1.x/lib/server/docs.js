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
        /**
         * When the very first version is created, all source/markdown files from next release docs
         * are copied to the directory corresponding to that version. For subsequent versiones being
         * created, source/markdown files are copied to the corresponding version directory, if and
         * only if that file had changed in the next release docs. This is how the source files are
         * maintained when versions are created.
         *
         * During build time those files that were not copied to the versioned docs source, are copied
         * to the build output.
         *
         * When `--skip-next-release` build option is used, we need to verify whether the target file path
         * exists with the "versioned docs" or at the next release docs. If it does, that file will be
         * available in the build output and the link will be valid. So, update the link from `.md` to
         * `.html` accordingly.
         */
        const originalFilePath = metadata.original_id.match('.+/')
          ? metadata.original_id.match('.+/')[0]
          : '';

        const targetFileAtVersionedDoc =
          'versioned_docs/version-' +
          metadata.version +
          '/' +
          resolve(docsSource, mdMatch[1]);

        const targetFileAtRoot =
          '../' + siteConfig.docsUrl + '/' + originalFilePath + mdMatch[1];

        if (
          fs.existsSync(targetFileAtVersionedDoc) ||
          fs.existsSync(targetFileAtRoot)
        ) {
          if (siteConfig.cleanUrl) {
            htmlLink = docsSource.endsWith('index.md')
              ? mdMatch[1].replace('.md', '.html')
              : '../' + mdMatch[1].replace('.md', '.html');
          } else {
            htmlLink = mdMatch[1].replace('.md', '.html');
          }
        }
      }

      /**
       * If there is a valid target link, sanitize the URL according to various configuration
       * options such as: `clearnUrl`, versions, language, etc. Otherwise, store the target so
       * that it can be reported as a broken link.
       */
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
