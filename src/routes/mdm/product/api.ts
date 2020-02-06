import { Request, Response, NextFunction } from 'express';

import { container } from '../../../di';
import { TYPES } from '../../../di/types';
import IProductService from '../../../service/product';

import { StandardError, StandardSuccess } from '../../../entity/standard-operation';
import { PayloadError } from '../../../error-handler/definition';
import { Product } from '../../../entity/product';

const repo: IProductService = container.get<IProductService>(TYPES.ProductController);

function create(req: Request, res: Response, next: NextFunction) {
  const product = new Product(req.body);
  const payloadErr = product.validateErrMsg();
  if (payloadErr.length > 0) {
    next(new PayloadError(payloadErr));
  } else {
    repo.create(product)
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
    .then((products: StandardError | Product[]) => {
      if (!Array.isArray(products)) { products = []; }
      res.send(products);
    })
    .catch((error: StandardError | Product[]) => {
      res.status(500).send(error);
    });
}

function update(req: Request, res: Response, next: NextFunction) {
  const product = new Product(req.body);
  const payloadErr = product.validateErrMsg();
  if (payloadErr.length > 0) {
    next(new PayloadError(payloadErr));
  } else {
    repo.update(product)
      .then((success: StandardSuccess) => {
        res.send(success);
      })
      .catch((error: StandardError) => {
        res.status(500).send(error);
      });
  }
}

export { create, fetch, update };