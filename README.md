# passport-wix-app

[![Build Status](https://travis-ci.org/maxkoryukov/passport-wix-app.svg?branch=master)](https://travis-ci.org/maxkoryukov/passport-wix-app)
[![codecov](https://codecov.io/gh/maxkoryukov/passport-wix-app/branch/master/graph/badge.svg)](https://codecov.io/gh/maxkoryukov/passport-wix-app)
[![bitHound Overall Score](https://www.bithound.io/github/maxkoryukov/passport-wix-app/badges/score.svg)](https://www.bithound.io/github/maxkoryukov/passport-wix-app)
[![bitHound Dependencies](https://www.bithound.io/github/maxkoryukov/passport-wix-app/badges/dependencies.svg)](https://www.bithound.io/github/maxkoryukov/passport-wix-app/master/dependencies/npm)
[![npm version](https://img.shields.io/npm/v/passport-wix-app.svg)](https://www.npmjs.com/package/passport-wix-app)
[![npm downloads](https://img.shields.io/npm/dm/passport-wix-app.svg)](https://www.npmjs.com/package/passport-wix-app)

Wix Application authentication strategy for Passport.

This module is useful for Wix Application developers. At least, it will parse `instance` parameter, used by Wix Applications ([see documentation](http://dev.wix.com/docs/infrastructure/app-instance/#))

Currently, **NODE 6.x ONLY!!!**

## Install

```bash
$ npm install -S passport-wix-app
```

## Usage

#### Configure Strategy

The `wix-app` authentication strategy authenticates users using a `instance` parameter, [passed by Wix](http://dev.wix.com/docs/development/widget/#endpoint-urls). The strategy requires a `verify` callback, which accepts decoded and verified `instance` object (with several useful extra fields) and calls `done` providing a user.

```javascript
passport.use(new WixAppStrategy({"secret": "WIX-APP-SECRET"},
  function(instance, done) {
    User.findOne({
      application: instance.instanceId,
      userId: instance.uid
    }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      // success:
      return done(null, user);
    });
  }
));
```

##### Available Options

This strategy takes an optional options hash before the function, e.g. `new WixAppStrategy({/* options, */ callback})`.

The available options is:

* `secret` - Optional, defaults to `null`. Defines the secret assigned to your Wix Application

*Note*, that you could pass `secret` later, to the `passport.authenticate()` method.

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'wix-app'` strategy, to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```javascript
app.post('/login',
  passport.authenticate('wix-app', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
```

Or, with late-secret:

```javascript
app.post('/login',
  passport.authenticate('wix-app', {
    secret: 'secret-key',
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });
```

## Credits

The [passport-local](https://github.com/jaredhanson/passport-local) (by Jared Hanson) was used as a scaffold for this module.

## License

Please, read the [`LICENSE`](LICENSE) file in the root of the repository (or downloaded package).
