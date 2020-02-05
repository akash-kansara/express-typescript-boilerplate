import { myContainer } from '../../di/di-config';
import { TYPES } from '../../di/types';

import IRepository from './definition';

let repository: IRepository = myContainer.get<IRepository>(TYPES.IRepository);

export default repository;