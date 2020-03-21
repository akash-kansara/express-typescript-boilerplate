import { expect } from 'chai';

import { container } from '../di';
import { TYPES } from '../../src/di/types';
import IBasicAuth from '../../src/service/basic-auth';

import { BasicAuthError, UserCredential } from '../../src/entity/basic-auth';

const basicAuth: IBasicAuth = container.get<IBasicAuth>(TYPES.BasicAuthController);

const badCred = new UserCredential('root', 'admin');
const goodCred = new UserCredential('admin', 'admin');

describe('Basic Auth service controller', () => {
  describe('Good credentials', () => {
    it('it should authenticate successfuly', () => {
      basicAuth.authenticate(goodCred)
        .then();
    });
  });
  describe('Bad credentials', () => {
    it('it should fail to authenticate with BasicAuthError', () => {
      basicAuth.authenticate(badCred)
        .then()
        .catch((error: BasicAuthError) => {
          expect(error instanceof BasicAuthError).to.equal(true);
        })
    });
  });
});