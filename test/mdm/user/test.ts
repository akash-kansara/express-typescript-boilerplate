import chai from 'chai';
import chaiHttp from 'chai-http';
import { get } from 'lodash';
chai.use(chaiHttp);
let should = chai.should();

import server from '../../../src';

before((done) => {
  setTimeout(() => { done(); }, 12000);
});

describe('MDM', () => {
  describe('/GET users', () => {
    it('it should GET all the users', (done) => {
      chai.request(server)
        .get('/auth/login')
        .set('Authorization', `Basic ${Buffer.from('root:root').toString('base64')}`)
        .end((err, authRes) => {
          chai.request(server)
            .get('/mdm/user')
            .set('Bearer', get(authRes.body, 'accessToken'))
            .end((err, res) => {
              (res).should.have.status(200);
              (res.body).should.be.a('array');
              done();
            });
        })
    });
  });
});

after((done) => { done(); process.exit(0); })