import { TYPES } from '../../src/di/types';
import { Container } from 'inversify';

// Interface imports begin
import IUserService from '../../src/service/user';
import IProductService from '../../src/service/product';
import ISaleService from '../../src/service/sale';
// Interface imports end

// Entity imports begin
import UserRepo from '../../src/repository/user';
import ProductRepo from '../../src/repository/product';
import SaleRepo from '../../src/repository/sale';
// Entity imports end

const container = new Container();

container.bind<IUserService>(TYPES.UserRepo).to(UserRepo).inSingletonScope();
container.bind<IProductService>(TYPES.ProductRepo).to(ProductRepo).inSingletonScope();
container.bind<ISaleService>(TYPES.SaleRepo).to(SaleRepo).inSingletonScope();

export default container;