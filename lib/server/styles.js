const fs = require('fs');
const glob = require('glob');
const color = require('color');
const postcss = require('postcss');
const precss = require('precss');
const chalk = require('chalk');
const autoprefixer = require('autoprefixer');

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

  getStylesConfigContent() {
    return __dirname + '/../static/css/styleConfig.pcss';
  }

  getFileContent(file) {
    return fs.readFileSync(file, {encoding: 'utf8'});
  }

  getCssContent() {
    const config = CWD + '/stylesConfig.pcss';
    const stylesConfigFile = fs.existsSync(config)
      ? config
      : this.getStylesConfigContent();

    const stylesConfigContent = this.getFileContent(stylesConfigFile);

    const mainCssContent = this.getFileContent(this.mainCssPath);

    let cssContent = stylesConfigContent + mainCssContent;

    let files = glob.sync(CWD + '/static/**/*.css');

    files.forEach(file => {
      if (this.isSeparateCss(file)) {
        return;
      }
      cssContent = cssContent + this.getFileContent(file);
    });

    if (
      this.siteConfig.colors ||
      this.siteConfig.colors.primaryColor ||
      this.siteConfig.colors.secondaryColor
    ) {
      console.error(
        `${chalk.yellow(
          'Deprecated color configuration.'
        )} Make sure to use stylesConfig.pcss in your website folder`
      );
    }

    return postcss([precss, autoprefixer]).process(cssContent, {
      from: undefined,
    });
  }
}

module.exports = Styles;
