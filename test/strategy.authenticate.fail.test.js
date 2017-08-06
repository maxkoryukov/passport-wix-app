'use strict'

const chai = require('chai')
const Strategy = require('../')


describe('strategy.authenticate.fail', function() {

	describe('when verification callback returns FALSE', function() {
		const strategy = new Strategy({
			secret: 'secret-key',
			passReqToCallback: true,
			signDateThreshold: ()=> true
		}, function verificationCallback(_unused_req, _unused_instanceObj, done) {
			return done(null, false)
		})

		let info

		before(function(done) {
			chai.passport.use(strategy)
				.fail(function(i) {
					info = i
					done()
				})
				.req(function(req) {
					req.query = {}
					req.query.instance = 'tpGw1xFpNSgYi864LDXP1l208XhD71vNWQgKpbSK-pA.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9'
				})
				.authenticate()
		});

		it('should fail', function() {
			expect(info).to.be.undefined
		})
	})

	// use only primitive, printable values for FN
	const testCases = [
		{msg: 'numeric', fn: 1},
		{msg: 'boolean', fn: true},
	]

	testCases.forEach(tc => {
		describe(`when signDateThreshold is ${tc.msg} [${tc.fn}] and request is outdated`, function() {
			let info, status

			before(function(done) {
				const strategy = new Strategy({
					secret: 'secret-key',
					signDateThreshold: tc.fn
				}, function verificationCallback(_unused_req, _unused_instanceObj, _unused_done) {
					throw new Error('should not be called')
				})

				chai.passport.use(strategy)
					.fail(function(i, s) {
						info = i
						status = s
						done()
					})
					.req(function(req) {
						req.query = {}
						req.query.instance = 'tpGw1xFpNSgYi864LDXP1l208XhD71vNWQgKpbSK-pA.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9'
					})
					.authenticate()
			})

			it('should fail with info and status', function() {
				expect(info).to.be.an('object')
				expect(status).to.equal(403)
				expect(info.message).to.equal('Expired WIX-instance')
			})
		})
	})

	describe('when WIX-digest is wrong', function() {
		const strategy = new Strategy({secret: 'secret-key'}, function(_unused_req, _unused_instanceObj, done) {
			return done(null, false)
		})

		let info

		before(function(done) {
			chai.passport.use(strategy)
				.fail(function(i) {
					info = i
					done()
				})
				.req(function(req) {
					req.query = {}
					req.query.instance = 'wrong-digest.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9'
				})
				.authenticate()
		})

		it('should fail', function() {
			expect(info).to.be.an('object')
			expect(info.message).to.equal('Invalid WIX-instance')
		})
	})

	describe('when request does not contain query-string', function() {
		const strategy = new Strategy({secret: 'secret'}, function(/*instanceObj, done*/) {
			throw new Error('should not be called')
		})

		let info, status

		before(function(done) {
			chai.passport.use(strategy)
				.fail(function(i, s) {
					info = i;
					status = s;
					done();
				})
				.authenticate()
		})

		it('should fail with info and status', function() {
			expect(info).to.be.an('object')
			expect(info.message).to.equal('Missing WIX-instance query-parameter')
			expect(status).to.equal(401)
		})
	})

	describe('when query-string does not contain "instance"', function() {
		const strategy = new Strategy({secret: 'secret'}, function(/*instanceObj, done*/) {
			throw new Error('should not be called')
		})

		let info, status

		before(function(done) {
			chai.passport.use(strategy)
				.fail(function(i, s) {
					info = i
					status = s
					done()
				})
				.req(function(req) {
					req.query = {}
				})
				.authenticate()
		})

		it('should fail with info and status', function() {
			expect(info).to.be.an('object')
			expect(status).to.equal(401)
			expect(info.message).to.equal('Missing WIX-instance query-parameter')
		})
	})

	describe('information, provided on fail', () => {
		describe('by default', function() {
			const strategy = new Strategy({
				secret: 'secret-key',
				passReqToCallback: true,
				signDateThreshold: ()=> true
			}, function verificationCallback(_unused_req, _unused_instanceObj, done) {
				return done(null, false, { message: 'authentication failed' })
			})

			let info

			before(function(done) {
				chai.passport.use(strategy)
					.fail(function(i) {
						info = i
						done()
					})
					.req(function(req) {
						req.query = {}
						req.query.instance = 'tpGw1xFpNSgYi864LDXP1l208XhD71vNWQgKpbSK-pA.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9'
					})
					.authenticate()
			})

			it('is a default string', function() {
				expect(info).to.be.an('object')
				expect(info.message).to.equal('authentication failed')
			})
		})


		describe('when `badRequestMessage` is provided', function() {
			const strategy = new Strategy({secret: 'secret'}, function() {
				throw new Error('should not be called')
			})

			let info, status

			before(function(done) {
				chai.passport.use(strategy)
					.fail(function(i, s) {
						info = i
						status = s
						done()
					})
					.req(function(req) {
						req.query = {}
					})
					.authenticate({badRequestMessage: 'Something is wrong with this request' })
			})

			it('contains info from options', function() {
				expect(info).to.be.an('object')
				expect(info.message).to.equal('Something is wrong with this request')
				expect(status).to.equal(401)
			})
		})
	})
})
