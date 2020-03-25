import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import IRepository from '../../core/repository/definition';

import { Sale } from '../../entity/sale';
import { RepoError, RepoSuccess } from '../../core/repository/definition';

import ISaleService from '../../service/sale';

@injectable()
export default class SaleRepo implements ISaleService {

  private repository: IRepository;
  constructor(
    @inject(TYPES.IRepository) repository: IRepository
  ) {
    this.repository = repository;
  }

  public create(sale: Sale) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      this.repository.insertOne('sale_mst', sale)
        .then(() => resolve(new RepoSuccess('Sale Created!')))
        .catch(() => reject(new RepoError('Failed to create sale')));
    });
  }

  public fetch() {
    return new Promise<RepoError | Sale[]>((resolve, reject) => {
      this.repository.readMany('sale_mst', {})
        .then((arr: void | object[]) => {
          const sales: Sale[] = [];
          if (!Array.isArray(arr)) { arr = []; }
          arr.forEach((sale) => {
            sales.push(new Sale(sale));
          });
          resolve(sales);
        })
        .catch(() => reject(new RepoError('Failed to fetch sales')));
    });
  }

}