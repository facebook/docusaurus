/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CWD = process.cwd();
const fs = require('fs-extra');
const path = require('path');
const join = path.join;
const color = require('color');
const siteConfig = require(CWD + '/siteConfig.js');
const glob = require('glob');

// returns true if a file should be included in any main.css requests
function isSeparateCss(file) {
  if (!siteConfig.separateCss) {
    return false;
  }
  for (let i = 0; i < siteConfig.separateCss.length; i++) {
    if (file.includes(siteConfig.separateCss[i])) {
      return true;
    }
  }
  return false;
}

// Add two strings together with a prepend option
const combineCss = (existingCss, newCss, prepend) =>
{
  return prepend ? newCss + '/n' + existingCss : existingCss + '\n' + newCss;
}

// Replace any variables ($primaryColor, $secondaryColor) with their values from the config. This is for easy skinning
const parseCss = (css) => {
  // Check if we have the variables we except. If not throw a warning
  if (
    !siteConfig.colors ||
    !siteConfig.colors.primaryColor ||
    !siteConfig.colors.secondaryColor
  ) {
    console.error(
      `${chalk.yellow('Warning: Missing color configuration. Make sure siteConfig.colors includes primaryColor and secondaryColor fields')}`
    );
  }

  const variables = siteConfig.colors;
  // Add the $codeColor variable. This is for monospaced information (and also a fallback for code)
  variables['codeColor'] = color(siteConfig.colors.primaryColor).alpha(0.07).string();

  // Search for all the variables and replace them with the value
  Object.keys(variables).forEach(key => {
    const color = variables[key];
    css = css.replace(new RegExp('\\$' + key, 'g'), color);
  });
  
  return css;
}

// main.css has explicitly been requested
// We lookup up all CSS files in the folders.
// If we have a main file, that always gets prepended so we can overwrite our styles
const renderMainCss = () => {
  let result = '';

  const libStaticFolder = join(__dirname, '..','..', 'static', '**', '*.css');

  let cssFiles = glob.sync(libStaticFolder, { nodir: true });
  let websiteCssFiles = glob.sync(join(CWD, 'static', '**', '*.css'), { nodir: true });

  // Combine into one array for easy enumeration
  cssFiles = cssFiles.concat(websiteCssFiles);

  cssFiles.forEach(file => {
    // Only parse files not specified as being seperate in the config
    if (!isSeparateCss(file))
    {
      // Add to existing file, prepend if its a main.css file
      result = combineCss(result, fs.readFileSync(file, 'utf8'), file.match(/\main.css$/));
    }
  });
  
  // Parse css files to replace colors according to siteConfig
  return parseCss(result);
}

const renderSeperateCss = (filePath) => {
  if (isSeparateCss(filePath))
  {
    return fs.readFileSync(file, 'utf8');
  }
  return null;
}

module.exports = {
  renderMainCss, renderSeperateCss
};