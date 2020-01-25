import { BasicAuthError, UserCredential } from '../../entity/basic-auth';

export default interface IBasicAuth {

  authenticate: (user: UserCredential) => Promise<BasicAuthError | void>;

}