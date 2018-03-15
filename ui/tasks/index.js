const gulp = require('gulp')
const stripesServe = require('./stripes').stripesServe
const watch = require('./erm').watch

module.exports.watch = watch
module.exports.stripesServe = stripesServe
module.exports.default = stripesServe