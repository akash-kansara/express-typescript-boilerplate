export {};

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

describe('API Tests', () => {
  // before((done) => {
  //   // Wait for server to start
  //   setTimeout(() => { done(); }, 3000);
  // });

  importTest('Auth Module', './auth/test.ts');
  importTest('User Module', './mdm/user/test.ts');
  importTest('Product Module', './mdm/product/test.ts');
  importTest('Sale Module', './sales/test.ts');
  importTest('Extras', './extras/test.ts');

  after((done) => {
    done(); process.exit(0);
  });
});