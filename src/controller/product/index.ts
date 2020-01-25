import { StandardError, StandardSuccess } from '../../entity/standard-operation';
import { ControllerError, ControllerSuccess } from '../../core/controller/definition';
import { Product } from '../../entity/product';

import IProductService from '../../service/product';
import ProductRepo from '../../repository/product';

export default class ProductController implements IProductService {

  private service: IProductService = new ProductRepo();

  public async create(product: Product) {
    return new Promise<StandardError | StandardSuccess>(async (resolve, reject) => {
      try {
        await this.checkIfNotExists(product.code);
        this.service.create(product)
          .then((success: StandardSuccess) => resolve(new ControllerSuccess(success.description)))
          .catch((error: StandardError) => reject(new ControllerError(error.description)));
      } catch (err) { reject(new ControllerError('Product already exists')); }
    });
  }

  public fetch() {
    return new Promise<StandardError | Product[]>(async (resolve, reject) => {
      this.service.fetch()
        .then((products: StandardError | Product[]) => {
          Array.isArray(products) ?
            resolve(products) : reject(new ControllerError('Failed to fetch products'));
        })
        .catch((error: StandardError) => {
          reject(new ControllerError(error.description));
        });
    });
  }

  public fetchOne(code: string) {
    return new Promise<StandardError | Product>(async (resolve, reject) => {
      this.service.fetchOne(code)
        .then((product: StandardError | Product) => {
          resolve(product);
        })
        .catch((error: StandardError) => {
          reject(new ControllerError(error.description));
        });
    });
  }

  public update(product: Product) {
    return new Promise<StandardError | StandardSuccess>(async (resolve, reject) => {
      try {
        await this.checkIfExists(product.code);
        this.service.update(product)
          .then((success: StandardSuccess) => resolve(new ControllerSuccess(success.description)))
          .catch((error: StandardError) => reject(new ControllerError(error.description)));
      } catch (err) { reject(new ControllerError('Product not found')); }
    });
  }

  public checkIfExists(code: string) { return this.service.checkIfExists(code); }

  public checkIfNotExists(code: string) { return this.service.checkIfNotExists(code); }

}