const Config = require('webpack-chain');
const path = require('path');

module.exports = function createBaseConfig(props) {
  const {outDir, themePath, sourceDir, publicPath} = props;

  const config = new Config();
  const isProd = process.env.NODE_ENV === 'production';

  config
    .mode(isProd ? 'production' : 'development')
    .output.path(outDir)
    .filename(
      isProd ? 'static/js/[name].[chunkhash].js' : 'static/js/[name].js'
    )
    .publicPath(isProd ? publicPath : '/');

  config.resolve
    .set('symlinks', true)
    .alias.set('@theme', themePath)
    .set('@source', sourceDir)
    .set('@generated', path.resolve(__dirname, '../generated'))
    .set('@core', path.resolve(__dirname, '../core'))
    .end();

  const libDir = path.join(__dirname, '..');
  config.module
    .rule('js')
    .test(/\.js$/)
    .exclude.add(filepath => {
      // Always transpile lib directory
      if (filepath.startsWith(libDir)) {
        return false;
      }
      // Don't transpile node_modules
      return /node_modules/.test(filepath);
    })
    .end()
    .use('babel')
    .loader('babel-loader')
    .options({
      // do not pick local project babel config
      babelrc: false,
      presets: ['env', 'react']
    });

  return config;
};
