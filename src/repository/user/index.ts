import { omit } from 'lodash';

import { User } from '../../entity/user';
import { RepoError, RepoSuccess } from '../../core/repository/definition';

import repository from '../../core/repository';

import IUserService from '../../service/user';

export default class UserRepo implements IUserService {

  public create(user: User) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      repository.insertOne('user_mst', user)
        .then(() => resolve(new RepoSuccess('User Created!')))
        .catch(() => reject(new RepoError('Failed to create user')));
    });
  }

  public fetch() {
    return new Promise<RepoError | User[]>((resolve, reject) => {
      repository.readMany('user_mst', {})
        .then((arr: void | object[]) => {
          const users: User[] = [];
          if (!Array.isArray(arr)) { arr = []; }
          arr.forEach((user) => {
            omit(user, '_id');
            users.push(new User(user));
          });
          resolve(users);
        })
        .catch(() => reject(new RepoError('Failed to fetch users')));
    });
  }

  public fetchOne(email: string) {
    return new Promise<RepoError | User>((resolve, reject) => {
      repository.readOne('user_mst', { email })
        .then((user: void | object) => {
          if (typeof user !== 'object') { user = {} as object; }
          omit(user, '_id');
          resolve(new User(user));
        })
        .catch(() => reject(new RepoError('Failed to find user')));
    });
  }

  public update(user: User) {
    return new Promise<RepoError | RepoSuccess>((resolve, reject) => {
      repository.updateOne('user_mst', { email: user.email }, user)
        .then(() => resolve(new RepoSuccess('User Updated!')))
        .catch(() => reject(new RepoError('Failed to update user')));
    });
  }

  public checkIfExists(email: string) {
    return new Promise<void>((resolve, reject) => {
      repository.checkIfExists('user_mst', { email })
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  public checkIfNotExists(email: string) {
    return new Promise<void>((resolve, reject) => {
      repository.checkIfNotExists('user_mst', { email } as object)
        .then(() => resolve())
        .catch(() => reject());
    });
  }

}