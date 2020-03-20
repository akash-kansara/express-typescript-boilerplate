const TYPES = {
  // Repo Definition
  IRepository: Symbol.for('IRepository'),

  // Service Definition
  IBasicAuth: Symbol.for('IBasicAuth'),
  IOAuth2: Symbol.for('IOAuth2'),
  IUserService: Symbol.for('IUserService'),
  IProductService: Symbol.for('IProductService'),
  ISaleService: Symbol.for('ISaleService'),

  // Service - Repo implementation
  ProductRepo: Symbol.for('ProductRepo'),
  UserRepo: Symbol.for('UserRepo'),
  SaleRepo: Symbol.for('SaleRepo'),

  // Service - Business Logic implementation
  BasicAuthController: Symbol.for('BasicAuthController'),
  OAuth2Controller: Symbol.for('OAuth2Controller'),
  ProductController: Symbol.for('ProductController'),
  UserController: Symbol.for('UserController'),
  SaleController: Symbol.for('SaleController')
};

export { TYPES };