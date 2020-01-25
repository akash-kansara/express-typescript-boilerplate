import { StandardError, StandardSuccess } from '../../entity/standard-operation';
import { ControllerError, ControllerSuccess } from '../../core/controller/definition';
import { Sale } from '../../entity/sale';

import ISaleService from '../../service/sale';
import SaleRepo from '../../repository/sale';

import UserService from '../user';
import ProductService from '../product';

export default class SaleController implements ISaleService {

  private service: ISaleService = new SaleRepo();

  private userService = new UserService();
  private productService = new ProductService();

  public async create(sale: Sale) {
    return new Promise<StandardError | StandardSuccess>(async (resolve, reject) => {
      try {
        await this.userService.checkIfExists(sale.user_email);
        await this.productService.checkIfExists(sale.product_code);
        this.service.create(sale)
          .then((success: StandardSuccess) => resolve(new ControllerSuccess(success.description)))
          .catch((error: StandardError) => reject(new ControllerError(error.description)));
      } catch (err) { reject(err); }
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