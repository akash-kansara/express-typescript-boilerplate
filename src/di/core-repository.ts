import { TYPES } from './types';
import { Container } from 'inversify';

// Interface imports begin
import IRepository from '../core/repository/definition';
// Interface imports end

// Entity imports begin
import LokiRepo from '../core/repository/loki';
import MongoRepo from '../core/repository/mongo';
import MySqlRepo from '../core/repository/mysql';
// Entity imports end

const container = new Container();

switch (process.env['REPOSITORY.DEFAULT']) {
  case 'MONGO':
    container.bind<IRepository>(TYPES.IRepository).to(MongoRepo).inSingletonScope();
    break;
  case 'LOKI':
    container.bind<IRepository>(TYPES.IRepository).to(LokiRepo).inSingletonScope();
    break;
  case 'MYSQL':
    container.bind<IRepository>(TYPES.IRepository).to(MySqlRepo).inSingletonScope();
    break;
  default:
    container.bind<IRepository>(TYPES.IRepository).to(LokiRepo).inSingletonScope();
    break;
}

export default container;