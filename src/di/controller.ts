import { TYPES } from './types';
import { Container } from 'inversify';

// Interface imports begin
import IBasicAuth from '../service/basic-auth';
import IOAuth2 from '../service/oauth2';
import IUserService from '../service/user';
import IProductService from '../service/product';
import ISaleService from '../service/sale';
// Interface imports end

// Entity imports begin
import BasicAuthController from '../controller/basic-auth';
import JwtController from '../controller/jwt';
import UserController from '../controller/user';
import ProductController from '../controller/product';
import SaleController from '../controller/sale';
// Entity imports end

const container = new Container();

container.bind<IBasicAuth>(TYPES.BasicAuthController).to(BasicAuthController).inSingletonScope();
container.bind<IOAuth2>(TYPES.OAuth2Controller).to(JwtController).inSingletonScope();
container.bind<IUserService>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<IProductService>(TYPES.ProductController).to(ProductController).inSingletonScope();
container.bind<ISaleService>(TYPES.SaleController).to(SaleController).inSingletonScope();

export default container;