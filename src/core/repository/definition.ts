import { StandardError, StandardSuccess } from '../../entity/standard-operation';

interface IRepository {

  provider: string;

  isConnected: boolean;

  disconnect(): Promise<void>;

  insertOne(schema: string, data: object): Promise<void>;

  updateOne(schema: string, filter: object, data: object): Promise<void>;

  readMany(schema: string, filter: object): Promise<object[] | void>;

  readOne(schema: string, filter: object): Promise<object | void>;

  deleteOne(schema: string, filter: object): Promise<void>;

  checkIfExists(schema: string, filter: object): Promise<void>;

  checkIfNotExists(schema: string, filter: object): Promise<void>;

}

export class RepoError extends StandardError {
  constructor(description: string, message?: undefined | string) {
    super('S_RP_F', 'Repository operation failed', description, message);
  }
}

export class RepoSuccess extends StandardSuccess {
  constructor(description: string, message?: undefined | string) {
    super('S_RP_S', 'Repository operation successful', description, message);
  }
}

export default IRepository;