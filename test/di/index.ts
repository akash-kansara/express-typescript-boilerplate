import { Container } from 'inversify';

import coreRepoContainer from './core-repository';
import controllerContainer from './controller';
import repositoryContainer from './repository';

let container = Container.merge(new Container(), coreRepoContainer);
container = Container.merge(container, repositoryContainer);
container = Container.merge(container, controllerContainer);

export { container };