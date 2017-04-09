'use strict'

// don't make it global - doesn't work
const chai = require('chai')
chai.use(require('chai-passport-strategy'))

global.expect = chai.expect
