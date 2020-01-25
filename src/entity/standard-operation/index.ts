import { IsString, IsOptional, validateSync } from 'class-validator';
import { get } from 'lodash';

export interface IStandardOP {
  statusCode: string;
  status: string;
  description: string;
  statusType: string;
  message?: undefined | string;
}

export class StandardOP implements IStandardOP {

  @IsString()
  public statusCode: string;

  @IsString()
  public status: string;

  @IsString()
  public description: string;

  @IsString()
  public statusType: string;

  @IsOptional()
  @IsString()
  public message?: undefined | string;

  public validate() { return validateSync(this); }

  constructor(statusCode: string, status: string, description: string, statusType: string, message?: undefined | string) {
    this.statusCode = statusCode;
    this.status = status;
    this.description = description;
    this.statusType = statusType;
    this.message = message;
  }

}

export class StandardSuccess extends StandardOP {
  constructor(statusCode: string, status: string, description: string, message?: undefined | string) {
    super(statusCode, status, description, 'S', message);
  }
}

export class StandardError extends StandardOP {
  constructor(statusCode: string, status: string, description: string, message?: undefined | string) {
    super(statusCode, status, description, 'F', message);
  }
}