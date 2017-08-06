'use strict'

const Strategy = require('../')


describe('strategy', function() {


	it('should be named wix-app', function() {
		const strategy = new Strategy({secret: '123'}, () => true)
		expect(strategy.name).to.equal('wix-app')
	})

	it('should throw if constructed without a verify callback', function() {
		expect(function() {
			const strategy = new Strategy({secret: 'secret'})       // eslint-disable-line no-unused-vars
		}).to.throw(TypeError, 'WixAppStrategy requires a verify callback')
	})

	it('should throw if constructed without a secret', function() {
		expect(function() {
			const strategy = new Strategy({}, ()=>true)  // eslint-disable-line no-unused-vars
		}).to.throw(TypeError, 'WixAppStrategy requires the "secret" option (string)')
	})

	it('should throw if constructed without a secret (options are not passed at all)', function() {
		expect(function() {
			const strategy = new Strategy(()=>true)  // eslint-disable-line no-unused-vars
		}).to.throw(TypeError, 'WixAppStrategy requires the "secret" option (string)')
	})

	describe('call constructor with a wrong-typed secret', function() {
		const testCases = [
			{msg:'object: should throw', testSecret: {object: 'key'}},
			{msg:'number: should throw',testSecret: 123821},
			{msg:'null: should throw',testSecret: null},
			{msg:'undefined: should throw',testSecret: undefined},
		]

		testCases.forEach((testCase) => {
			const msg = testCase.msg
			const testSecret = testCase.testSecret

			it(msg, () => {
				expect(function() {
					const strategy = new Strategy({ secret: testSecret}, ()=>true)  // eslint-disable-line no-unused-vars
				}).to.throw(TypeError, 'WixAppStrategy requires the "secret" option (string)')
			})
		})
	})
})
