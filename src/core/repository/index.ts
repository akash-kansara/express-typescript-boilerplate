import IRepository from './definition';
import MongoRepo from './mongo';
import LokiRepo from './loki';

let repository: IRepository = new LokiRepo();

switch (process.env['REPOSITORY.DEFAULT']) {
  case 'MONGO':
    repository.disconnect();
    repository = new MongoRepo();
    break;
  case 'LOKI':
    // DEFAULT CASE ALREADY DONE
    break;
}

export default repository;