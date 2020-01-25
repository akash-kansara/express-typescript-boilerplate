import { StandardError, StandardSuccess } from '../../entity/standard-operation';

export class ControllerError extends StandardError {
  constructor(description: string, message?: undefined | string) {
    super('S_CTRL_F', 'Business Logic failure', description, message);
  }
}

export class ControllerSuccess extends StandardSuccess {
  constructor(description: string, message?: undefined | string) {
    super('S_CTRL_S', 'Business Logic passed', description, message);
  }
}