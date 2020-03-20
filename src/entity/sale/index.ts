import { IsString, IsInt, validateSync, ValidationError, Min } from 'class-validator';
import { get } from 'lodash';

import { combineValidationError } from '../../core/entity';

export interface ISale {
  productCode: string;
  userEmail: string;
  quantity: number;
}

export class Sale implements ISale {

  @IsString()
  public productCode: string;

  @IsString()
  public userEmail: string;

  @IsInt()
  @Min(1)
  public quantity: number;

  public validate(): ValidationError[] { return validateSync(this); }
  public validateErrMsg(): string { return combineValidationError(this); }

  constructor(obj: object) {
    this.productCode = get(obj, 'productCode');
    this.userEmail = get(obj, 'userEmail');
    this.quantity = get(obj, 'quantity');
  }

}