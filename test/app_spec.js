process.env.PORT = 3000;
const request    = require('supertest-as-promised');
const expect     = require('expect.js');
const app        = require('../app.js');
const mongoose 	 = require('mongoose');
const mockgoose  = require('mockgoose');
const User       = require('../models/user.js');


describe ('app', function () {

  before(function (done) {
    mockgoose(mongoose);
    done();
  });

  after(function (done) {
    mockgoose.reset();
    done();
  });

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

    before(function () {
      User.create({name: 'brady', pwd: 'stilwell'})
    });

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
              expect(res.body.users.length).to.be.greaterThan(0);
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
          expect(res.body).to.have.property('token');
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
              expect(res.body).to.eql({name: 'shed', pwd: 'tool'});
              done()
            })
            .catch(function (e) {
              done(e)
            })
        });
    });
  });

  describe('POST /users/new', function () {

    it('creates a user', function (done) {
      request(app)
        .post('/api/users/new')
        .send({name: 'brady', pwd: 'stilwell'})
        .end(function(err,res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.user.name).to.equal('brady');
          expect(res.body).to.have.property('token');
          done()
        });
    });

    it('throws an error if info is missing', function (done) {
      request(app)
        .post('/api/users/new')
        .send({name: 'brady'})
        .end(function(err,res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('errors');
          done()
        });
    });

  });

});
