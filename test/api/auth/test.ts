import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
chai.use(chaiHttp);

import server from '../../../src';

// Uncomment below line(s) to run this test file individually
// after((done) => { done(); process.exit(0); });

let tests = {
  correctCred: {
    username: 'root',
    password: 'root'
  },
  incorrectCred: {
    username: 'admin',
    password: 'root'
  }
}

let authRes;

describe('Authenticate and Authorize', () => {
  describe('/GET Basic Auth', () => {
    it('it should authenticate successfuly', (done) => {
      chai.request(server)
        .get('/auth/login')
        .set('Authorization', `Basic ${Buffer.from(`${tests.correctCred.username}:${tests.correctCred.password}`).toString('base64')}`)
        .end((err, res) => {
          authRes = res.body;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('accessToken');
          expect(res.body).to.have.property('refreshToken');
          expect(res.body.accessToken).to.be.a('string');
          expect(res.body.refreshToken).to.be.a('string');
          done();
        });
    });
  });
  describe('/GET Basic Auth', () => {
    it('it should not authenticate', (done) => {
      chai.request(server)
        .get('/auth/login')
        .set('Authorization', `Basic ${Buffer.from(`${tests.incorrectCred.username}:${tests.incorrectCred.password}`).toString('base64')}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('statusCode');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('description');
          expect(res.body.statusCode).to.equal('S_AUTHCN_F');
          done();
        });
    });
  });
  describe('/GET Bearer Refresh Token', () => {
    it('it should refresh tokens', (done) => {
      chai.request(server)
        .get('/auth/refresh-token')
        .set('Bearer', authRes.refreshToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('accessToken');
          expect(res.body).to.have.property('refreshToken');
          expect(res.body.accessToken).to.be.a('string');
          expect(res.body.refreshToken).to.be.a('string');
          done();
        });
    });
  });
});