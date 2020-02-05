import { sign, verify } from 'jsonwebtoken';
import { get } from 'lodash';

import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { Token, TokenError } from '../../entity/oauth2';

import IRepository from '../../core/repository/definition';
import IOAuth2 from '../../service/oauth2';
import { TYPES } from '../../di/types';

const tokenSchema = 'app-refresh-tokens';

@injectable()
export default class JwtController implements IOAuth2 {

  private repository: IRepository;
  constructor(
    @inject(TYPES.IRepository) repository: IRepository
  ) {
    this.repository = repository;
  }

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
        this.repository.insertOne(tokenSchema, { refreshToken }).then().catch();
      } catch (err) {
        reject(new TokenError());
      }
    });
  }

  public async refresh(refreshToken: string) {
    return new Promise<TokenError | Token>(async (resolve, reject) => {
      try {
        const queryToken = await this.repository.readOne(tokenSchema, { refreshToken });
        if (queryToken) {
          this.validate(refreshToken, process.env['APP.SECURITY.REFRESH_TOKEN_SECRET'] || '')
            .then((user: object) => this.generate(user))
            .then((token: TokenError | Token) => {
              resolve(token);
              this.repository.deleteOne('app-refresh-tokens', { refreshToken }).then().catch();
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