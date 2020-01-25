import { omit } from 'lodash';

import { Sale } from '../../entity/sale';
import { RepoError, RepoSuccess } from '../../core/repository/definition';

import repository from '../../core/repository';

import ISaleService from '../../service/sale';

export default class SaleRepo implements ISaleService {

  public create(sale: Sale) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      repository.insertOne('sale_mst', sale)
        .then(() => resolve(new RepoSuccess('Sale Created!')))
        .catch(() => reject(new RepoError('Failed to create sale')));
    });
  }

  public fetch() {
    return new Promise<RepoError | Sale[]>((resolve, reject) => {
      repository.readMany('sale_mst', {})
        .then((arr: void | object[]) => {
          const sales: Sale[] = [];
          if (!Array.isArray(arr)) { arr = []; }
          arr.forEach((sale) => {
            omit(sale, '_id');
            sales.push(new Sale(sale));
          });
          resolve(sales);
        })
        .catch(() => reject(new RepoError('Failed to fetch sales')));
    });
  }

}