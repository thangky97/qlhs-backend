'use strict';

const Winston = require('winston');

const loggingTransports = [
  new Winston.transports.Console({
    handleExceptions: true,
    humanReadableUnhandledException: true,
    colorize: true,
    format: Winston.format.printf(log => log.message)
  })
];

const Logger = Winston.createLogger({
  transports: loggingTransports,
  exitOnError: false
});
module.exports = Logger;
