import { Token, TokenError } from '../../entity/oauth2';

export default interface IOauth2Service {

  generate: (user: string | object) => Promise<TokenError | Token>;
  refresh: (refreshToken: string) => Promise<TokenError | Token>;
  validate: (token: string, secretKey: string) => Promise<TokenError | string | object>;

}