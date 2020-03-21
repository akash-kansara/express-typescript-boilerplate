import { TYPES } from '../../src/di/types';
import { Container } from 'inversify';

// Interface imports begin
import IRepository from '../../src/core/repository/definition';
// Interface imports end

// Entity imports begin
import LokiRepo from '../../src/core/repository/loki';
import MongoRepo from '../../src/core/repository/mongo';
import MySqlRepo from '../../src/core/repository/mysql';
// Entity imports end

const container = new Container();

container.bind<IRepository>(TYPES.IRepository).to(LokiRepo).inSingletonScope();

export default container;