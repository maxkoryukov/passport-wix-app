/* @flow weak */

"use strict";

/**
 * Module dependencies.
 */
const passport = require('passport-strategy')
const crypto = require('crypto')

class Strategy extends passport.Strategy {
	/**
	 * `Strategy` constructor.
	 *
	 * The authentication strategy authenticates requests based on the
	 * `instance` query param, sent by WIX Applications
	 *
	 * https://dev.wix.com/docs/infrastructure/app-instance-id/
	 * https://dev.wix.com/docs/infrastructure/app-instance/#instance-properties
	 *
	 * Options:
	 *   - `secret`             xxxxxxxxxx
	 *   - `signDateThreshold`  xxxxxxxx
	 *
	 * Examples:
	 *
	 *     passport.use(new LocalStrategy({secret: 'your-wix-secret'},
	 *       function verifyCallback(instance, done) {
	 *         WixApp.findOne({ appId: instance.instanceId }, function (err, wixapp) {
	 *           done(err, wixapp);
	 *         });
	 *       }
	 *     ));
	 *
	 * @param {Object} options
	 * @param {Function} verify
	 * @api public
	 */

	constructor(options, verify) {
		super()

		if (typeof options === 'function') {
			verify = options
			options = {}
		}

		if (typeof options.secret !== 'string') { throw new TypeError('WixAppStrategy requires a secret. It MUST be a string') }

		this._secret = options.secret
		if (!verify) { throw new TypeError('WixAppStrategy requires a verify callback') }

		this._signDateDiffMax = 10000;
		this._isSignDateValid = this._getValidatorForSignDate(options.signDateThreshold)

		this.name = 'wix-app'
		this._verify = verify
		this._passReqToCallback = !!options.passReqToCallback;
	}

	_getValidatorForSignDate(value) {
		if (false === value || typeof value === 'undefined') {
			return ()=>true
		}

		if (typeof value === 'function') {
			return value
		}

		if (typeof value === 'number') {
			this._signDateDiffMax = value
		}

		return this._defaultValidatorSignDate
	}

	_defaultValidatorSignDate(signDate) {
		return Math.abs(signDate.valueOf() - new Date().valueOf()) < this._signDateDiffMax
	}

	_urlBase64decode(str, encoding) {
		str = str
			.replace('-', '+')
			.replace('_', '/')
		;
		return new Buffer(str, 'base64').toString(encoding);
	}

	_parseInstance(secret, instance) {
		// split the instance into digest and data
		let _splitVar = instance.split('.')
		let digest = _splitVar[0]
		const data = _splitVar[1]

		// sign the data using hmac-sha1-256
		let hmac = crypto.createHmac('sha256', secret)

		let myDigest = hmac.update(data).digest('base64')
		digest = this._urlBase64decode(digest, 'base64')

		if (myDigest !== digest) {
			return null;
		}

		const instanceObj = JSON.parse(this._urlBase64decode(data, 'utf8'))

		instanceObj.aid = instanceObj.aid || null
		instanceObj.uid = instanceObj.uid || null
		instanceObj.permissions = instanceObj.permissions || null

		// Extensions:
		_splitVar = instanceObj.ipAndPort.split('/')
		const ip = _splitVar[0]
		const port = parseInt(_splitVar[1])
		const signDate = new Date(instanceObj.signDate)

		instanceObj.ext = {
			port,
			ip,
			signDate,
		}

		return instanceObj;
	}

	/**
	 * Authenticate request based on the contents of a Wix query-parameters.
	 *
	 * @param {Object} req
	 * @api protected
	 */
	authenticate(req, options) {
		options = options || {}

		let instance = req && req.query && req.query.instance
		if (!instance) {
			return this.fail({ message: options.badRequestMessage || 'Missing WIX-instance query-parameter' }, 401)
		}

		let instanceObj = this._parseInstance(this._secret, instance);
		if (!instanceObj) {
			return this.fail({ message: options.badRequestMessage || 'Invalid WIX-instance'}, 403)
		}

		if (!this._isSignDateValid(instanceObj.ext.signDate)) {
			return this.fail({ message: options.badRequestMessage || 'Expired WIX-instance'}, 403)
		}

		let self = this;
		function verifyDone(err, user, info) {
			if (err) {
				return self.error(err)
			}
			if (!user) {
				return self.fail(info);
			}
			self.success(user, info);
		}

		return this._tryAuthenticate(req, instanceObj, verifyDone)
	}

	_tryAuthenticate(req, instanceObj, callback) {
		try {
console.log(this._passReqToCallback);
			if (this._passReqToCallback) {
				return this._verify(req, instanceObj, callback)
			} else {
				return this._verify(instanceObj, callback)
			}
		} catch (ex) {
			return this.error(ex);
		}
	}
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
