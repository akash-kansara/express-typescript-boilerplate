export {};

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

describe('Repository tests', () => {
  importTest('Product repository', './product.ts');
});