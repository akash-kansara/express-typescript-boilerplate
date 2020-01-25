import { omit } from 'lodash';

import { Product } from '../../entity/product';
import { RepoError, RepoSuccess } from '../../core/repository/definition';

import repository from '../../core/repository';

import IProductService from '../../service/product';

export default class ProductRepo implements IProductService {

  public create(product: Product) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      repository.insertOne('product_mst', product)
        .then(() => resolve(new RepoSuccess('Product Created!')))
        .catch(() => reject(new RepoError('Failed to create product')));
    });
  }

  public fetch() {
    return new Promise<RepoError | Product[]>((resolve, reject) => {
      repository.readMany('product_mst', {})
        .then((arr: void | object[]) => {
          const products: Product[] = [];
          if (!Array.isArray(arr)) { arr = []; }
          arr.forEach((product) => {
            omit(product, '_id');
            products.push(new Product(product));
          });
          resolve(products);
        })
        .catch(() => reject(new RepoError('Failed to fetch products')));
    });
  }

  public fetchOne(code: string) {
    return new Promise<RepoError | Product>((resolve, reject) => {
      repository.readOne('product_mst', { code })
        .then((product: void | object) => {
          if (typeof product !== 'object') { product = {} as object; }
          omit(product, '_id');
          resolve(new Product(product));
        })
        .catch(() => reject(new RepoError('Failed to find product')));
    });
  }

  public update(product: Product) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      repository.updateOne('product_mst', { code: product.code }, product)
        .then(() => resolve(new RepoSuccess('Product Updated!')))
        .catch(() => reject(new RepoError('Failed to update product')));
    });
  }

  public checkIfExists(code: string) {
    return new Promise<void>((resolve, reject) => {
      repository.checkIfExists('product_mst', { code })
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  public checkIfNotExists(code: string) {
    return new Promise<void>((resolve, reject) => {
      repository.checkIfNotExists('product_mst', { code })
        .then(() => resolve())
        .catch(() => reject());
    });
  }

}