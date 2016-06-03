var request   = require('supertest-as-promised');
var expect    = require('expect.js');
var app       = require('../app.js');


describe('GET /', function () {

  it('parties', function (done) {
    request(app)
    .get('/api')
    .expect(200)
    .end(function(err,res) {
      expect(res.body.message).to.equal('i party');
      done()
    });
  });

});


describe('GET /users', function () {

  it('returns a list of users', function (done) {
    request(app)
    .post('/api/authenticate')
    .send({password: 'tool'})
    .expect(200)
    .then(function (res) {
      return request(app)
        .get('/api/users')
        .set({ 'x-access-token': res.body.token})
        .expect(200)
        .then(function (res) {
          expect(res.body.users.length).to.be.greaterThan(1);
          done()
        })
        .catch(function (e) {
          done(e)
        });
    });
  });

});



describe('it authenticates a user', function () {

  it('creates a token', function (done) {
    request(app)
    .post('/api/authenticate')
    .send({password: 'tool'})
    .expect(200)
    .end(function(err,res) {
      expect(res.body.success).to.be(true);
      expect(res.body.token).to.exist;
      expect(err).to.be(null);
      done()
    });
  });

  it('throws a 403 if no token is present', function (done) {
    request(app)
    .post('/api/sample')
    .send({garbage: 'eval'})
    .expect(403)
    .end(function(err,res) {
      expect(res.body.message).to.be('No token provided.');
      expect(res.body.success).to.be(false);
      done()
    });
  });

  it('returns users if given a valid token', function (done) {
      request(app)
      .post('/api/authenticate')
      .send({password: 'tool'})
      .expect(200)
      .then(function (res) {
        return request(app)
          .get('/api/sample')
          .set({ 'x-access-token': res.body.token})
          .expect(200)
          .then(function (res) {
            expect(res.body).to.eql({username: 'shed', pwd: 'tool'});
            done()
          })
          .catch(function (e) {
            done(e)
          })
      });
  });

});
