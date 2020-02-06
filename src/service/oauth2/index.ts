import { Token, TokenError } from '../../entity/oauth2';

export default interface IOAuth2 {

  generate: (user: string | object) => Promise<TokenError | Token>;
  refresh: (refreshToken: string) => Promise<TokenError | Token>;
  validateAccessToken: (token: string) => Promise<TokenError | string | object>;
  validateRefreshToken: (token: string) => Promise<TokenError | string | object>;

}