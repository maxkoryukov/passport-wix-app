'use strict'

const pkg = require('../')


describe('passport-wix-app', function() {

	it('should be Strategy constructor', function() {
		expect(pkg).to.be.a('function')
	})

	it('should export Strategy constructor directly from package', function() {
		expect(pkg).have.property('Strategy')
		expect(pkg).to.equal(pkg.Strategy)
	})

	it('should export WixAppStrategy constructor directly from package', function() {
		expect(pkg).have.property('WixAppStrategy')
		expect(pkg).to.equal(pkg.WixAppStrategy)
	})
})
