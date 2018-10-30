/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable */

import React from 'react';
import Helmet from 'react-helmet';

function Markdown(props) {
  const {siteConfig} = props;
  const highlight = Object.assign(
    {},
    {
      version: '9.12.0',
      theme: 'atom-one-dark',
    },
    siteConfig.highlight,
  );

  // Use user-provided themeUrl if it exists, else construct one from version and theme.
  const highlightThemeURL = highlight.themeUrl
    ? highlight.themeUrl
    : `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${
        highlight.version
      }/styles/${highlight.theme}.min.css`;

  return (
    <div>
      <Helmet>
        <link rel="stylesheet" type="text/css" href={highlightThemeURL} />
      </Helmet>
      <div>{props.children}</div>
    </div>
  );
}

Markdown.defaultProps = {
  siteConfig: {},
};

export default Markdown;
