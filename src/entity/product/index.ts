import { IsString, MaxLength, validateSync, IsNumber, ValidationError } from 'class-validator';
import { get } from 'lodash';

import { combineValidationError } from '../../core/entity';

export interface IProduct {
  code: string;
  name: string;
  desc: string;
  tag: string;
  price: number;
}

export class Product implements IProduct {

  @IsString()
  @MaxLength(20)
  public code: string;

  @IsString()
  @MaxLength(20)
  public name: string;

  @IsString()
  public desc: string;

  @IsString()
  public tag: string;

  @IsNumber()
  public price: number;

  public validate(): ValidationError[] { return validateSync(this); }
  public validateErrMsg(): string { return combineValidationError(this); }

  constructor(obj: object) {
    this.code = get(obj, 'code');
    this.name = get(obj, 'name');
    this.desc = get(obj, 'desc');
    this.tag = get(obj, 'tag');
    this.price = get(obj, 'price');
  }

}