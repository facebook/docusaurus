const webpack = require('webpack');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const globby = require('globby');
const load = require('../load');
const createProdConfig = require('../webpack/prod');

function compile(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err);
      }
      if (stats.hasErrors()) {
        stats.toJson().errors.forEach(e => {
          console.error(e);
        });
        reject(new Error(`Failed to compile with errors.`));
      }
      if (stats.hasWarnings()) {
        stats.toJson().warnings.forEach(warning => {
          console.warn(warning);
        });
      }
      resolve(stats.toJson({modules: false}));
    });
  });
}

module.exports = async function build(siteDir, cliOptions = {}) {
  process.env.NODE_ENV = 'production';
  console.log('Build command invoked ...');
  console.log(cliOptions);

  const props = await load(siteDir);

  // create compiler from generated webpack config
  const config = createProdConfig(props).toConfig();

  // compile!
  await compile(config);

  // copy static files
  const {outDir} = props;
  const staticDir = path.resolve(siteDir, 'static');
  const staticFiles = await globby(['**'], {
    cwd: staticDir
  });
  await Promise.all(
    staticFiles.map(async source => {
      const fromPath = path.resolve(staticDir, source);
      const toPath = path.resolve(outDir, source);
      return fs.copy(fromPath, toPath);
    })
  );

  const relativeDir = path.relative(process.cwd(), outDir);
  console.log(
    `\n${chalk.green('Success!')} Generated static files in ${chalk.cyan(
      relativeDir
    )}.\n`
  );
};
