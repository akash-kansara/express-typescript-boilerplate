import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import IRepository from '../../core/repository/definition';

import { Product } from '../../entity/product';
import { RepoError, RepoSuccess } from '../../core/repository/definition';

import IProductService from '../../service/product';

@injectable()
export default class ProductRepo implements IProductService {

  private repository: IRepository;
  constructor(
    @inject(TYPES.IRepository) repository: IRepository
  ) {
    this.repository = repository;
  }

  public create(product: Product) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      this.repository.insertOne('product_mst', product)
        .then(() => resolve(new RepoSuccess('Product Created!')))
        .catch(() => reject(new RepoError('Failed to create product')));
    });
  }

  public fetch() {
    return new Promise<RepoError | Product[]>((resolve, reject) => {
      this.repository.readMany('product_mst', {})
        .then((arr: void | object[]) => {
          const products: Product[] = [];
          if (!Array.isArray(arr)) { arr = []; }
          arr.forEach((product) => {
            products.push(new Product(product));
          });
          resolve(products);
        })
        .catch(() => reject(new RepoError('Failed to fetch products')));
    });
  }

  public fetchOne(code: string) {
    return new Promise<RepoError | Product>((resolve, reject) => {
      this.repository.readOne('product_mst', { code })
        .then((product: void | object) => {
          if (typeof product !== 'object') { product = {} as object; }
          resolve(new Product(product));
        })
        .catch(() => reject(new RepoError('Failed to find product')));
    });
  }

  public update(product: Product) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      this.repository.updateOne('product_mst', { code: product.code }, product)
        .then(() => resolve(new RepoSuccess('Product Updated!')))
        .catch(() => reject(new RepoError('Failed to update product')));
    });
  }

  public checkIfExists(code: string) {
    return new Promise<void>((resolve, reject) => {
      this.repository.checkIfExists('product_mst', { code })
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  public checkIfNotExists(code: string) {
    return new Promise<void>((resolve, reject) => {
      this.repository.checkIfNotExists('product_mst', { code })
        .then(() => resolve())
        .catch(() => reject());
    });
  }

}