const webpackNiceLog = require('webpack-nicelog');
const webpack = require('webpack');
const path = require('path');
const chalk = require('chalk');
const load = require('../load');
const createProdConfig = require('../webpack/prod');

function compile(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (stats.hasErrors()) {
        stats.toJson().errors.forEach(e => {
          console.error(e);
        });
        reject(new Error(`Failed to compile with errors.`));
        return false;
      }
      if (stats.hasWarnings()) {
        stats.toJson().warnings.forEach(warning => {
          console.warn(warning);
        });
      }
      resolve(stats.toJson({modules: false}));
      return true;
    });
  });
}

module.exports = async function build(siteDir, cliOptions = {}) {
  process.env.NODE_ENV = 'production';
  console.log('Build command invoked ...');
  console.log(cliOptions);

  const props = await load(siteDir);

  // resolve webpack config
  let config = createProdConfig(props);
  config.plugin('WebpackNiceLog').use(webpackNiceLog, [
    {
      name: 'Production'
    }
  ]);

  // create compiler from generated webpack config
  config = config.toConfig();

  // compile!
  await compile(config);

  const {outDir} = props;
  const relativeDir = path.relative(process.cwd(), outDir);
  console.log(
    `\n${chalk.green('Success!')} Generated static files in ${chalk.cyan(
      relativeDir
    )}.\n`
  );
};
