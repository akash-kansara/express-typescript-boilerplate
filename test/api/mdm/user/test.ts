import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
import { get } from 'lodash';
chai.use(chaiHttp);

import server from '../../../../src';

// Uncomment below line(s) to run this test file individually
// after((done) => { done(); process.exit(0); });

let username = 'root', password = 'root';

let tests = {
  add: {
    firstname: 'First',
    lastname: 'Last',
    email: 'first.last@example.com',
    dob: '1990-01-01'
  },
  update: {
    firstname: 'First',
    lastname: 'Lastname',
    email: 'first.last@example.com',
    dob: '1990-01-01'
  },
  badPayload: {
    firstname: 'First',
    lastname: 12345
  }
}

describe('MDM - User', () => {
  let authRes;
  before((done) => {
    chai.request(server)
      .get('/auth/login')
      .set('Authorization', `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`)
      .end((err, res) => {
        authRes = res;
        done();
      });
  });
  describe('/POST user', () => {
    it('it should add a user', (done) => {
      chai.request(server)
        .post('/mdm/user')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .send(tests.add)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('statusCode');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('description');
          expect(res.body.statusCode).to.equal('S_CTRL_S');
          done();
        });
    });
  });
  describe('/GET users', () => {
    it('it should get all the users', (done) => {
      chai.request(server)
        .get('/mdm/user')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          res.body = res.body.filter(e => e.email === tests.add.email)[0];
          expect(res.body.firstname).to.equal(tests.add.firstname);
          expect(res.body.lastname).to.equal(tests.add.lastname);
          done();
        });
    });
  });
  describe('/PUT user', () => {
    it('it should update a user', (done) => {
      chai.request(server)
        .put('/mdm/user')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .send(tests.update)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('statusCode');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('description');
          expect(res.body.statusCode).to.equal('S_CTRL_S');
          done();
        });
    });
  });
  describe('/GET user', () => {
    it('it should confirm updated details', (done) => {
      chai.request(server)
        .get('/mdm/user')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          res.body = res.body.filter(e => e.email === tests.update.email)[0];
          expect(res.body.firstname).to.equal(tests.update.firstname);
          expect(res.body.lastname).to.equal(tests.update.lastname);
          done();
        });
    });
  });
  describe('/POST user', () => {
    it('it should respond with bad payload', (done) => {
      chai.request(server)
        .post('/mdm/user')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .send(tests.badPayload)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('statusCode');
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('description');
          expect(res.body.statusCode).to.equal('S_PYLD_F');
          done();
        });
    });
  });
});