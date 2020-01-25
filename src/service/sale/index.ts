import { Sale } from '../../entity/sale';
import { StandardError, StandardSuccess } from '../../entity/standard-operation';

export default interface ISaleService {

  create: (sale: Sale) => Promise<StandardError | StandardSuccess>;
  fetch: () => Promise<StandardError | Sale[]>;

}