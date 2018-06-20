const tcpPortUsed = require('tcp-port-used');
const chalk = require('chalk');
let numOfAttempts = 0;
const MAX_ATTEMPTS = 10;

function checkPort(port, content) {
  tcpPortUsed
    .check(port, 'localhost')
    .then(function(inUse) {
      if (inUse && numOfAttempts >= MAX_ATTEMPTS) {
        console.log(
          'Reached max attempts, exiting. Please open up some ports or ' +
            'increase the number of attempts and try again.'
        );
        process.exit(1);
      } else if (inUse) {
        console.error(chalk.red('Port ' + port + ' is in use'));
        // Try again but with port + 1
        port += 1;
        numOfAttempts += 1;
        checkPort(port, content);
      } else {
        content(port);
      }
    })
    .catch(function(ex) {
      setTimeout(function() {
        throw ex;
      }, 0);
    });
}

module.exports = checkPort;
