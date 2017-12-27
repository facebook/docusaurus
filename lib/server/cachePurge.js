/**
 * Node caches any require(....) modules until the server is restarted.
 * This means that any of our pages can't be live edited on the server, this purges them
 * So the next time they are loaded, they have the new content.
 * 
 * As a side note. This file is run WAY too often. 
 * 
 * Also used for temp files when building
 */ 

module.exports = moduleName => {
  // We want to ensure we are consistent.
  let mod = require.resolve(moduleName);
  if (mod && (mod = require.cache[mod])) {
    mod.children.forEach(child => {
      delete require.cache[child.id];
      removeModulePathFromCache(mod.id);
    });
    delete require.cache[mod.id];
    removeModulePathFromCache(mod.id);
  }
};

function removeModulePathFromCache(moduleName) {
  Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
    if (cacheKey.indexOf(moduleName) > 0) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
}
