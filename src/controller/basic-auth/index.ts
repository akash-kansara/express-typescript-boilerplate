import { get } from 'lodash';

import 'reflect-metadata';
import { injectable } from 'inversify';
import IBasicAuth from '../../service/basic-auth';

import { UserCredential, BasicAuthError } from '../../entity/basic-auth';

const users = [
  {
    username: 'admin',
    password: 'admin'
  },
  {
    username: 'root',
    password: 'root'
  }
];

if (process.env['NODE_ENV'] === 'dev') {
  console.log('LogIn credentials:');
  users.forEach((user) => {
    console.log(`username: ${get(user, 'username')}, password: ${get(user, 'password')}`);
  });
}

@injectable()
export default class BasicAuthController implements IBasicAuth {

  public async authenticate(userCred: UserCredential) {
    return new Promise<BasicAuthError | void>(async (resolve, reject) => {
      if (
        users.filter(
          (defUser) =>
            get(defUser, 'username') === userCred.userId &&
            get(defUser, 'password') === userCred.password
        ).length > 0
      ) {
        resolve();
      } else {
        reject(new BasicAuthError());
      }
    });
  }

}