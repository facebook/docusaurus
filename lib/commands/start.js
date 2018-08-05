const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const chokidar = require('chokidar');
const convert = require('koa-connect');
const range = require('koa-range');
const mount = require('koa-mount');
const serveStatic = require('koa-static');
const history = require('connect-history-api-fallback');
const portfinder = require('portfinder');
const serve = require('webpack-serve');
const webpackNiceLog = require('webpack-nicelog');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const load = require('../loader');
const createDevConfig = require('../webpack/dev');

async function getPort(port) {
  portfinder.basePort = parseInt(port, 10) || 3000;
  return await portfinder.getPortPromise();
}

module.exports = async function start(siteDir, cliOptions = {}) {
  // Preprocess whole files as a prop
  const props = await load(siteDir);

  // (if enabled) live reload for any changes in file
  if (!cliOptions.noWatch) {
    const reload = () => {
      load(siteDir).catch(err => {
        console.error(chalk.red(err.stack));
      });
    };
    const docsRelativeDir = props.siteConfig.customDocsPath || 'docs';
    const fsWatcher = chokidar.watch(
      [`../${docsRelativeDir}/**/*.md`, 'blog/**/*.md', 'siteConfig.js'],
      {
        cwd: siteDir,
        ignoreInitial: true
      }
    );
    fsWatcher.on('add', reload);
    fsWatcher.on('change', reload);
    fsWatcher.on('unlink', reload);
    fsWatcher.on('addDir', reload);
    fsWatcher.on('unlinkDir', reload);
  }

  const port = await getPort(cliOptions.port);
  const {baseUrl} = props;

  // resolve webpack config
  let config = createDevConfig(props);
  config.plugin('WebpackNiceLog').use(webpackNiceLog, [
    {
      name: 'Munseo',
      onDone: () => {
        console.log(
          `\n${chalk.blue('Development server available at ')}${chalk.cyan(
            `http://localhost:${port}${baseUrl}`
          )}`
        );
      }
    }
  ]);
  config.plugin('html-webpack-plugin').use(HtmlWebpackPlugin, [
    {
      inject: false,
      hash: true,
      template: path.resolve(__dirname, '../core/index.html'),
      filename: 'index.html'
    }
  ]);

  // create compiler from generated webpack config
  config = config.toConfig();
  const compiler = webpack(config);

  // webpack-serve
  const nonExistentDir = path.resolve(__dirname, 'non-existent');
  setTimeout(async () => {
    await serve(
      {},
      {
        content: [nonExistentDir],
        compiler,
        open: false,
        devMiddleware: {
          logLevel: 'silent'
        },
        hotClient: {
          port: port + 1,
          logLevel: 'error'
        },
        logLevel: 'error',
        port,
        add: (app, middleware, options) => {
          const staticDir = path.resolve(siteDir, 'static');
          if (fs.existsSync(staticDir)) {
            app.use(mount(baseUrl, serveStatic(staticDir)));
          }
          app.use(range); // enable range request https://tools.ietf.org/html/rfc7233
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
  }, 1000);
};
