/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const path = require('path');
const fs = require('fs');
const utils = require('../utils');

describe('server utils', () => {
  test('minify css', () => {
    const testCss = fs.readFileSync(
      path.join(__dirname, '__fixtures__', 'test.css'),
      'utf8'
    );
    const notCss = fs.readFileSync(
      path.join(__dirname, '__fixtures__', 'test.md'),
      'utf8'
    );
    utils.minifyCss(testCss).then(css => expect(css).toMatchSnapshot());
    utils.minifyCss(notCss).catch(e => expect(e).toMatchSnapshot());
  });
});
