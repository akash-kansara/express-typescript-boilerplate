import { Product } from '../../entity/product';
import { StandardError, StandardSuccess } from '../../entity/standard-operation';

export default interface IProductService {

  create: (product: Product) => Promise<StandardError | StandardSuccess>;
  fetch: () => Promise<StandardError | Product[]>;
  fetchOne: (code: string) => Promise<StandardError | Product>;
  update: (product: Product) => Promise<StandardError | StandardSuccess>;
  checkIfExists: (code: string) => Promise<void>;
  checkIfNotExists: (code: string) => Promise<void>;

}