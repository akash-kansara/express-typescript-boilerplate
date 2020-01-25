import { createLogger, format, transports } from 'winston';

const { File, Console } = transports;

const infoLogger = createLogger({
  level: 'info'
});

const logLogger = createLogger({
  level: 'info'
});

const exceptionTransport = new transports.File({ filename: './logs/exceptions.log' });

infoLogger.exceptions.handle(exceptionTransport);
logLogger.exceptions.handle(exceptionTransport);

const consoleTransport = new Console({
  format: format.combine(
    format.colorize(),
    format.simple()
  )
});

infoLogger.add(consoleTransport);

if (process.env['NODE_ENV'] === 'prod') {

  const fileFormat = format.combine(
    format.timestamp(),
    format.json()
  );
  const logTransport = new File({
    filename: './logs/server.log',
    format: fileFormat
  });
  logLogger.add(logTransport);

} else {

  logLogger.add(consoleTransport);

}

function info(event: string) {
  infoLogger.info(event);
}

function log(event: string) {
  logLogger.info(event);
}

export { info, log };