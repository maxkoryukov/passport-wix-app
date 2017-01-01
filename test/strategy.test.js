'use strict'

const Strategy = require('../src/strategy')


describe('strategy', function() {

	let strategy = new Strategy(function(){ return true; });

	it('should be named wix-app', function() {
		expect(strategy.name).to.equal('wix-app');
	});

	it('should throw if constructed without a verify callback', function() {
		expect(function() {
			strategy = new Strategy();
		}).to.throw(TypeError, 'WixAppStrategy requires a verify callback');
	});

});
