const merge = require('webpack-merge');

// Modify the generated webpack config with normal webpack config
function applyConfigureWebpack(userConfig, config, isServer) {
  if (typeof userConfig === 'object') {
    return merge(config, userConfig);
  }
  if (typeof userConfig === 'function') {
    const res = userConfig(config, isServer);
    if (res && typeof res === 'object') {
      return merge(config, res);
    }
  }
  return config;
}

// Modify the generated webpack config with webpack-chain API
function applyChainWebpack(userChainWebpack, config, isServer) {
  if (userChainWebpack) {
    userChainWebpack(config, isServer);
  }
  
}

module.exports = {
  applyConfigureWebpack,
  applyChainWebpack
};
