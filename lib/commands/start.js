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
const load = require('../load');
const createDevConfig = require('../webpack/dev');

async function getPort(reqPort) {
  portfinder.basePort = parseInt(reqPort, 10) || 3000;
  const port = await portfinder.getPortPromise();
  return port;
}

module.exports = async function start(siteDir, cliOptions = {}) {
  console.log('Start command invoked ...');
  console.log(cliOptions);

  // Process all related files as a prop
  const props = await load(siteDir);

  // Reload files processing
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

  // create compiler from generated webpack config
  const config = createDevConfig(props).toConfig();
  const compiler = webpack(config);

  // webpack-serve
  setTimeout(async () => {
    await serve(
      {},
      {
        compiler,
        open: true,
        devMiddleware: {
          logLevel: 'silent'
        },
        hotClient: {
          port: port + 1,
          logLevel: 'error'
        },
        logLevel: 'error',
        port,
        add: app => {
          // serve static files
          const staticDir = path.resolve(siteDir, 'static');
          if (fs.existsSync(staticDir)) {
            app.use(mount(baseUrl, serveStatic(staticDir)));
          }

          // enable HTTP range requests
          app.use(range);

          // rewrite request to `/` since this is a SPA
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
