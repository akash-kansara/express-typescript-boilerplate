import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
let should = chai.should();

import server from '../../src';

before((done) => {
  setTimeout(() => { done(); }, 12000);
});

describe('Auth', () => {
  describe('/GET authorise', () => {
    it('it should authorise successfuly', (done) => {
      chai.request(server)
        .get('/auth/login')
        .set('Authorization', `Basic ${Buffer.from('root:root').toString('base64')}`)
        .end((err, authRes) => {
          (authRes.body).should.have.property('accessToken');
          (authRes.body).should.have.property('accessToken');
          (authRes.body.accessToken).should.be.a('string');
          (authRes.body.refreshToken).should.be.a('string');
          done();
        });
    });
  });
});

after((done) => { done(); process.exit(0); })