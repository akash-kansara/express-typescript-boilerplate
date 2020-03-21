import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
let should = chai.should();

import server from '../../../src';

// Uncomment below line(s) to run this test file individually
// before((done) => {
//   setTimeout(() => { done(); }, 3000);
// });

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
          (res).should.have.status(200);
          (res.body).should.have.property('accessToken');
          (res.body).should.have.property('refreshToken');
          (res.body.accessToken).should.be.a('string');
          (res.body.refreshToken).should.be.a('string');
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
          (res).should.have.status(401);
          (res.body).should.have.property('statusCode');
          (res.body).should.have.property('status');
          (res.body).should.have.property('description');
          (res.body.statusCode).should.equal('S_AUTHCN_F');
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
          (res).should.have.status(200);
          (res.body).should.have.property('accessToken');
          (res.body).should.have.property('refreshToken');
          (res.body.accessToken).should.be.a('string');
          (res.body.refreshToken).should.be.a('string');
          done();
        });
    });
  });
});

// Uncomment below line(s) to run this test file individually
// after((done) => { done(); process.exit(0); })