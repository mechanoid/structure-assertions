/*jslint browser: true, devel: true, todo: true, white: true, indent: 2, nomen: true, regexp: true */

/*global  $, QUnit, component */

(function(){
  "use strict";
  QUnit.module("API");

  // muted default assertion logging
  component.onError(function(){
    return false;
  });

  var overwriteOnError = function(func) {
    var before = component.onError;

    component.onError(function(){
      func();
      component.onError = before;
    });
  };

  QUnit.test("test if component root function is available", function(assert) {
    assert.strictEqual((typeof component), "function", "should provide a function to encapsulate components");
  });

  QUnit.test("test if component assertions are available", function(assert) {
    var current = component('.fubar');
    assert.strictEqual(typeof(current.assert), "function", "should have method to configure assertions per component");
  });

  QUnit.test("test if dom nodes of components are bound properly", function(assert) {
    var current;

    $('body').append($('<div class="fubar" />')).append($('<div class="fubar" />'));

    current = component('.fubar');
    current.assert(function(expect) {
      expect.to.be.tag('div');
    });

    assert.strictEqual(current.structures.length, 2, "should have method to configure assertions per component");
  });

  QUnit.test("test if deprecated method is available", function(assert) {
    var current, done, deprecated;
    done = assert.async();

    overwriteOnError(function(){
      deprecated = true;
      assert.ok(deprecated, "nodes that are deprecated but still available in dom should trigger this assertion");
      done();
      return false;
    });


    $('body').append($('<div class="fabula" />'));

    current = component('.fabula');

    current.assert(function(expect) {
      expect.to.be.deprecated();
    });
  });
}());
