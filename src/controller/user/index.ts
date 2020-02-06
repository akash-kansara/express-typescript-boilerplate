import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import IUserService from '../../service/user';

import { StandardError, StandardSuccess } from '../../entity/standard-operation';
import { ControllerError, ControllerSuccess } from '../../core/controller/definition';
import { User } from '../../entity/user';

@injectable()
export default class UserController implements IUserService {

  private service: IUserService;
  constructor(
    @inject(TYPES.UserRepo) service: IUserService
  ) {
    this.service = service;
  }

  public async create(user: User) {
    return new Promise<StandardError | StandardSuccess>(async (resolve, reject) => {
      try {
        await this.checkIfNotExists(user.email);
        this.service.create(user)
          .then((success: StandardSuccess) => resolve(new ControllerSuccess(success.description)))
          .catch((error: StandardError) => reject(new ControllerError(error.description)));
      } catch (err) { reject(new ControllerError('User already exists')); }
    });
  }

  public fetch() {
    return new Promise<StandardError | User[]>(async (resolve, reject) => {
      this.service.fetch()
        .then((users: StandardError | User[]) => {
          Array.isArray(users) ?
            resolve(users) : reject(new ControllerError('Failed to fetch users'));
        })
        .catch((error: StandardError) => {
          reject(new ControllerError(error.description));
        });
    });
  }

  public fetchOne(email: string) {
    return new Promise<StandardError | User>(async (resolve, reject) => {
      this.service.fetchOne(email)
        .then((user: StandardError | User) => {
          resolve(user);
        })
        .catch((error: StandardError) => {
          reject(new ControllerError(error.description));
        });
    });
  }

  public update(user: User) {
    return new Promise<StandardError | StandardSuccess>(async (resolve, reject) => {
      try {
        await this.checkIfExists(user.email);
        this.service.update(user)
          .then((success: StandardSuccess) => resolve(new ControllerSuccess(success.description)))
          .catch((error: StandardError) => reject(new ControllerError(error.description)));
      } catch (err) { reject(new ControllerError('User not found')); }
    });
  }

  public checkIfExists(email: string) { return this.service.checkIfExists(email); }

  public checkIfNotExists(email: string) { return this.service.checkIfNotExists(email); }

}