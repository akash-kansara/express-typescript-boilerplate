import { Request, Response, NextFunction } from 'express';

import { container } from '../../di';
import { TYPES } from '../../di/types';
import ISaleService from '../../service/sale';

import { StandardError, StandardSuccess } from '../../entity/standard-operation';
import { PayloadError } from '../../error-handler/definition';
import { Sale } from '../../entity/sale';

const controller: ISaleService = container.get<ISaleService>(TYPES.SaleController);

function create(req: Request, res: Response, next: NextFunction) {
  const sale = new Sale(req.body);
  const payloadErr = sale.validateErrMsg();
  if (payloadErr.length > 0) {
    next(new PayloadError(payloadErr));
  } else {
    controller.create(sale)
      .then((success: StandardSuccess) => {
        res.send(success);
      })
      .catch((error: StandardError) => {
        res.status(500).send(error);
      });
  }
}

function fetch(req: Request, res: Response, next: NextFunction) {
  controller.fetch()
    .then((sales: StandardError | Sale[]) => {
      if (!Array.isArray(sales)) { sales = []; }
      res.send(sales);
    })
    .catch((error: StandardError | Sale[]) => {
      res.status(500).send(error);
    });
}

export { create, fetch };