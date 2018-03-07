require('dotenv').config()
const LOGDIR = process.env.LOGGER_DIR

const winston = require('winston')
const winstonDaily = require('winston-daily-rotate-file')
const moment = require('moment')

function timeStampFormat(){
  return moment().format('YYYY-MM-DD HH:mm:ss.SSS zz')
}

const logger = new (winston.Logger)({
  transports: [
    new (winstonDaily)({
      name: 'info',
      filename: `${LOGDIR}/info`,
      datePattern: '_yyyyMMdd.log',
      colorize: false,
      maxsize: 50000000,
      maxFiles: 1000,
      level: 'info',
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    }),
    new (winston.transports.Console)({
      name: 'debug-console',
      colorize: true,
      level: 'debug',
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    })
  ],
  exceptionHandlers: [
    new (winstonDaily)({
      name: 'exception',
      filename: `${LOGDIR}/exception`,
      datePattern: '_yyyyMMdd.log',
      colorize: false,
      maxsiz: 50000000,
      maxFiles: 1000,
      level: 'error',
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    }),
    new (winston.transports.Console)({
      name: 'exception-console',
      colorize: true,
      showLevel: true,
      json: false,
      timestamp: timeStampFormat
    })
  ]
})

module.exports = logger