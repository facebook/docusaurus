const {getOptions} = require('loader-utils');
const fm = require('front-matter');

module.exports = function(fileString) {
  const options = getOptions(this);
  const {siteConfig, siteDir, docsDir } = options;

  /* 
    Process the markdown file content, including replacing all relative markdown links
  */
  const {body: content = ''} = fm(fileString);
  
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
