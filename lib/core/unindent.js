/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

// Remove the indentation introduced by JSX
function unindent(code) {
  const lines = code.split("\n");
  if (lines[0] === "") {
    lines.shift();
  }
  if (lines.length <= 1) {
    return code;
  }

  const indent = lines[0].match(/^\s*/)[0];
  for (let i = 0; i < lines.length; ++i) {
    lines[i] = lines[i].replace(new RegExp("^" + indent), "");
  }
  return lines.join("\n");
}

module.exports = unindent;
