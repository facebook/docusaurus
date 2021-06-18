/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  title: 'My Site',
  tagline: 'The tagline of my site',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  plugins: [
    function (context, options) {
      return {name: 'first-plugin'};
    },
    [
      function (context, options) {
        return {name: 'second-plugin'};
      },
      {it: 'should work'},
    ],
    './plugin3.js',
    ['./plugin4.js', {}],
  ],
};
