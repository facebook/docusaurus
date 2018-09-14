const {getOptions} = require('loader-utils');
const fm = require('front-matter');

module.exports = function(fileString) {
  const options = getOptions(this);
  const {
    siteConfig,
    versionedDir,
    docsDir,
    translatedDir,
    sourceToLink
  } = options;

  /* Extract content of markdown (without frontmatter) */
  const {body} = fm(fileString);

  /* Determine whether this file is in @docs, @versioned_docs or @translated_docs */
  let dirAlias;
  if (this.resourcePath.startsWith(translatedDir)) {
    dirAlias = '@translated_docs';
  } else if (this.resourcePath.startsWith(versionedDir)) {
    dirAlias = '@versioned_docs';
  } else if (this.resourcePath.startsWith(docsDir)) {
    dirAlias = '@docs';
  }

  /* Replace internal markdown linking (except in fenced blocks) */
  let content = body;
  if (dirAlias) {
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
        const source = `${dirAlias}/${mdLink}`;
        const permalink = sourceToLink[source];
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
