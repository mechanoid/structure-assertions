/*jslint browser: true, devel: true, todo: true, white: true, indent: 2, nomen: true, regexp: true */

/*global  QUnit, component */

(function(){
  "use strict";
  QUnit.module("API");

  QUnit.test("test if component assertions are available", function(assert) {
    assert.strictEqual((typeof component), "function", "should provide a function to encapsulate components");
  });
  //
  QUnit.test("test if component assertions are available", function(assert) {
    var current = component('.fubar');
    assert.strictEqual(typeof(current.assert), "function", "should have method to configure assertions per component");
  });
}());
