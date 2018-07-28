const chalk = require('chalk');
const ora = require('ora');

function clearScreen() {
  process.stdout.write('\x1Bc');
}

module.exports = class LogPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const logger = ora();
    compiler.hooks.done.tap('blogi-log', stats => {
      clearScreen();

      const {port, publicPath} = this.options;
      const time = new Date().toTimeString().match(/^[\d:]+/)[0];

      logger.succeed(
        `${chalk.gray(`[${time}]`)} Build ${chalk.green(
          stats.hash.slice(0, 8)
        )} finished in ${chalk.green(stats.endTime - stats.startTime)} ms!`
      );
      console.log(
        `\n${chalk.blue('Development server available at ')}${chalk.cyan(
          `http://localhost:${port}${publicPath}`
        )}`
      );
    });
    compiler.hooks.invalid.tap('blogi-log', clearScreen);
  }
};
