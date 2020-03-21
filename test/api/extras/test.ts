import chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);
let should = chai.should();

import server from '../../../src';

// Uncomment below line(s) to run this test file individually
// before((done) => {
//   setTimeout(() => { done(); }, 3000);
// });

describe('HTTP Failure codes', () => {
  it('it should respond with 404 status code', (done) => {
    chai.request(server)
      .post('/fhjhdkfhjkdkfdhk')
      .send({})
      .end((err, res) => {
        (res).should.have.status(404);
        (res.body).should.have.property('statusCode');
        (res.body).should.have.property('status');
        (res.body).should.have.property('description');
        (res.body.statusCode).should.equal('S_API_F');
        done();
      });
  });
  it('it should respond with 403 status code', (done) => {
    chai.request(server)
      .post('/mdm/product')
      .send({})
      .end((err, res) => {
        (res).should.have.status(403);
        (res.body).should.have.property('statusCode');
        (res.body).should.have.property('status');
        (res.body).should.have.property('description');
        (res.body.statusCode).should.equal('S_AUTHZN_F');
        done();
      });
  });
});

// Uncomment below line(s) to run this test file individually
// after((done) => { done(); process.exit(0); })