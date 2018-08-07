const {getOptions} = require('loader-utils');
const fm = require('front-matter');
// const MarkdownBlock = require('../../core/components/markdown');

module.exports = function(fileString) {
  const options = getOptions(this);

  const {body} = fm(fileString);
  const source = JSON.stringify(body);
  const siteConfig = JSON.stringify(options.siteConfig);

  return (
    `import React from 'react';\n` +
    `import MarkdownBlock from '@core/components/Markdown'\n` +
    `export default () => <MarkdownBlock source={${source}} siteConfig={${siteConfig}} />;`
  );

  // return `export default () => <MarkdownBlock source={${source}} siteConfig={${siteConfig}} />`;
};
