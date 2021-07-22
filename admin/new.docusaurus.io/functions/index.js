/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

exports.handler = async function (_event, _context) {
  // TODO
  // https://codesandbox.io/s/docusaurus
  // https://stackblitz.com/fork/docusaurus
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'index'}),
  };
};
