export {};

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

describe('API Tests', () => {
  importTest('Auth Module', './auth/test.ts');
  importTest('User Module', './mdm/user/test.ts');
  importTest('Product Module', './mdm/product/test.ts');
  importTest('Sale Module', './sales/test.ts');
  importTest('Extras', './extras/test.ts');
  after((done) => {
    done(); process.exit(0);
  });
});