'use strict'

const chai = require('chai')
const Strategy = require('../src/strategy')


describe('strategy.fail:', function() {

	describe('failing authentication', function() {
		var strategy = new Strategy({secret: 'secret-key'}, function(_unused_instanceObj, done) {
			return done(null, false);
		});

		var info;

		before(function(done) {
			chai.passport.use(strategy)
				.fail(function(i) {
					info = i;
					done();
				})
				.req(function(req) {
					req.query = {};
					req.query.instance = 'tpGw1xFpNSgYi864LDXP1l208XhD71vNWQgKpbSK-pA.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9';
				})
				.authenticate();
		});

		it('should fail', function() {
			expect(info).to.be.undefined;
		});
	});

	describe('authentication with wrong digest', function() {
		var strategy = new Strategy({secret: 'secret-key'}, function(_unused_instanceObj, done) {
			return done(null, false);
		});

		var info;

		before(function(done) {
			chai.passport.use(strategy)
				.fail(function(i) {
					info = i;
					done();
				})
				.req(function(req) {
					req.query = {};
					req.query.instance = 'wrong-digest.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9';
				})
				.authenticate();
		});

		it('should fail', function() {
			expect(info).to.be.an('object');
			expect(info.message).to.equal('Invalid WIX-instance');
		});
	});

	describe('failing authentication with info', function() {
		var strategy = new Strategy({secret: 'secret-key'}, function(_unused_instanceObj, done) {
			return done(null, false, { message: 'authentication failed' });
		});

		var info;

		before(function(done) {
			chai.passport.use(strategy)
				.fail(function(i) {
					info = i;
					done();
				})
				.req(function(req) {
					req.query = {};
					req.query.instance = 'tpGw1xFpNSgYi864LDXP1l208XhD71vNWQgKpbSK-pA.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9';
				})
				.authenticate();
		});

		it('should fail', function() {
			expect(info).to.be.an('object');
			expect(info.message).to.equal('authentication failed');
		});
	});

	describe('handling a request without a query-string', function() {
		var strategy = new Strategy({secret: 'secret'}, function(/*instanceObj, done*/) {
			throw new Error('should not be called');
		});

		var info, status;

		before(function(done) {
			chai.passport.use(strategy)
				.fail(function(i, s) {
					info = i;
					status = s;
					done();
				})
				.authenticate();
		});

		it('should fail with info and status', function() {
			expect(info).to.be.an.object;
			expect(info.message).to.equal('Missing WIX-instance query-parameter');
			expect(status).to.equal(401);
		});
	});

	describe('handling a request with a query-string, but no "instance"', function() {
		var strategy = new Strategy({secret: 'secret'}, function(/*instanceObj, done*/) {
			throw new Error('should not be called');
		});

		var info, status;

		before(function(done) {
			chai.passport.use(strategy)
				.fail(function(i, s) {
					info = i;
					status = s;
					done();
				})
				.req(function(req) {
					req.query = {};
				})
				.authenticate();
		});

		it('should fail with info and status', function() {
			expect(info).to.be.an.object;
			expect(status).to.equal(401);
			expect(info.message).to.equal('Missing WIX-instance query-parameter');
		});
	});
});
