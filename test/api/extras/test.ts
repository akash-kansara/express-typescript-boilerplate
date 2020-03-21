import chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
chai.use(chaiHttp);

import server from '../../../src';

// Uncomment below line(s) to run this test file individually
// after((done) => { done(); process.exit(0); });

describe('HTTP Failure codes', () => {
  it('it should respond with 404 status code', (done) => {
    chai.request(server)
      .post('/fhjhdkfhjkdkfdhk')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('statusCode');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('description');
        expect(res.body.statusCode).to.equal('S_API_F');
        done();
      });
  });
  it('it should respond with 403 status code', (done) => {
    chai.request(server)
      .post('/mdm/product')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('statusCode');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('description');
        expect(res.body.statusCode).to.equal('S_AUTHZN_F');
        done();
      });
  });
});