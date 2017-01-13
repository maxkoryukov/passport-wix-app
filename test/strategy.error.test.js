'use strict';

const chai = require('chai')
const Strategy = require('../src/strategy')


describe('strategy.error:', function() {

	describe('encountering an error during verification', function() {
		let strategy = new Strategy({
			secret: 'secret-key',
			passReqToCallback: true
		},
			function verificationCallback(_unused_req, _unused_instanceObj, done) {
				done(new Error('something went wrong'));
			})

		let err;

		before(function(done) {
			chai.passport.use(strategy)
				.error(function(e) {
					err = e;
					done();
				})
				.req(function(req) {
					req.query = {};
					req.query.instance = 'tpGw1xFpNSgYi864LDXP1l208XhD71vNWQgKpbSK-pA.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9';
				})
				.authenticate();
		});

		it('should error', function() {
			expect(err).to.be.an.instanceof(Error);
			expect(err.message).to.equal('something went wrong');
		});
	});

	describe('encountering an exception during verification', function() {
		var strategy = new Strategy({
			secret: 'secret-key',
			signDateThreshold: ()=> true
		}, function verificationCallback() {
			throw new Error('something went horribly wrong');
		});

		var err;

		before(function(done) {
			chai.passport.use(strategy)
				.error(function(e) {
					err = e;
					done();
				})
				.req(function(req) {
					req.query = {};
					req.query.instance = 'tpGw1xFpNSgYi864LDXP1l208XhD71vNWQgKpbSK-pA.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9';
				})
				.authenticate();
		});

		it('should error', function() {
			expect(err).to.be.an.instanceof(Error);
			expect(err.message).to.equal('something went horribly wrong');
		});
	});

	// describe('exception, when "secret" is not set', function() {
	// 	var strategy = new Strategy('key', function() {
	// 		throw new Error('should not be called');
	// 	});

	// 	var err;

	// 	before(function(done) {
	// 		chai.passport.use(strategy)
	// 			.error(function(e) {
	// 				err = e;
	// 				done();
	// 			})
	// 			.req(function(req) {
	// 				req.query = {};
	// 			})
	// 			.authenticate();
	// 	});

	// 	it('should error', function() {
	// 		expect(err).to.be.an.instanceof(Error);
	// 		expect(err.message).to.equal('secret is not set');
	// 	});
	// });
});
