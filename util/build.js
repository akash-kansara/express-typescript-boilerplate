const fs = require('fs-extra');
const path = require('path');
const childProcess = require('child_process');


try {
  fs.removeSync('./dist/');
  childProcess.exec('tsc --build tsconfig.prod.json', (error, stdout, stderr) => {
    if(error || stderr.length > 0) { throw error || stderr; }
    else {
      fs.copySync(
        path.join('src', 'swagger', 'swagger.json'),
        path.join('dist', 'swagger', 'swagger.json')
      );
    }
  });
} catch (err) {
  console.log(err);
}
