#!/usr/bin/env node

require('babel-register') ({
  ignore: false,
  "presets": ["react"]
});

const generate = require('./server/generate.js');
generate();
