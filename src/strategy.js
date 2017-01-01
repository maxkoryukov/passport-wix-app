"use strict";

/**
 * Module dependencies.
 */
const passport = require('passport-strategy');
const crypto = require('crypto');

class Strategy extends passport.Strategy {
	/**
	 * `Strategy` constructor.
	 *
	 * The local authentication strategy authenticates requests based on the
	 * credentials submitted through an HTML-based login form.
	 *
	 * Applications must supply a `verify` callback which accepts `username` and
	 * `password` credentials, and then calls the `done` callback supplying a
	 * `user`, which should be set to `false` if the credentials are not valid.
	 * If an exception occurred, `err` should be set.
	 *
	 * Optionally, `options` can be used to change the fields in which the
	 * credentials are found.
	 *
	 * Options:
	 *   - `usernameField`  field name where the username is found, defaults to _username_
	 *   - `passwordField`  field name where the password is found, defaults to _password_
	 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
	 *
	 * Examples:
	 *
	 *     passport.use(new LocalStrategy(
	 *       function(username, password, done) {
	 *         User.findOne({ username: username, password: password }, function (err, user) {
	 *           done(err, user);
	 *         });
	 *       }
	 *     ));
	 *
	 * @param {Object} options
	 * @param {Function} verify
	 * @api public
	 */

	constructor(options, verify) {
		super();

		if (typeof options === 'function') {
			verify = options;
			options = {};
		}
		if (!verify) { throw new TypeError('WixAppStrategy requires a verify callback'); }

		this._secret = options.secret;

		this.name = 'wix-app';
		this._verify = verify;
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
		let [digest, data] = instance.split('.');

		digest = this._urlBase64decode(digest, 'base64');

		// sign the data using hmac-sha1-256
		let hmac = crypto.createHmac('sha256', secret);
		let myDigest = hmac.update(data).digest('base64');
		if (myDigest !== digest) {
			return null;
		}

		let instanceObj = JSON.parse(this._urlBase64decode(data, 'utf8'));

		instanceObj.aid = instanceObj.aid || null;

		// Extensions:
		let [ip, port] = instanceObj.ipAndPort.split('/');
		port = parseInt(port);
		let signDate = new Date(instanceObj.signDate);

		instanceObj.ext = {
			port,
			ip,
			signDate,
		};

		return instanceObj;
	}

	/**
	 * Authenticate request based on the contents of a Wix query-parameters.
	 *
	 * @param {Object} req
	 * @api protected
	 */
	authenticate(req, options) {
		options = options || {};

		let secret = options.secret || this._secret;
		if (!secret) {
			return this.error(new TypeError('secret is not set'));
		}

		let instance = req && req.query && req.query.instance;
		if (!instance) {
			return this.fail({ message: options.badRequestMessage || 'Missing instance field' }, 400);
		}

		let instanceObj = this._parseInstance(secret, instance);
		if (!instanceObj) {
			return this.fail({ message: options.badRequestMessage || 'Instance is invalid'}, 400);
		}

		let self = this;
		function verifyDone(err, user, info) {
			if (err) {
				return self.error(err)
			}
			if (!user) { return self.fail(info); }
			self.success(user, info);
		}

		try {
			this._verify(instanceObj, verifyDone);
		} catch (ex) {
			return this.error(ex);
		}
	}
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
