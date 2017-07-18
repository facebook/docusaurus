#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

require("babel-register")({
  ignore: false,
  babelrc: false,
  plugins: [require("./server/translate-plugin.js")],
  presets: ["react"]
});

const program = require("commander");

program.option("--port <number>", "Specify port number").parse(process.argv);

const port = program.port || 3000;

const server = require("./server/server.js");
server(port);
