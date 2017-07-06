/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

 const CWD = process.cwd();

const path = require('path');
const fs = require('fs');
const os = require('os');
let languages;
if (fs.existsSync(CWD + '/languages.js')) {
  languages = require(CWD + '/languages.js');
} else {
  languages = [{
    enabled: true,
    name: 'English',
    tag: 'en',
  }];
}
const glob = require('glob');

function splitHeader(content) {
  const lines = content.split(os.EOL);
  let i = 1;
  for (; i < lines.length - 1; ++i) {
    if (lines[i] === '---') {
      break;
    }
  }
  return {
    header: lines.slice(1, i + 1).join('\n'),
    content: lines.slice(i + 1).join('\n'),
  };
}

// Extract markdown metadata header
function extractMetadata(content) {
  const metadata = {};
  const both = splitHeader(content);
  const lines = both.header.split('\n');
  for (let i = 0; i < lines.length - 1; ++i) {
    const keyvalue = lines[i].split(':');
    const key = keyvalue[0].trim();
    let value = keyvalue.slice(1).join(':').trim();
    // Handle the case where you have "Community #10"
    try {
      value = JSON.parse(value);
    } catch (e) {}
    metadata[key] = value;
  }
  return {metadata, rawContent: both.content};
}

function processMetadata(file) {
  const result = extractMetadata(fs.readFileSync(file, 'utf8'));

  const regexSubFolder = /docs\/(.*)\/.*/;

  let language = 'en';
  const match = regexSubFolder.exec(file);
  if (match) {
    language = match[1];
  }

  const metadata = result.metadata;
  const rawContent = result.rawContent;
  metadata.source = path.basename(file);

  // in permalink replace /en/ language with localized folder
  metadata.permalink = metadata.permalink.replace(
    /\/en\//g,
    '/' + language + '/'
  );
  // change ids previous, next
  metadata.localized_id = metadata.id;
  metadata.id = language + '-' + metadata.id;
  if (metadata.previous) {
    metadata.previous_id = metadata.previous;
    metadata.previous = language + '-' + metadata.previous;
  }
  if (metadata.next) {
    metadata.next_id = metadata.next;
    metadata.next = language + '-' + metadata.next;
  }
  metadata.language = language;

  return {metadata, rawContent: rawContent};
}

function generateDocsMetadata() {

  const regexSubFolder = /docs\/(.*)\/.*/;

  const enabledLanguages = [];
  languages.filter(lang => lang.enabled).map(lang => {
    enabledLanguages.push(lang.tag);
  });

  const metadatas = [];

  const files = glob.sync(CWD + '/../docs/**');
  files.forEach(file => {
    let language = 'en';
    const match = regexSubFolder.exec(file);
    if (match) {
      language = match[1];
    }

    if (enabledLanguages.indexOf(language) === -1) {
      return;
    }

    const extension = path.extname(file);

    if (extension === '.md' || extension === '.markdown') {
      const res = processMetadata(file);
      const metadata = res.metadata;
      metadatas.push(metadata);
    }
  });


  fs.writeFileSync(
    __dirname + '/../core/metadata.js',
    '/**\n' +
      ' * @generated\n' +
      ' */\n' +
      'module.exports = ' +
      JSON.stringify(metadatas, null, 2) +
      ';'
  );
}

function generateBlogMetadata() {
  const metadatas = [];

  let files = glob.sync(CWD + '/../blog/**/*.*');
  files.sort().reverse().forEach(file => {
    // Transform
    //   2015-08-13-blog-post-name-0.5.md
    // into
    //   2015/08/13/blog-post-name-0-5.html
    const filePath = path
      .basename(file)
      .replace('-', '/')
      .replace('-', '/')
      .replace('-', '/')
      // react-middleware is broken with files that contains multiple .
      // like react-0.14.js
      .replace(/\./g, '-')
      .replace(/\-md$/, '.html');
    const result = extractMetadata(fs.readFileSync(file, {encoding: 'utf8'}));
    const rawContent = result.rawContent;
    const metadata = Object.assign(
      {path: filePath, content: rawContent},
      result.metadata
    );
    metadata.id = metadata.title;
    metadatas.push(metadata);
  });

  fs.writeFileSync(
    __dirname + '/../core/MetadataBlog.js',
    '/**\n' +
      ' * @generated\n' +
      ' */\n' +
      'module.exports = ' +
      JSON.stringify(metadatas, null, 2) +
      ';'
  );
}

module.exports.extractMetadata = extractMetadata;
module.exports.processMetadata = processMetadata;
module.exports.generateDocsMetadata = generateDocsMetadata;
module.exports.generateBlogMetadata = generateBlogMetadata;
