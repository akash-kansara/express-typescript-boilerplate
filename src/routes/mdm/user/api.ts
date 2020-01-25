import { Request, Response, NextFunction } from 'express';

import { StandardError, StandardSuccess } from '../../../entity/standard-operation';
import { PayloadError } from '../../../error-handler/definition';
import { User } from '../../../entity/user';

import IUserService from '../../../service/user';
import UserController from '../../../controller/user';

const repo: IUserService = new UserController();

function create(req: Request, res: Response, next: NextFunction) {
  const user = new User(req.body);
  const payloadErr = user.validateErrMsg();
  if (payloadErr.length > 0) {
    next(new PayloadError(payloadErr));
  } else {
    repo.create(user)
      .then((success: StandardSuccess) => {
        res.send(success);
      })
      .catch((error: StandardError) => {
        res.status(500).send(error);
      });
  }
}

function fetch(req: Request, res: Response, next: NextFunction) {
  repo.fetch()
    .then((users: StandardError | User[]) => {
      if (!Array.isArray(users)) { users = []; }
      res.send(users);
    })
    .catch((error: StandardError | User[]) => {
      res.status(500).send(error);
    });
}

function update(req: Request, res: Response, next: NextFunction) {
  const user = new User(req.body);
  const payloadErr = user.validateErrMsg();
  if (payloadErr.length > 0) {
    next(new PayloadError(payloadErr));
  } else {
    const user = new User(req.body);
    repo.update(user)
      .then((success: StandardSuccess) => {
        res.send(success);
      })
      .catch((error: StandardError) => {
        res.status(500).send(error);
      });
  }
}

export { create, fetch, update };