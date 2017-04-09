'use strict'

const pkg = require('..')


describe('passport-wix-app', function() {

	it('should export Strategy constructor directly from package', function() {
		expect(pkg).to.be.a('function')
		expect(pkg).to.equal(pkg.Strategy)
	})
})
