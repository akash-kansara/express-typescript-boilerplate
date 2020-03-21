import Knex from 'knex';
import { get } from 'lodash';

import 'reflect-metadata';
import { injectable } from 'inversify';
import IRepository from '../definition';

import eventHandler from '../../../event';

@injectable()
class MySqlRepository implements IRepository {

  public provider: string = 'MySql';
  public isConnected: boolean = false;
  private connection: any = {
    database: process.env['REPOSITORY.MYSQL.DATABASE'] as string,
    user: process.env['REPOSITORY.MYSQL.USER'] as string,
    password: process.env['REPOSITORY.MYSQL.PASSWORD'] as string,
  };
  private dbObj: Knex = Knex({
    client: 'mysql',
    connection: this.connection
  });

  constructor() {
    eventHandler.emit('repo-conn-s', this.provider, this.connection);
    this.isConnected = true;
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        this.dbObj.destroy(() => {
          eventHandler.emit('repo-disconn-s', this.provider);
          this.isConnected = false;
          resolve();
        });
      } else {
        reject();
        eventHandler.emit('repo-disconn-f', this.provider, 'Connection was not established');
      }
    });
  }

  public insertOne(schema: string, data: object): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        const table = this.dbObj.table(schema);
        table.insert(data)
          .then((result: any) => {
            resolve();
          })
          .catch((error: object) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Insert One',
              data,
              `SQL message was ${get(error, 'sqlMessage')}`
            );
          });
      } else {
        reject();
        eventHandler.emit(
          'repo-op-f',
          this.provider,
          'Insert One',
          data,
          'Connection was not established'
        );
      }
    });
  }

  public updateOne(schema: string, filter: object, data: object): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        const table = this.dbObj.table(schema);
        table.where(filter).update(data)
          .then((count: number) => {
            if (count === 1) { resolve(); }
            else {
              reject();
              eventHandler.emit(
                'repo-op-f',
                this.provider,
                'Update One',
                data,
                `Update count was ${count}`
              );
            }
          })
          .catch((error: any) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Update One',
              data,
              `SQL message was ${get(error, 'sqlMessage')}`
            );
          });
      } else {
        reject();
        eventHandler.emit(
          'repo-op-f',
          this.provider,
          'Update One',
          data,
          'Connection was not established'
        );
      }
    });
  }

  public readMany(schema: string, filter: object): Promise<void | object[]> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        const table = this.dbObj.table(schema);
        table.where(filter).select()
          .then((result: object[]) => {
            resolve(result);
          })
          .catch((error: any) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Read many',
              filter,
              `SQL message was ${get(error, 'sqlMessage')}`
            );
          });
      } else {
        reject();
        eventHandler.emit(
          'repo-op-f',
          this.provider,
          'Read many',
          filter,
          'Connection was not established'
        );
      }
    });
  }

  public readOne(schema: string, filter: object): Promise<void | object> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        const table = this.dbObj.table(schema);
        table.where(filter).select().limit(1)
          .then((result: object[]) => {
            resolve(result[0]);
          })
          .catch((error: any) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Read many',
              filter,
              `SQL message was ${get(error, 'sqlMessage')}`
            );
          });
      } else {
        reject();
        eventHandler.emit(
          'repo-op-f',
          this.provider,
          'Read many',
          filter,
          'Connection was not established'
        );
      }
    });
  }

  public deleteOne(schema: string, filter: object): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        const table = this.dbObj.table(schema);
        table.where(filter).del()
          .then((count: number) => {
            if (count === 1) { resolve(); }
            else {
              reject();
              eventHandler.emit(
                'repo-op-f',
                this.provider,
                'Delete One',
                filter,
                `Deleted count was ${count}`
              );
            }
          })
          .catch((error: any) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Delete one',
              filter,
              `SQL message was ${get(error, 'sqlMessage')}`
            );
          });
      } else {
        reject();
        eventHandler.emit(
          'repo-op-f',
          this.provider,
          'Update One',
          filter,
          'Connection was not established'
        );
      }
    });
  }

  public checkIfExists(schema: string, filter: object): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        this.readOne(schema, filter)
          .then((result: any) => {
            if (result === undefined  || result === null) { reject(); }
            else { resolve(); }
          })
          .catch(() => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Check if exists',
              filter,
              'Failed while reading record'
            );
          });
      } else {
        reject();
        eventHandler.emit(
          'repo-op-f',
          this.provider,
          'Check if exists',
          filter,
          'Connection was not established'
        );
      }
    });
  }

  public checkIfNotExists(schema: string, filter: object): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        this.readOne(schema, filter)
          .then((result: any) => {
            if (result === undefined  || result === null) { resolve(); }
            else { reject(); }
          })
          .catch(() => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Check if exists',
              filter,
              'Failed while reading record'
            );
          });
      } else {
        reject();
        eventHandler.emit(
          'repo-op-f',
          this.provider,
          'Check if not exists',
          filter,
          'Connection was not established'
        );
      }
    });
  }

}

export default MySqlRepository;