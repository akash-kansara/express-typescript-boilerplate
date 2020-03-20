import { TYPES } from './types';
import { Container } from 'inversify';

// Interface imports begin
import IUserService from '../service/user';
import IProductService from '../service/product';
import ISaleService from '../service/sale';
// Interface imports end

// Entity imports begin
import UserRepo from '../repository/user';
import ProductRepo from '../repository/product';
import SaleRepo from '../repository/sale';
// Entity imports end

const container = new Container();

container.bind<IUserService>(TYPES.UserRepo).to(UserRepo).inSingletonScope();
container.bind<IProductService>(TYPES.ProductRepo).to(ProductRepo).inSingletonScope();
container.bind<ISaleService>(TYPES.SaleRepo).to(SaleRepo).inSingletonScope();

export default container;