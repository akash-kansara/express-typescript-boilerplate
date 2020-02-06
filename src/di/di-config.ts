import { TYPES } from './types';
import { Container } from 'inversify';

// Interface imports begin
import IRepository from '../core/repository/definition';

import IBasicAuth from '../service/basic-auth';
import IOAuth2 from '../service/oauth2';
import IUserService from '../service/user';
import IProductService from '../service/product';
import ISaleService from '../service/sale';
// Interface imports end

// Entity imports begin
// Service - Repo implementation
import LokiRepo from '../core/repository/loki';
import MongoRepo from '../core/repository/mongo';

import UserRepo from '../repository/user';
import ProductRepo from '../repository/product';
import SaleRepo from '../repository/sale';

// Service - Business Logic implementation
import BasicAuthController from '../controller/basic-auth';
import JwtController from '../controller/jwt';
import UserController from '../controller/user';
import ProductController from '../controller/product';
import SaleController from '../controller/sale';
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

myContainer.bind<IUserService>(TYPES.UserRepo).to(UserRepo).inSingletonScope();
myContainer.bind<IProductService>(TYPES.ProductRepo).to(ProductRepo).inSingletonScope();
myContainer.bind<ISaleService>(TYPES.SaleRepo).to(SaleRepo).inSingletonScope();

myContainer.bind<IBasicAuth>(TYPES.BasicAuthController).to(BasicAuthController).inSingletonScope();
myContainer.bind<IOAuth2>(TYPES.OAuth2Controller).to(JwtController).inSingletonScope();
myContainer.bind<IUserService>(TYPES.UserController).to(UserController).inSingletonScope();
myContainer.bind<IProductService>(TYPES.ProductController).to(ProductController).inSingletonScope();
myContainer.bind<ISaleService>(TYPES.SaleController).to(SaleController).inSingletonScope();

export { myContainer };