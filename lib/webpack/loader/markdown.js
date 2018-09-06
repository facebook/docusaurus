const {getOptions} = require('loader-utils');
const fm = require('front-matter');

module.exports = function(fileString) {
  const options = getOptions(this);

  const {body} = fm(fileString);

  const content = JSON.stringify(body);
  // TODO replace all the markdown linking to correct url depends on whether it's versioned/translated/normal docs
  // e.g: [test](test.md) become [test](/docs/test)
  const siteConfig = JSON.stringify(options.siteConfig);

  return (
    `import React from 'react';\n` +
    `import Markdown from '@theme/Markdown'\n` +
    `export default () => (
      <Markdown siteConfig={${siteConfig}}>
        {${content}}
      </Markdown>
    );`
  );
};
