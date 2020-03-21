export {};

function importTest(name, path) {
  describe(name, function () {
    require(path);
  });
}

describe('Controller tests', () => {
  importTest('BasicAuth controller', './basic-auth.ts');
});