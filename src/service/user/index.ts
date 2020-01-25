import { User } from '../../entity/user';
import { StandardError, StandardSuccess } from '../../entity/standard-operation';

export default interface IUserService {

  create: (user: User) => Promise<StandardError | StandardSuccess>;
  fetch: () => Promise<StandardError | User[]>;
  fetchOne: (email: string) => Promise<StandardError | User>;
  update: (user: User) => Promise<StandardError | StandardSuccess>;
  checkIfExists: (email: string) => Promise<void>;
  checkIfNotExists: (email: string) => Promise<void>;

}