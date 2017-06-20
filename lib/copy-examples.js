#!/usr/bin/env node

const CWD = process.cwd();
const fs = require('fs-extra');

fs.copySync(__dirname + '/../examples/', CWD, {overwrite: false});