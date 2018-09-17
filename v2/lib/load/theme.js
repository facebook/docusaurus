const fs = require('fs-extra');
const path = require('path');

module.exports = function loadConfig(siteDir) {
  const customThemePath = path.resolve(siteDir, 'theme');
  const themePath = fs.existsSync(customThemePath)
    ? customThemePath
    : path.resolve(__dirname, '../theme');

  const themeComponents = ['Docs', 'Loading', 'NotFound', 'Markdown'];
  themeComponents.forEach(component => {
    if (!require.resolve(path.join(themePath, component))) {
      throw new Error(
        `Failed to load ${themePath}/${component}. It does not exist.`,
      );
    }
  });

  return themePath;
};
