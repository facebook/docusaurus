

  // remove a module and child modules from require cache, so server does not have
  // to be restarted
module.exports = (moduleName) => {
  let mod = require.resolve(moduleName);
  if (mod && (mod = require.cache[mod])) {
    mod.children.forEach(child => {
      delete require.cache[child.id];
      removeModulePathFromCache(mod.id);
    });
    delete require.cache[mod.id];
    removeModulePathFromCache(mod.id);
  }
}

function removeModulePathFromCache(moduleName) {
  Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
    if (cacheKey.indexOf(moduleName) > 0) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
}