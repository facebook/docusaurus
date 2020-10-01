/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const fs = require('fs');
const path = require('path');

// This is useful to speed up v1 deployment in Netlify PR deploy previews
//
// Command to test locally:
// NETLIFY=true CONTEXT=deploy-preview yarn build:v1
// or
// NETLIFY=true CONTEXT=deploy-preview yarn netlify:deployPreview:v1
//
// See Netlify env variables here: https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
const isDeployPreview =
  process.env.NETLIFY === 'true' && process.env.CONTEXT === 'deploy-preview';
if (isDeployPreview) {
  console.log('Docusaurus v1 running as a Netlify deploy preview');
}
exports.isDeployPreview = isDeployPreview;

// On netlify deploy previews, we don't deploy all versions to make deploy preview faster
function updateDeployPreviewVersions(versions) {
  const newVersions = [versions[0], versions[versions.length - 1]];
  console.log(
    'Netlify deploy previews will only deploy a subset of available versions: ' +
      newVersions.join(' - '),
  );
  return newVersions;
}

exports.setDeployPreviewVersions = function () {
  const versions = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'versions.json'), 'utf8'),
  );
  const newVersions = updateDeployPreviewVersions(versions);
  fs.writeFileSync(
    path.join(__dirname, 'versions.json'),
    JSON.stringify(newVersions, null, 2),
    'utf8',
  );
};
