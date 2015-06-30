/*jslint node: true, white: true, nomen: true */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    karma = require('karma').server;

gulp.task('test', function(done) {
  "use strict";
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('tdd', function (done) {
  "use strict";
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});
