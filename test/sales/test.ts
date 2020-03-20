import chai from 'chai';
import chaiHttp from 'chai-http';
import { get } from 'lodash';
chai.use(chaiHttp);
let should = chai.should();

import server from '../../src';

// Uncomment below line(s) to run this test file individually
// before((done) => {
//   setTimeout(() => { done(); }, 3000);
// });

let username = 'root', password = 'root';

let tests = {
  user: {
    firstname: 'Sales',
    lastname: 'Tester',
    email: 'sales.tester@example.com',
    dob: '1995-09-09'
  },
  product: {
    code: 'product.code',
    name: 'Product Name',
    desc: 'description',
    tags: ['tag1'],
    price: 90
  },
  add: {
    productCode: 'product.code',
    userEmail: 'sales.tester@example.com',
    quantity: 50
  },
  badPayload: {
    productCode: 'product.code',
    userEmail: 'sales.tester@example.com',
    quantity: 50.78
  },
  logicFailOne: {
    productCode: 'dfgdfghgdhfgdf',
    userEmail: 'sales.tester@example.com',
    quantity: 50
  },
  logicFailTwo: {
    productCode: 'product.code',
    userEmail: 'djashkjdhkjsakdhskajd@example.com',
    quantity: 50
  }
}

describe('Sale', () => {
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
  before((done) => {
    chai.request(server)
      .post('/mdm/user')
      .set('Bearer', get(authRes.body, 'accessToken'))
      .send(tests.user)
      .end((err, res) => {
        done();
      });
  });
  before((done) => {
    chai.request(server)
      .post('/mdm/product')
      .set('Bearer', get(authRes.body, 'accessToken'))
      .send(tests.product)
      .end((err, res) => {
        done();
      });
  });
  describe('/POST sale', () => {
    it('it should post a sale transaction', (done) => {
      chai.request(server)
        .post('/sales/post')
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
  describe('/GET sales', () => {
    it('it should get all the sales', (done) => {
      chai.request(server)
        .get('/sales')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .end((err, res) => {
          (res).should.have.status(200);
          (res.body).should.be.a('array');
          res.body = res.body.filter((e) => {
            return e.productCode === tests.add.productCode && e.userEmail === tests.add.userEmail
          });
          (res.body.length > 0).should.equal(true);
          done();
        });
    });
  });
  describe('/POST sale', () => {
    it('it should respond with bad payload', (done) => {
      chai.request(server)
        .post('/sales/post')
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
  describe('/POST sale', () => {
    it('it should respond with controller failure', (done) => {
      chai.request(server)
        .post('/sales/post')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .send(tests.logicFailOne)
        .end((err, res) => {
          (res).should.have.status(500);
          (res.body).should.have.property('statusCode');
          (res.body).should.have.property('status');
          (res.body).should.have.property('description');
          (res.body.statusCode).should.equal('S_CTRL_F');
          done();
        });
    });
    it('it should respond with controller failure', (done) => {
      chai.request(server)
        .post('/sales/post')
        .set('Bearer', get(authRes.body, 'accessToken'))
        .send(tests.logicFailTwo)
        .end((err, res) => {
          (res).should.have.status(500);
          (res.body).should.have.property('statusCode');
          (res.body).should.have.property('status');
          (res.body).should.have.property('description');
          (res.body.statusCode).should.equal('S_CTRL_F');
          done();
        });
    });
  });
});

// Uncomment below line(s) to run this test file individually
// after((done) => { done(); process.exit(0); })