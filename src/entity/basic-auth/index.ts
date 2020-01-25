import { StandardError } from '../standard-operation';

export interface IAuth {
  userId: string;
  password: string;
}

export class UserCredential implements IAuth {

  public userId: string;
  public password: string;

  constructor(userId: string, password: string) {
    this.userId = userId;
    this.password = password;
  }

}

export class BasicAuthError extends StandardError {
  constructor(description?: string, message?: string) {
    super(
      'AUTH_F',
      'Authentication error',
      description || 'Bad credentials',
      message
    );
  }
}