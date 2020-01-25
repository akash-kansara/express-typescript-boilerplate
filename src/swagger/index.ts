import Router from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { set } from 'lodash';
import * as swaggerUi from 'swagger-ui-express';

const router = Router();

const swaggerDoc: object = JSON.parse(readFileSync(join(__dirname, 'swagger.json'), { encoding: 'utf-8' }));

set(swaggerDoc, 'host', `${process.env['APP.HOST']}:${process.env['APP.PORT']}`);
set(swaggerDoc, 'schemes', [process.env['APP.SCHEME']]);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
router.use('/api-docs.json', (req, res) => { res.json(swaggerDoc).end(); });

export default router;