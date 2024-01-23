import winston from 'winston'

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    //winston.format.label({ label: 'CUSTOM', message: true }),
    winston.format.timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File({
      filename: './log.txt',
      //silent: process.env.NODE_ENV === 'test',
    }),
    new winston.transports.Console(/* { silent: process.env.NODE_ENV === 'test' } */),
  ],
})

export default logger
