const fs = require('fs');
const glob = require('glob');
const color = require('color');
const chalk = require('chalk');

const CWD = process.cwd();

class Styles {
  constructor(siteConfig, mainCssPath) {
    this.siteConfig = siteConfig;
    this.mainCssPath = mainCssPath;
  }

  isSeparateCss(file, separateCss) {
    if (!separateCss) {
      return false;
    }
    for (let i = 0; i < separateCss.length; i++) {
      if (file.includes(separateCss[i])) {
        return true;
      }
    }
    return false;
  }

  getCssContent() {
    let cssContent = fs.readFileSync(this.mainCssPath, {encoding: 'utf8'});

    let files = glob.sync(CWD + '/static/**/*.css');

    files.forEach(file => {
      if (this.isSeparateCss(file)) {
        return;
      }
      cssContent =
        cssContent + '\n' + fs.readFileSync(file, {encoding: 'utf8'});
    });

    if (
      !this.siteConfig.colors ||
      !this.siteConfig.colors.primaryColor ||
      !this.siteConfig.colors.secondaryColor
    ) {
      console.error(
        `${chalk.yellow(
          'Missing color configuration.'
        )} Make sure siteConfig.colors includes primaryColor and secondaryColor fields.`
      );
    }

    Object.keys(this.siteConfig.colors).forEach(key => {
      const color = this.siteConfig.colors[key];
      cssContent = cssContent.replace(new RegExp('\\$' + key, 'g'), color);
    });
    const codeColor = color(this.siteConfig.colors.primaryColor)
      .alpha(0.07)
      .string();
    cssContent = cssContent.replace(new RegExp('\\$codeColor', 'g'), codeColor);

    if (this.siteConfig.fonts) {
      Object.keys(this.siteConfig.fonts).forEach(key => {
        const fontString = this.siteConfig.fonts[key]
          .map(font => '"' + font + '"')
          .join(', ');
        cssContent = cssContent.replace(
          new RegExp('\\$' + key, 'g'),
          fontString
        );
      });
    }

    return Promise.resolve(cssContent);
  }
}

module.exports = Styles;