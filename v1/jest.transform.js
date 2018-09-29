const babelConfig = require('./babel.config');

module.exports = require('babel-jest').createTransformer(babelConfig);
