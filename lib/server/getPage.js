/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const fs = require('fs-extra');
const siteConfig = require(CWD + '/siteConfig.js');
const removeModuleAndChildrenFromCache = require('./cachePurge.js');
const React = require('react');
const translate = require('./translate.js');

// We do not read language from the file. We expect to know it by this point.
const getPageJs = (filePath, language) => {
  // Check if it exists, if not, then return null;
  if(!fs.existsSync(filePath)) return null;

  // copy into docusaurus so require paths work
  let parts = filePath.split('pages/');
  let tempFile = __dirname + '/../pages/' + parts[1];
  tempFile = tempFile.replace(
    path.basename(javascriptFile),
    'temp' + path.basename(javascriptFile)
  );
  mkdirp.sync(tempFile.replace(new RegExp('/[^/]*$'), ''));
  fs.copySync(filePath, tempFile);

  // render into a string
  removeModuleAndChildrenFromCache(tempFile);
  const ReactComp = require(tempFile);
  removeModuleAndChildrenFromCache('../core/Site.js');
  const Site = require('../core/Site.js');

  translate.setLanguage(language);

  const rawHtml = renderToStaticMarkup(
    <Site language={language} config={siteConfig}>
      <ReactComp language={language} />
    </Site>
  );

  fs.removeSync(tempFile);

  return rawHtml;
}

// We do not read language from the file. We expect to know it by this point.
const getPageHtml = (filePath, language) => {
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
}

module.exports = {
  getPageJs,
  getPageHtml
};