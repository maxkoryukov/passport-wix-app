# passport-wix-app

<a href="https://github.com/maxkoryukov/passport-wix-app"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"></a>

[![Build Status](https://travis-ci.org/maxkoryukov/passport-wix-app.svg?branch=master)](https://travis-ci.org/maxkoryukov/passport-wix-app)
[![npm version](https://img.shields.io/npm/v/passport-wix-app.svg)](https://www.npmjs.com/package/passport-wix-app)

[![codecov](https://codecov.io/gh/maxkoryukov/passport-wix-app/branch/master/graph/badge.svg)](https://codecov.io/gh/maxkoryukov/passport-wix-app)
[![bitHound Overall Score](https://www.bithound.io/github/maxkoryukov/passport-wix-app/badges/score.svg)](https://www.bithound.io/github/maxkoryukov/passport-wix-app)
[![bitHound Dependencies](https://www.bithound.io/github/maxkoryukov/passport-wix-app/badges/dependencies.svg)](https://www.bithound.io/github/maxkoryukov/passport-wix-app/master/dependencies/npm)
[![npm downloads](https://img.shields.io/npm/dm/passport-wix-app.svg)](https://www.npmjs.com/package/passport-wix-app)

[![Tips](http://img.shields.io/gittip/maxkoryukov.png)](https://www.gittip.com/maxkoryukov/)

Wix Application authentication strategy for Passport.

_Useful helper for Wix Application developers_

## Install

```bash
$ npm install -S passport-wix-app
```

## Usage

This module parses `instance` parameter passed by Wix Applications
([see documentation 🌐][wix-instance])

Wix sends several other parameters (not only `instance`). You could get their
values straight from the original request. Just pass `passReqToCallback: true`
among other Strategy options.

Additional request's parameters depend on Wix Application type. Read more on the
official Wix-Dev site:

* for [widget 🌐](http://dev.wix.com/docs/development/widget/#endpoint-urls)
* for [page 🌐](http://dev.wix.com/docs/development/page/#endpoint-urls)

### Configure Strategy

The `wix-app` authentication strategy authenticates a user using `instance`
parameter, [passed by Wix 🌐][wix-instance].

The strategy requires `options` and  `verify` callback.

```javascript
passport.use(new WixAppStrategy({"secret": "WIX-APP-SECRET"},
  function verifyCallback (instance, done) {

    // any user-verification logic
    // ...
    // here is an example:
    User.findOne({
      application: instance.instanceId,
      userId: instance.uid
    }, function (err, user) {
      // error during verification
      if (err) { return done(err) }

      // user is not found/not authenticated
      if (!user) { return done(null, false) }

      // success:
      return done(null, user)
    })
  }
))
```

#### Options

You can pass additional options to the `WixAppStrategy` constructor:

```js
new WixAppStrategy(options, callback)
```

The available options are:

* `passReqToCallback` - determines whether to pass the incoming request (`req`)
    to the verify callback
* `secret` - Optional, defaults to `null`. Defines the secret assigned to your
    Wix Application.
    _Note_ that you can omit `secret` on a _configuration_ step and pass
    `secret` on request handling, when the app will call
    `passport.authenticate()` method.

#### Verification callback

Verification callback will be called with several params (see
`passReqToCallback` in options-section):

* `req` - **optional** incoming [Express-request 🌐][express] (will be passed if
    `passReqToCallback` option is set to `true`)
* `instance` - parsed [Wix-Instance 🌐][wix-instance]
* `callback` - `passport-done` function

##### Parsed Instance

Example of parsed instance (taken from
[Wix-documentation 🌐](http://dev.wix.com/docs/infrastructure/app-instance/#json-example)
and extended with custom fields - `ext`):

```js
parsedInstance = {
    "instanceId":       "bf296da1-75ce-48e6-9f72-14b7148d4fa2",
    "signDate":         "2015-12-10T06:57:37.201Z",
    "uid":              "da32cbf7-7f8b-4f9b-a97e-e67f3072ce92",
    "permissions":      "OWNER",
    "ipAndPort":        "91.199.119.13/35734",
    "vendorProductId":  null,
    "originInstanceId": "c38e4e00-dcc1-433e-9e90-b332def7b342",
    "siteOwnerId":      "da32cbf7-7f8b-4f9b-a97e-e67f3072ce92",

    // additional params:
    "ext": {
        "ip":           "91.199.119.13",
        "port":         35734,
        "signDate":     new Date(2015, 11, 10, 06, 57, 37, 201)
    },
}
```

### Authenticate Requests

Use `passport.authenticate()`, specifying the `'wix-app'` strategy, to authenticate requests.

For example, as route middleware in an [Express 🌐][express] application:

```js
app.post('/login',
  passport.authenticate('wix-app', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
```

Or, with late-loaded secret:

```js
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

The [passport-local 🌐](https://github.com/jaredhanson/passport-local)
(by Jared Hanson) was used as a scaffold for this module.

## License

Please, read the [`LICENSE`](LICENSE) file in the root of the repository
(or downloaded package).

[wix-instance]: http://dev.wix.com/docs/infrastructure/app-instance/
[express]: (http://expressjs.com/)
