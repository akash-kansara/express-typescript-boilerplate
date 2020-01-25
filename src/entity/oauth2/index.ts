import { StandardError } from '../standard-operation';

export interface IToken {
  accessToken: string;
  refreshToken: string;
}

export class Token implements IToken {

  public accessToken: string;
  public refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

}

export class TokenError extends StandardError {
  constructor(description?: string, message?: string) {
    super(
      'OAUTH2_TOKEN_F',
      'Token error',
      description || 'Failed to generate token',
      message
    );
  }
}