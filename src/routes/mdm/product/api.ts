import { Request, Response, NextFunction } from 'express';

import { StandardError, StandardSuccess } from '../../../entity/standard-operation';
import { PayloadError } from '../../../error-handler/definition';
import { Product } from '../../../entity/product';

import IProductService from '../../../service/product';
import ProductController from '../../../controller/product';

const repo: IProductService = new ProductController();

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