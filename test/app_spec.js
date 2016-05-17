var supertest   = require("supertest-as-promised");
var server    = supertest.agent("http://localhost:8080");
var expect    = require("expect.js");


describe('GET /', function() {

  it('parties', function(done) {
    server
      .get('/api')
      .expect(200)
      .end(function(err,res) {
        expect(res.body.message).to.equal("i party");
        done()
      });
  });
});

describe('it authenticates a user', function (){

  it('creates a token', function(done) {
    server
      .post('/api/authenticate')
      .send({password: 'tool'})
      .expect(200)
      .end(function(err,res) {
        expect(res.body.success).to.be(true);
        expect(res.body).to.include.keys('token');
        expect(err).to.be(null);
        done()
      });
  });

  it('throws a 403 if no token is present', function(done) {
    server
      .post('/api/sample')
      .send({garbage: 'eval'})
      .expect(403)
      .end(function(err,res) {
        expect(res.body.message).to.be('No token provided.');
        expect(res.body.success).to.be(false);
        done()
      });
  });

  it('returns users if given a valid token', function () {
    return server
      .post('/api/authenticate')
      .send({password: 'tool'})
      .expect(200)
      .then(function (res) {
        return server
          .get('/api/sample')
          .set({ 'x-access-token': res.body.token})
          .expect(200)
          .then(function (res) {
            expect(res.body).to.eql({
              username: 'shed',
              pwd: 'tool'
            })
          })
      })
  });
});
