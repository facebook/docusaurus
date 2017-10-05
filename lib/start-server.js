#!/usr/bin/env node

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

require("babel-register")({
	babelrc: false,
	only: [__dirname, process.cwd() + "/core"],
	plugins: [require("./server/translate-plugin.js")],
	presets: ["react", "env"]
});

// initial check that required files are present
const chalk = require("chalk");
const fs = require("fs");
const CWD = process.cwd();

if (!fs.existsSync(CWD + "/siteConfig.js")) {
	console.error(
		chalk.red("Error: No siteConfig.js file found in website folder!")
	);
	process.exit(1);
}

const program = require("commander");

program.option("--port <number>", "Specify port number").parse(process.argv);

const port = program.port || 3000;

// start local server on specified port
const server = require("./server/server.js");
server(port);
