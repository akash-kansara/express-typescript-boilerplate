const loki = require('lokijs');
import { get, set } from 'lodash';

import 'reflect-metadata';
import { injectable } from 'inversify';
import IRepository from '../definition';

import eventHandler from '../../../event';

@injectable()
class LokiRepository implements IRepository {

  public provider: string = 'LokiDB';
  public isConnected: boolean = false;
  private dbObj: any = new loki(process.env['REPOSITORY.LOKI.DB'] as string, { adapter: new loki.LokiMemoryAdapter() });

  constructor() {
    eventHandler.emit('repo-conn-s', this.provider, { db: process.env['REPOSITORY.LOKI.DB'] as string });
    this.isConnected = true;
    eventHandler.emit('repo-warn', `${this.provider} repository is a very unsafe database, use for development only!`);
    eventHandler.emit('repo-warn', `All CRUD operations will be lost on every restart`);
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        this.dbObj.deleteDatabase();
        eventHandler.emit('repo-disconn-s', this.provider);
        resolve();
      } else {
        reject();
        eventHandler.emit('repo-disconn-f', this.provider, 'Connection was not established');
      }
    });
  }

  public insertOne(schema: string, data: object): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        if (this.dbObj.getCollection(schema) === null) { this.dbObj.addCollection(schema); }
        const collection = this.dbObj.getCollection(schema);
        collection.insert(data);
        resolve();
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
        if (this.dbObj.getCollection(schema) === null) {
          const collection = this.dbObj.addCollection(schema);
          collection.insert(data);
          resolve();
        } else {
          const object = this.dbObj.getCollection(schema).findOne(filter);
          Object.keys(data).forEach((key) => { set(object, key, get(data, key)); });
          resolve();
        }
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
        if (this.dbObj.getCollection(schema) === null) {
          resolve([]);
        } else {
          const result = this.dbObj.getCollection(schema).find(filter);
          resolve(result);
        }
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
        if (this.dbObj.getCollection(schema) === null) {
          resolve();
        } else {
          const result = this.dbObj.getCollection(schema).findOne(filter);
          resolve(result);
        }
      } else {
        reject();
        eventHandler.emit(
          'repo-op-f',
          this.provider,
          'Read one',
          filter,
          'Connection was not established'
        );
      }
    });
  }

  public deleteOne(schema: string, filter: object): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        if (this.dbObj.getCollection(schema) === null) {
          resolve();
        } else {
          const obj = this.dbObj.getCollection(schema).findOne(filter);
          this.dbObj.getCollection(schema).remove(get(obj, '$loki'));
          resolve();
        }
      } else {
        reject();
        eventHandler.emit(
          'repo-op-f',
          this.provider,
          'Delete one',
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
            if (result === null || result === undefined) { reject(); }
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
            if (result === null || result === undefined) { resolve(); }
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

export default LokiRepository;