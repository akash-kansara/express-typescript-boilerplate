import { IsString, IsNumber, validateSync, ValidationError, Min } from 'class-validator';
import { get } from 'lodash';

import { combineValidationError } from '../../core/entity';

export interface ISale {
  product_code: string;
  user_email: string;
  quantity: number;
}

export class Sale implements ISale {

  @IsString()
  public product_code: string;

  @IsString()
  public user_email: string;

  @IsNumber()
  @Min(1)
  public quantity: number;

  public validate(): ValidationError[] { return validateSync(this); }
  public validateErrMsg(): string { return combineValidationError(this); }

  constructor(obj: object) {
    this.product_code = get(obj, 'product_code');
    this.user_email = get(obj, 'user_email');
    this.quantity = get(obj, 'quantity');
  }

}