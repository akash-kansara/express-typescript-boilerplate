import './env';

import './di';

import express from 'express';
import { Server } from 'http';

import { init, closeApp } from './core/server';

import eventHandler from './event';

import securityRouter from './middleware/security';

const app = express();

app.use(securityRouter);
app.disable('x-powered-by'); // TODO: Doesn't work. Check online later!

let server: Server;

init(app, (error) => {
  if (error) { throw error; }
  else {
    server = app.listen((process.env['NODE_PORT'] || process.env['APP.PORT']), () => {
      eventHandler.emit('sys-info', `Express app started at ${process.env['NODE_PORT'] || process.env['APP.PORT']}.`);
    });
  }
});

process.on('SIGINT', () => { closeApp(server); });
process.on('SIGTERM', () => { closeApp(server); });

export default app;