const chalk = require('chalk');
const ora = require('ora');
module.exports = class LogPlugin {
  constructor (options) {
    this.options = options
  }

  apply (compiler) {
    const logger = ora();
    let isFirst = true
    compiler.hooks.done.tap('blogi-log', stats => {
      clearScreen()

      const { port, publicPath } = this.options
      const time = new Date().toTimeString().match(/^[\d:]+/)[0]

      logger.succeed(`${chalk.gray(`[${time}]`)} Build ${chalk.yellow(stats.hash.slice(0, 6))} finished in ${chalk.green(stats.endTime - stats.startTime)} ms!`)
      if (isFirst) {
        isFirst = false
        console.log(`\n${chalk.gray('>')} Blogi dev server listening at ${chalk.cyan(`http://localhost:${port}${publicPath}`)}`)
      }
    })
    compiler.hooks.invalid.tap('blogi-log', clearScreen)
  }
}

function clearScreen () {
  process.stdout.write('\x1Bc')
}