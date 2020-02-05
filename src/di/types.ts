const TYPES = {
  IRepository: Symbol.for('IRepository'),

  IBasicAuth: Symbol.for('IBasicAuth'),
  IOAuth2: Symbol.for('IOAuth2'),

  BasicAuthController: Symbol.for('BasicAuthController'),
  OAuth2Controller: Symbol.for('OAuth2Controller')
};

export { TYPES };