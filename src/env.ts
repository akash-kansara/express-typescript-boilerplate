import dotenv from 'dotenv';
import commandLineArgs from 'command-line-args';
import { join } from 'path';
import { get } from 'lodash';

let cliArgs = {};

try {

  cliArgs = commandLineArgs([
    {
      name: 'NODE_ENV',
      alias: 'e',
      defaultValue: 'dev',
      type: String
    },
    {
      name: 'port',
      alias: 'p',
      type: Number
    },
    {
      name: 'repository',
      alias: 'r',
      type: String
    }
  ], { partial: true });
} catch (err) { throw err; }

const result = dotenv.config({
  path: join(__dirname, '..', 'env', `${get(cliArgs, 'NODE_ENV')}.env`)
});
if (result.error) { throw result.error; }