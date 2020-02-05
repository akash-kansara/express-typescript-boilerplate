import { TYPES } from './types';
import { Container } from 'inversify';

// Interface imports begin
import IRepository from '../core/repository/definition';
// Interface imports end

// Entity imports begin
import LokiRepo from '../core/repository/loki';
import MongoRepo from '../core/repository/mongo';
// Entity imports end
 
const myContainer = new Container();

switch(process.env['REPOSITORY.DEFAULT']) {
  case 'MONGO':
    myContainer.bind<IRepository>(TYPES.IRepository).to(MongoRepo);
    break;
  case 'LOKI':
    myContainer.bind<IRepository>(TYPES.IRepository).to(LokiRepo);
    break;
  default:
    myContainer.bind<IRepository>(TYPES.IRepository).to(LokiRepo);
    break;
}
 
export { myContainer };