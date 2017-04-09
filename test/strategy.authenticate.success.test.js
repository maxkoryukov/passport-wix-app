'use strict'

const chai = require('chai')
const Strategy = require('../src/strategy')


describe('strategy.authenticate.success', function() {

	describe('handling a request with valid credentials in query', function() {
		let user
		let info
		let ins = null
		let ext = null

		const strategy = new Strategy({
			secret: 'secret-key',
			passReqToCallback: true,
			signDateThreshold: () => true
		}, function verificationCallback(_unused_req, instanceObj, done) {

			ins = instanceObj
			ext = instanceObj.ext

			if (instanceObj.uid.toLowerCase() === 'da32cbf7-7f8b-4f9b-a97e-e67f3072ce92') {
				return done(null, { id: '1234' }, { scope: 'read' })
			}
			return done(null, false)
		})


		before(function(done) {
			chai.passport.use(strategy)
				.success(function(u, i) {
					user = u
					info = i
					done()
				})
				.req(function(req) {
					req.query = {}
					req.query.instance = 'tpGw1xFpNSgYi864LDXP1l208XhD71vNWQgKpbSK-pA.ew0KImluc3RhbmNlSWQiOiJhZmY1MDE2ZC0yOTE0LTRkNjMtYTM4Yy1hNmRjNGU0MzJlZDciLA0KInNpZ25EYXRlIjoiMjAxNS0xMi0xMFQwNjo1NzozNy4yMDFaIiwNCiJ1aWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiLA0KInBlcm1pc3Npb25zIjoiT1dORVIiLA0KImlwQW5kUG9ydCI6IjkxLjE5OS4xMTkuMTMvMzU3MzQiLA0KInZlbmRvclByb2R1Y3RJZCI6IlByZW1pdW0tUGFja2FnZSIsDQoib3JpZ2luSW5zdGFuY2VJZCI6ImMzOGU0ZTAwLWRjYzEtNDMzZS05ZTkwLWIzMzJkZWY3YjM0MiIsDQoic2l0ZU93bmVySWQiOiJkYTMyY2JmNy03ZjhiLTRmOWItYTk3ZS1lNjdmMzA3MmNlOTIiDQp9'
				})
				.authenticate()
		})

		it('should supply user', function() {
			expect(user).to.be.an.object
			expect(user.id).to.equal('1234')
		})

		it('should supply info', function() {
			expect(info).to.be.an.object
			expect(info.scope).to.equal('read')
		})

		it('should supply ext in instanceObj to validate', function() {
			expect(ins).to.be.an.object
			expect(ins).to.have.ownProperty('instanceId')
			expect(ins).to.have.ownProperty('signDate')
			expect(ins).to.have.ownProperty('uid')
			expect(ins).to.have.ownProperty('permissions')
			expect(ins).to.have.ownProperty('ipAndPort')
			expect(ins).to.have.ownProperty('vendorProductId')
			expect(ins).to.have.ownProperty('aid')
			expect(ins).to.have.ownProperty('originInstanceId')
			expect(ins).to.have.ownProperty('siteOwnerId')
		})

		it('should pass instanceObj.ext to validate', function() {
			expect(ext).to.be.an.object
			expect(ext.signDate).to.be.a.date
			expect(ext.port).to.equal(35734)
			expect(ext.ip).to.equal('91.199.119.13')
		})
	})
})
