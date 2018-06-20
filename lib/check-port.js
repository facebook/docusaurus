const tcpPortUsed = require('tcp-port-used');
const chalk = require('chalk');

function checkPort(port, content) {
  let numAttempts = 0;
  const MAX_ATTEMPTS = 10;
  tcpPortUsed
    .check(port, 'localhost')
    .then(function(inUse) {
      if (inUse && numAttempts >= MAX_ATTEMPTS) {
        console.log(
          'Reached max attempts, exiting. Please open up some ports or ' +
            'increase the number of attempts and try again.'
        );
        process.exit(1);
      } else if (inUse) {
        console.error(chalk.red('Port ' + port + ' is in use'));
        // Try again but with port + 1
        port += 1;
        numAttempts += 1;
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
