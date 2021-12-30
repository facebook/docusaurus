/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const fs = require('fs');

/*
This verifies CSS ordering on the Docusaurus site itself,

There are multiple ways to provide some CSS to Docusaurus
and Docusaurus should guarantee a consistent CSS ordering over time

See also
- https://github.com/facebook/docusaurus/issues/3678
- https://github.com/facebook/docusaurus/pull/5987

TODO we should probably add a real e2e test in core instead of using our own website?
Current solution looks good-enough for now

 */

// TODO temporary, the current order is bad and we should change that
const EXPECTED_MARKER_CLASSES = [
  // Some class from Infima, in the order Infima declares them
  // this ensures we don't mess-up and re-order css from other libs
  '.navbar__title',
  ".col[class*='col--']", // TODO Should be after paddings
  '.padding-vert--xl',
  '.footer__link-item', // TODO should be last
  '.pagination__item',
  '.pills__item',
  '.tabs__item',

  // Test markers
  '.test-marker-site-custom-css',
  '.test-marker-site-client-module',
  '.test-marker-theme-layout',
  '.test-marker-site-index-page',
];

const cssDirName = path.join(__dirname, 'build', 'assets', 'css');

const cssFileNames = fs
  .readdirSync(cssDirName)
  .filter((file) => file.endsWith('.css'));

if (cssFileNames.length !== 1) {
  throw new Error('unexpected: more than 1 css file');
}
const cssFile = path.join(cssDirName, cssFileNames[0]);

console.log('Inspecting CSS file for test CSS markers', cssFile);

const cssFileContent = fs.readFileSync(cssFile, 'utf8');

const cssMarkersWithPositions = EXPECTED_MARKER_CLASSES.map((marker) => {
  const position = cssFileContent.indexOf(marker);
  return {marker, position};
});

const missingCSSMarkers = cssMarkersWithPositions.filter(
  (m) => m.position === -1,
);

if (missingCSSMarkers.length > 0) {
  throw new Error(
    `Some expected CSS marker classes could not be found in file ${cssFile}: \n- ${missingCSSMarkers.join(
      '\n- ',
    )}`,
  );
}

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_sortby-and-_orderby
const sortBy = (key) => (a, b) =>
  // eslint-disable-next-line no-nested-ternary
  a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;

const sortedCSSMarkers = cssMarkersWithPositions
  .concat()
  .sort(sortBy('position'))
  .map(({marker}) => marker);

if (
  JSON.stringify(sortedCSSMarkers) === JSON.stringify(EXPECTED_MARKER_CLASSES)
) {
  console.log(`Test CSS markers were found in the expected order:
- ${sortedCSSMarkers.join('\n- ')}`);
} else {
  throw new Error(`Test CSS markers were found in an incorrect order.

Expected order:
- ${EXPECTED_MARKER_CLASSES.join('\n- ')};

Actual order:
- ${sortedCSSMarkers.join('\n- ')};

CSS file: ${cssFile}
  `);
}
