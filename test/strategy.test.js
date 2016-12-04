'use strict';

const Strategy = require('../lib/strategy');


describe('Strategy', function() {

	var strategy = new Strategy(function(){ return true; });

	it('should be named wix-app', function() {
		expect(strategy.name).to.equal('wix-app');
	});

	it('should throw if constructed without a verify callback', function() {
		expect(function() {
			new Strategy();
		}).to.throw(TypeError, 'WixAppStrategy requires a verify callback');
	});

});
