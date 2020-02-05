import { sign, verify } from 'jsonwebtoken';
import { get } from 'lodash';

import 'reflect-metadata';
import { injectable } from 'inversify';

import repository from '../../core/repository';
import { Token, TokenError } from '../../entity/oauth2';

import IOAuth2 from '../../service/oauth2';

const tokenSchema = 'app-refresh-tokens';

@injectable()
export default class JwtController implements IOAuth2 {

  public async generate(user: string | object) {
    return new Promise<TokenError | Token>(async (resolve, reject) => {
      try {
        const accessToken = sign(
          user,
          process.env['APP.SECURITY.ACCESS_TOKEN_SECRET'] || '',
          { expiresIn: '10m' }
        );
        const refreshToken = sign(
          user,
          process.env['APP.SECURITY.REFRESH_TOKEN_SECRET'] || '',
          { expiresIn: '1h' }
        );
        resolve(new Token(accessToken, refreshToken));
        repository.insertOne(tokenSchema, { refreshToken }).then().catch();
      } catch (err) {
        reject(new TokenError());
      }
    });
  }

  public async refresh(refreshToken: string) {
    return new Promise<TokenError | Token>(async (resolve, reject) => {
      try {
        const queryToken = await repository.readOne(tokenSchema, { refreshToken });
        if (queryToken) {
          this.validate(refreshToken, process.env['APP.SECURITY.REFRESH_TOKEN_SECRET'] || '')
            .then((user: object) => this.generate(user))
            .then((token: TokenError | Token) => {
              resolve(token);
              repository.deleteOne('app-refresh-tokens', { refreshToken }).then().catch();
            })
            .catch((error: TokenError) => reject(error));
        } else {
          reject(new TokenError('Refresh token expired'));
        }
      } catch (err) {
        reject(new TokenError());
      }
    });
  }

  public async validate(token: string, secretKey: string) {
    return new Promise<TokenError | object>(async (resolve, reject) => {
      verify(
        token,
        secretKey,
        (err, user) => {
          if (err) {
            reject(new TokenError('Inavlid / Expired token!'));
          } else {
            resolve({ username: get(user, 'username') });
          }
        }
      );
    });
  }

}