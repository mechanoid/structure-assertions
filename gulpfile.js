/*jslint node: true, white: true, nomen: true */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    karma = require('karma').server,
    webpack = require('webpack');

gulp.task('test', ["webpack"], function(done) {
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

gulp.task("webpack", function(callback) {
  "use strict";
    // run webpack
  webpack({
    entry: "./src/structure-assertions.js",
    output: {
        path: __dirname + '/dist',
        filename: "structure-assertions.js"
    },
  }, function(err, stats) {
      if(err) {
        throw new gutil.PluginError("webpack", err);
      }

      gutil.log("[webpack]", stats.toString({
          // output options
      }));
      callback();
  });
});

gulp.task("serve", ["webpack"], function() {
  "use strict";

	gulp.watch(["src/**/*"], ["webpack"]);
});
