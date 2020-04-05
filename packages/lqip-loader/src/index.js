/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const loaderUtils = require('loader-utils');
const lqip = require('./lqip');

module.exports = function (contentBuffer) {
  if (this.cacheable) {
    this.cacheable();
  }
  const callback = this.async();
  const imgPath = this.resourcePath;

  const config = loaderUtils.getOptions(this) || {};
  config.base64 = 'base64' in config ? config.base64 : true;
  config.palette = 'palette' in config ? config.palette : false;

  let content = contentBuffer.toString('utf8');
  const contentIsUrlExport = /^module.exports = "data:(.*)base64,(.*)/.test(
    content,
  );
  const contentIsFileExport = /^module.exports = (.*)/.test(content);

  let source = '';
  const SOURCE_CHUNK = 1;

  if (contentIsUrlExport) {
    source = content.match(/^module.exports = (.*)/)[SOURCE_CHUNK];
  } else {
    if (!contentIsFileExport) {
      // eslint-disable-next-line global-require
      const fileLoader = require('file-loader');
      content = fileLoader.call(this, contentBuffer);
    }
    source = content.match(/^module.exports = (.*);/)[SOURCE_CHUNK];
  }

  const outputPromises = [];

  if (config.base64 === true) {
    outputPromises.push(lqip.base64(imgPath));
  } else {
    outputPromises.push(null);
  }

  // color palette generation is set to false by default
  // since it is little bit slower than base64 generation

  if (config.palette === true) {
    outputPromises.push(lqip.palette(imgPath));
  } else {
    outputPromises.push(null);
  }

  Promise.all(outputPromises)
    .then((data) => {
      if (data) {
        const [preSrc, palette] = data;
        const param1 = preSrc ? `, "preSrc": ${JSON.stringify(preSrc)}` : '';
        const param2 = palette ? `, "palette": ${JSON.stringify(palette)}` : '';
        const result = `module.exports = {"src":${source}${param1}${param2}};`;
        callback(null, result);
      } else {
        callback('ERROR', null);
      }
    })
    .catch((error) => {
      console.error(error);
      callback(error, null);
    });
};

module.exports.raw = true;
