'use strict'

const chai = require('chai')
const Strategy = require('../src/strategy')


describe('strategy.auth.options', function() {

	describe('handling a request without query-string, with message option to authenticate', function() {
		const strategy = new Strategy({secret: 'secret'}, function() {
			throw new Error('should not be called');
		});

		let info, status;

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
				.authenticate({badRequestMessage: 'Something is wrong with this request' });
		});

		it('should fail with info and status', function() {
			expect(info).to.be.an.object;
			expect(info.message).to.equal('Something is wrong with this request');
			expect(status).to.equal(401);
		});
	});

});
