import { validateSync, ValidationError } from 'class-validator';
import { get } from 'lodash';

function combineValidationError(obj: object): string {
  const message: string[] = [];
  const errors = validateSync(obj);
  errors.forEach((errorObj: ValidationError) => {
    Object.keys(errorObj.constraints).forEach((key) => { message.push(get(errorObj.constraints, key)); });
  });
  return message.join(', ');
}

export { combineValidationError };