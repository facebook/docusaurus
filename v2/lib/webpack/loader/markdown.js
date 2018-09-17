const {getOptions} = require('loader-utils');
const fm = require('front-matter');

module.exports = function(fileString) {
  const options = getOptions(this);
  const {
    siteConfig,
    versionedDir,
    docsDir,
    translatedDir,
    sourceToMetadata,
  } = options;

  /* Extract content of markdown (without frontmatter) */
  const {body} = fm(fileString);

  /* Determine the source dir. e.g: @docs, @translated_docs/ko and @versioned_docs/version-1.0.0 */
  let sourceDir;
  let thisSource = this.resourcePath;
  if (thisSource.startsWith(translatedDir)) {
    thisSource = thisSource.replace(translatedDir, '@translated_docs');
    const {language, version} = sourceToMetadata[thisSource] || {};
    if (language && version && version !== 'next') {
      sourceDir = `@translated_docs/${language}/version-${version}`;
    } else if (language && (!version || version === 'next')) {
      sourceDir = `@translated_docs/${language}`;
    }
  } else if (thisSource.startsWith(versionedDir)) {
    thisSource = thisSource.replace(versionedDir, '@versioned_docs');
    const {version} = sourceToMetadata[thisSource] || {};
    if (version) {
      sourceDir = `@versioned_docs/version-${version}`;
    }
  } else if (thisSource.startsWith(docsDir)) {
    sourceDir = `@docs`;
  }

  /* Replace internal markdown linking (except in fenced blocks) */
  let content = body;
  if (sourceDir) {
    let fencedBlock = false;
    const lines = body.split('\n').map(line => {
      if (line.trim().startsWith('```')) {
        fencedBlock = !fencedBlock;
      }
      if (fencedBlock) return line;

      let modifiedLine = line;
      const mdLinks = [];
      const mdRegex = /(?:\]\()(?:\.\/)?([^'")\]\s>]+\.md)/g;
      let match = mdRegex.exec(content);
      while (match !== null) {
        mdLinks.push(match[1]);
        match = mdRegex.exec(content);
      }
      mdLinks.forEach(mdLink => {
        const targetSource = `${sourceDir}/${mdLink}`;
        const {permalink} = sourceToMetadata[targetSource] || {};
        if (permalink) {
          modifiedLine = modifiedLine.replace(mdLink, permalink);
        }
      });
      return modifiedLine;
    });
    content = lines.join('\n');
  }

  /* Return a React component */
  return (
    `import React from 'react';\n` +
    `import Markdown from '@theme/Markdown'\n` +
    `export default () => (
      <Markdown siteConfig={${JSON.stringify(siteConfig)}}>
        {${JSON.stringify(content)}}
      </Markdown>
    );`
  );
};
