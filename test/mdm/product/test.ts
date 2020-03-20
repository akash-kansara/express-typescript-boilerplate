import chai from 'chai';
import chaiHttp from 'chai-http';
import { get } from 'lodash';
chai.use(chaiHttp);
let should = chai.should();

import server from '../../../src';

// Uncomment below line(s) to run this test file individually
// before((done) => {
//   setTimeout(() => { done(); }, 3000);
// });

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
          (res).should.have.status(200);
          (res.body).should.have.property('statusCode');
          (res.body).should.have.property('status');
          (res.body).should.have.property('description');
          (res.body.statusCode).should.equal('S_CTRL_S');
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
          (res).should.have.status(200);
          (res.body).should.be.a('array');
          res.body = res.body.filter(e => e.code === tests.add.code)[0];
          (res.body.name).should.equal(tests.add.name);
          (res.body.desc).should.equal(tests.add.desc);
          (res.body.price).should.equal(tests.add.price);
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
          (res).should.have.status(200);
          (res.body).should.have.property('statusCode');
          (res.body).should.have.property('status');
          (res.body).should.have.property('description');
          (res.body.statusCode).should.equal('S_CTRL_S');
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
          (res).should.have.status(200);
          (res.body).should.be.a('array');
          res.body = res.body.filter(e => e.code === tests.update.code)[0];
          (res.body.name).should.equal(tests.update.name);
          (res.body.desc).should.equal(tests.update.desc);
          (res.body.price).should.equal(tests.update.price);
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
          (res).should.have.status(400);
          (res.body).should.have.property('statusCode');
          (res.body).should.have.property('status');
          (res.body).should.have.property('description');
          (res.body.statusCode).should.equal('S_PYLD_F');
          done();
        });
    });
  });
});

// Uncomment below line(s) to run this test file individually
// after((done) => { done(); process.exit(0); })