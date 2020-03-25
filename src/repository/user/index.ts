import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import IRepository from '../../core/repository/definition';

import { User } from '../../entity/user';
import { RepoError, RepoSuccess } from '../../core/repository/definition';

import IUserService from '../../service/user';

@injectable()
export default class UserRepo implements IUserService {

  private repository: IRepository;
  constructor(
    @inject(TYPES.IRepository) repository: IRepository
  ) {
    this.repository = repository;
  }

  public create(user: User) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      this.repository.insertOne('user_mst', user)
        .then(() => resolve(new RepoSuccess('User Created!')))
        .catch(() => reject(new RepoError('Failed to create user')));
    });
  }

  public fetch() {
    return new Promise<RepoError | User[]>((resolve, reject) => {
      this.repository.readMany('user_mst', {})
        .then((arr: void | object[]) => {
          const users: User[] = [];
          if (!Array.isArray(arr)) { arr = []; }
          arr.forEach((user) => {
            users.push(new User(user));
          });
          resolve(users);
        })
        .catch(() => reject(new RepoError('Failed to fetch users')));
    });
  }

  public fetchOne(email: string) {
    return new Promise<RepoError | User>((resolve, reject) => {
      this.repository.readOne('user_mst', { email })
        .then((user: void | object) => {
          if (typeof user !== 'object') { user = {} as object; }
          resolve(new User(user));
        })
        .catch(() => reject(new RepoError('Failed to find user')));
    });
  }

  public update(user: User) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      this.repository.updateOne('user_mst', { email: user.email }, user)
        .then(() => resolve(new RepoSuccess('User Updated!')))
        .catch(() => reject(new RepoError('Failed to update user')));
    });
  }

  public checkIfExists(email: string) {
    return new Promise<void>((resolve, reject) => {
      this.repository.checkIfExists('user_mst', { email })
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  public checkIfNotExists(email: string) {
    return new Promise<void>((resolve, reject) => {
      this.repository.checkIfNotExists('user_mst', { email } as object)
        .then(() => resolve())
        .catch(() => reject());
    });
  }

}