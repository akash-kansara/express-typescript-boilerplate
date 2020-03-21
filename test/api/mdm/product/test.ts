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
    code: 'code',
    name: 'name',
    desc: 'description',
    tags: ['tag1', 'tag2'],
    price: 50.78
  },
  update: {
    code: 'code',
    name: 'name',
    desc: 'desc',
    tags: ['tag1', 'tag2'],
    price: 100.87
  },
  badPayload: {
    code: 'bad-code',
    tags: 12345
  }
}

describe('MDM - Product', () => {
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
  describe('/POST product', () => {
    it('it should add a product', (done) => {
      chai.request(server)
        .post('/mdm/product')
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
  describe('/GET products', () => {
    it('it should get all the products', (done) => {
      chai.request(server)
        .get('/mdm/product')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          res.body = res.body.filter(e => e.code === tests.add.code)[0];
          expect(res.body.name).to.equal(tests.add.name);
          expect(res.body.desc).to.equal(tests.add.desc);
          expect(res.body.price).to.equal(tests.add.price);
          done();
        });
    });
  });
  describe('/PUT product', () => {
    it('it should update a product', (done) => {
      chai.request(server)
        .put('/mdm/product')
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
  describe('/GET product', () => {
    it('it should confirm updated details', (done) => {
      chai.request(server)
        .get('/mdm/product')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('array');
          res.body = res.body.filter(e => e.code === tests.update.code)[0];
          expect(res.body.name).to.equal(tests.update.name);
          expect(res.body.desc).to.equal(tests.update.desc);
          expect(res.body.price).to.equal(tests.update.price);
          done();
        });
    });
  });
  describe('/POST product', () => {
    it('it should respond with bad payload', (done) => {
      chai.request(server)
        .post('/mdm/product')
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