import { expect } from 'chai';

import { container } from '../di';
import { TYPES } from '../../src/di/types';
import IProductService from '../../src/service/product';

import { StandardSuccess } from '../../src/entity/standard-operation';
import { RepoSuccess } from '../../src/core/repository/definition';
import { Product } from '../../src/entity/product';

const productRepo: IProductService = container.get<IProductService>(TYPES.ProductRepo);

const product = new Product({ code: 'xyzwef', name: 'name', tag: '', desc: 'desc', price: 500 });

describe('Product service repository', () => {
  it('it should fail to find the product', (done) => {
    productRepo.checkIfExists(product.code)
      .then()
      .catch(() => done());
  });
  it('it should create a product successfuly with RepoSuccess', () => {
    productRepo.create(product)
      .then((success: StandardSuccess) => {
        expect(success instanceof RepoSuccess).to.equal(true);
      });
  });
  it('it should find the product successfully', (done) => {
    productRepo.checkIfExists(product.code)
      .then(() => done())
      .catch();
  });
});