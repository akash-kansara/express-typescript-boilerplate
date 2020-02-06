import { Server } from 'http';
import { Request, Response, NextFunction } from 'express';

import { container } from '../di';
import { TYPES } from '../di/types';
import IRepository from '../core/repository/definition';

import eventHandler from '../event';

import swaggerRoute from '../swagger';
import middleware from '../middleware';
import router from '../routes';
import { APINotFoundError } from '../error-handler/definition';
import errorHandler from '../error-handler';

let repository: IRepository = container.get<IRepository>(TYPES.IRepository);

function init(app: any, cb: (error: any) => void): void {
  const promises: Array<Promise<any>> = [];

  Promise.all(promises)
    .then(() => {
      app.use(swaggerRoute);
      app.use(middleware);
      app.use(router);
      app.use((req: Request, res: Response, next: NextFunction) => { next(new APINotFoundError()); });
      app.use(errorHandler);
      eventHandler.emit('sys-log', 'Initialised App.');
      cb(null);
    })
    .catch((error) => {
      cb(error);
    });

}

async function closeApp(server: Server): Promise<void> {

  try { await repository.disconnect(); } catch (err) { }
  try { server.close(); } catch (err) { }
  eventHandler.emit('sys-info', 'Shutting down app.');
  process.exit(0);

}

export { init, closeApp };