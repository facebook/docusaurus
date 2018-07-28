const ora = require('ora');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const serve = require('webpack-serve');
const convert = require('koa-connect');
const mount = require('koa-mount');
const range = require('koa-range');
const serveStatic = require('koa-static');
const history = require('connect-history-api-fallback');
const load = require('./loader');
const createDevConfig = require('./webpack/dev');

module.exports = async function dev(sourceDir, cliOptions = {}) {
  const logger = ora(chalk.blue('Start development server')).start();

  // load site props from preprocessed files in source directory
  const props = await load(sourceDir);

  // Reload for any add/remove of file
  const reload = () => {
    const reloadLogger = ora({
      color: 'green',
      text: chalk.green('Reloading files')
    }).start();
    load(sourceDir)
      .then(() => {
        setTimeout(() => {
          reloadLogger.stop();
        }, 1000);
      })
      .catch(err => {
        console.error(chalk.red(err.stack));
      });
  };
  const fsWatcher = chokidar.watch(['**/*.md'], {
    cwd: sourceDir,
    ignoreInitial: true
  });
  fsWatcher.on('add', reload);
  fsWatcher.on('change', reload);
  fsWatcher.on('unlink', reload);
  fsWatcher.on('addDir', reload);
  fsWatcher.on('unlinkDir', reload);

  // resolve webpack config
  let config = createDevConfig(props);

  // create compiler from generated webpack config
  config = config.toConfig();
  const compiler = webpack(config);
  logger.succeed();

  // webpack-serve
  const serveContentDir = path.resolve(__dirname, 'serveContent');
  const port = cliOptions.port || 8080;
  await serve(
    {},
    {
      content: [serveContentDir],
      compiler,
      devWare: {logLevel: 'warn'},
      hotClient: {
        port: port + 1,
        logLevel: 'error'
      },
      logLevel: 'error',
      port,
      add: app => {
        const userPublic = path.resolve(sourceDir, '.blogi/public');

        // enable range request
        app.use(range);

        // respect base when serving static files...
        if (fs.existsSync(userPublic)) {
          app.use(mount(props.publicPath, serveStatic(userPublic)));
        }

        app.use(
          convert(
            history({
              rewrites: [{from: /\.html$/, to: '/'}]
            })
          )
        );
      }
    }
  );
};
