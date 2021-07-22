/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

exports.handler = async function (_event, _context) {
  return {
    statusCode: 200,
    body: JSON.stringify({message: 'index'}),
  };
};
