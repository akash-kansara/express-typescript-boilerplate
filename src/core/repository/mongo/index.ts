import { MongoClient, MongoError, MongoClientOptions, InsertOneWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject } from 'mongodb';

import 'reflect-metadata';
import { injectable } from 'inversify';
import IRepository from '../definition';

import eventHandler from '../../../event';

@injectable()
class MongoRepository implements IRepository {

  public provider: string = 'MongoDB';
  public isConnected: boolean = false;
  private dbObj: MongoClient = new MongoClient(
    process.env['REPOSITORY.MONGO.CONNSTR'] as string,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    } as MongoClientOptions
  );

  constructor() {
    this.dbObj.connect()
      .then(() => {
        eventHandler.emit('repo-conn-s', this.provider, process.env['REPOSITORY.MONGO.CONNSTR'] as string);
        this.isConnected = true;
      })
      .catch((error) => {
        eventHandler.emit('repo-conn-f', this.provider, process.env['REPOSITORY.MONGO.CONNSTR'] as string, error);
      });
  }

  public disconnect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        this.dbObj.close(() => {
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
        const collection = this.dbObj.db().collection(schema);
        collection.insertOne(data)
          .then((result: InsertOneWriteOpResult<any>) => {
            if (result.insertedCount === 1) { resolve(); }
            else {
              reject();
              eventHandler.emit(
                'repo-op-f',
                this.provider,
                'Insert One',
                data,
                `Insert count was  ${result.insertedCount}`
              );
            }
          })
          .catch((error: MongoError) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Insert One',
              data,
              error
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
        const collection = this.dbObj.db().collection(schema);
        collection.updateOne(filter, { $set: data })
          .then((result: UpdateWriteOpResult) => {
            if (result.upsertedCount === 1) { resolve(); }
            else {
              reject();
              eventHandler.emit(
                'repo-op-f',
                this.provider,
                'Update One',
                data,
                `Upserted count was  ${result.upsertedCount}`
              );
            }
          })
          .catch((error: MongoError) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Update One',
              data,
              error
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
        const collection = this.dbObj.db().collection(schema);
        collection.find(filter).toArray()
          .then((result: object[]) => {
            resolve(result);
          })
          .catch((error: MongoError) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Read many',
              filter,
              error
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
        const collection = this.dbObj.db().collection(schema);
        collection.findOne(filter)
          .then((result: object) => {
            resolve(result);
          })
          .catch((error: MongoError) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Read one',
              filter,
              error
            );
          });
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
        const collection = this.dbObj.db().collection(schema);
        collection.deleteOne(filter)
          .then((result: DeleteWriteOpResultObject) => {
            if (result.deletedCount === 1) { resolve(); }
            else {
              reject();
              eventHandler.emit(
                'repo-op-f',
                this.provider,
                'Delete One',
                filter,
                `Deleted count was  ${result.deletedCount}`
              );
            }
          })
          .catch((error: MongoError) => {
            reject();
            eventHandler.emit(
              'repo-op-f',
              this.provider,
              'Delete one',
              filter,
              error
            );
          });
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
            if (result === null) { reject(); }
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
            if (result === null) { resolve(); }
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

export default MongoRepository;