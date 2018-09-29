const babelConfig = require('./.babelrc');

module.exports = require('babel-jest').createTransformer(babelConfig);
