/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const path = require('path');
const siteConfig = require(CWD + '/siteConfig.js');
const removeModuleAndChildrenFromCache = require('../cachePurge.js');
const React = require('react');
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup;
const translate = require('../translate.js');

// create the folder path for a file if it does not exist, then write the file
function copyFile(source, target) {
  var parsed = path.parse(source);
  mkdirp.sync(parsed.dir);
  fs.copySync(source, target);
}

// We do not read language from the file. We expect to know it by this point.
const renderPageJs = (filePath, language) => {
  // Check if it exists, if not, then return null;
  if (!fs.existsSync(filePath)) return null;

  // copy into docusaurus so require paths work

  var relative = path.relative(path.join(CWD, 'pages'), filePath);
  let tempFile = path.join(__dirname, 'temp.js');

  copyFile(filePath, tempFile);

  // render into a string
  // This in a different folder to the 'node module cache' function. Does that matter?
  removeModuleAndChildrenFromCache(tempFile);
  const ReactComp = require(tempFile);
  removeModuleAndChildrenFromCache('../core/Site.js');
  const Site = require('../../core/Site.js');

  translate.setLanguage(language);

  const rawHtml = renderToStaticMarkup(
    <Site language={language} config={siteConfig}>
      <ReactComp language={language} />
    </Site>
  );

  fs.removeSync(tempFile);

  return rawHtml;
};

// We do not read language from the file. We expect to know it by this point.
const renderPageHtml = (filePath, language) => {
  translate.setLanguage(language);

  return renderToStaticMarkup(
    <Site language={language} config={siteConfig}>
      <div
        dangerouslySetInnerHTML={{
          __html: fs.readFileSync(file, {encoding: 'utf8'}),
        }}
      />
    </Site>
  );
};

module.exports = {
  renderPageJs,
  renderPageHtml,
};
