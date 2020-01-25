import { createLogger, format, transports } from 'winston';

const { File, Console } = transports;

const infoLogger = createLogger({
  level: 'info'
});

const logLogger = createLogger({
  level: 'info'
});

const errorLogger = createLogger({
  level: 'error'
});

const exceptionTransport = new transports.File({ filename: './logs/exceptions.log' });

infoLogger.exceptions.handle(exceptionTransport);
logLogger.exceptions.handle(exceptionTransport);
errorLogger.exceptions.handle(exceptionTransport);

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
    filename: './logs/db-log.log',
    format: fileFormat
  });
  const errorTransport = new File({
    filename: './logs/db-error.log',
    format: fileFormat
  });
  logLogger.add(logTransport);
  errorLogger.add(errorTransport);

} else {

  logLogger.add(consoleTransport);
  errorLogger.add(consoleTransport);

}

function connectSuccessful(provider: string, connectionObj: object) {
  infoLogger.info(`Connected to ${provider} repository`);
  if (process.env['NODE_ENV'] === 'dev') {
    infoLogger.info(`Repository connection object: ${JSON.stringify(connectionObj)}`);
  }
}

function connectFail(provider: string, connectionObj: any, error: any) {
  errorLogger.error(`Failed to connect to ${provider} repository.`);
  if (process.env['NODE_ENV'] === 'dev') {
    errorLogger.error(`Repository connection object: ${JSON.stringify(connectionObj)}`);
  }
  errorLogger.error(`Error: ${JSON.stringify(error)}`);
}

function disconnectSuccessful(provider: string) {
  infoLogger.info(`Disconnected from ${provider} repository.`);
}

function disconnectFail(provider: string, error: any) {
  errorLogger.error(`Failed to disconnect from ${provider} repository.`);
  errorLogger.error(`Error: ${JSON.stringify(error)}`);
}

function opFail(provider: string, operation: string, data: any, error: any) {
  logLogger.warn(`Failed to perform ${operation} operation on ${provider} repository.`);
  logLogger.warn(`Error: ${JSON.stringify(error)}`);
}

function warn(warning: any) {
  infoLogger.warn(warning);
}

export { connectSuccessful, connectFail, disconnectSuccessful, disconnectFail, opFail, warn };