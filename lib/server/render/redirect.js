/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const siteConfig = require(CWD + '/siteConfig.js');
const React = require('react');
const Redirect = require('../../core/Redirect.js');
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;

const redirect = (target, language) => {
  const rawHtml = (
    <Redirect
      language={language}
      config={siteConfig}
      redirect={target}
    />
  );
  return renderToStaticMarkup(rawHtml);
}

module.exports = redirect;