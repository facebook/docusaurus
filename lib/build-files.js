#!/usr/bin/env node

require('babel-register') ({
  ignore: false,
  "presets": ["react"]
});

const server = require('./server/generate.js');
server();