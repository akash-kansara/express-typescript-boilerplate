import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import ISaleService from '../../service/sale';
import IUserService from '../../service/user';
import IProductService from '../../service/product';

import { StandardError, StandardSuccess } from '../../entity/standard-operation';
import { ControllerError, ControllerSuccess } from '../../core/controller/definition';
import { Sale } from '../../entity/sale';

@injectable()
export default class SaleController implements ISaleService {

  private service: ISaleService;
  private userService: IUserService;
  private productService: IProductService;

  constructor(
    @inject(TYPES.SaleRepo) service: ISaleService,
    @inject(TYPES.UserRepo) userService: IUserService,
    @inject(TYPES.ProductRepo) productService: IProductService
  ) {
    this.service = service;
    this.userService = userService;
    this.productService = productService;
  }

  public async create(sale: Sale) {
    return new Promise<StandardError | StandardSuccess>(async (resolve, reject) => {
      try {
        await this.userService.checkIfExists(sale.userEmail);
        await this.productService.checkIfExists(sale.productCode);
        this.service.create(sale)
          .then((success: StandardSuccess) => resolve(new ControllerSuccess(success.description)))
          .catch((error: StandardError) => reject(new ControllerError(error.description)));
      } catch (err) { reject(reject(new ControllerError('Either User or Product does not exist'))); }
    });
  }

  public fetch() {
    return new Promise<StandardError | Sale[]>(async (resolve, reject) => {
      this.service.fetch()
        .then((sales: StandardError | Sale[]) => {
          Array.isArray(sales) ?
            resolve(sales) : reject(new ControllerError('Failed to fetch sales'));
        })
        .catch((error: StandardError) => {
          reject(new ControllerError(error.description));
        });
    });
  }

}