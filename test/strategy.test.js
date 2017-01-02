'use strict'

const Strategy = require('../src/strategy')


describe('strategy', function() {


	it('should be named wix-app', function() {
		const strategy = new Strategy('123', () => true)
		expect(strategy.name).to.equal('wix-app')
	})

	it('should throw if constructed without a verify callback', function() {
		expect(function() {
			const strategy = new Strategy('secret')       // eslint-disable-line no-unused-vars
		}).to.throw(TypeError, 'WixAppStrategy requires a verify callback')
	})

	it('should throw if constructed without a secret', function() {
		expect(function() {
			const strategy = new Strategy(null, ()=>true)  // eslint-disable-line no-unused-vars
		}).to.throw(TypeError, 'WixAppStrategy requires a secret')
	})

});
