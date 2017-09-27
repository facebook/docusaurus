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
	babelrc: false,
	only: [__dirname, process.cwd() + "/core"],
	plugins: [require("./server/translate-plugin.js")],
	presets: ["react", "latest"]
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

// generate rss feed
const feed = require("./server/feed.js");
console.log(feed());
