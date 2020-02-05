import { TYPES } from './types';
import { Container } from 'inversify';

// Interface imports begin
import IRepository from '../core/repository/definition';

import IBasicAuth from '../service/basic-auth';
import IOAuth2 from '../service/oauth2';
// Interface imports end

// Entity imports begin
import LokiRepo from '../core/repository/loki';
import MongoRepo from '../core/repository/mongo';

import BasicAuthController from '../controller/basic-auth';
import JwtController from '../controller/jwt';
// Entity imports end
 
const myContainer = new Container();

switch(process.env['REPOSITORY.DEFAULT']) {
  case 'MONGO':
    myContainer.bind<IRepository>(TYPES.IRepository).to(MongoRepo).inSingletonScope();
    break;
  case 'LOKI':
    myContainer.bind<IRepository>(TYPES.IRepository).to(LokiRepo).inSingletonScope();
    break;
  default:
    myContainer.bind<IRepository>(TYPES.IRepository).to(LokiRepo).inSingletonScope();
    break;
}

myContainer.bind<IBasicAuth>(TYPES.BasicAuthController).to(BasicAuthController)
myContainer.bind<IOAuth2>(TYPES.OAuth2Controller).to(JwtController)

export { myContainer };