/*jslint white: true, browser: true, devel: true */
/*globals expect */

var assert = (function(){
  "use strict";
  var Structure, Structures, Assert;

  expect.Assertion.prototype.baseAssert = expect.Assertion.prototype.assert;

  expect.Assertion.prototype.assert = function(){
    try {
      this.baseAssert.apply(this, arguments);
    } catch(e) {
      // console.warn("Component", this.obj, ":", e.message);
      this.obj.assertOnError(this.obj, e);
    }
  };

  expect.Assertion.prototype.deprecated = function(){
    this.assert(
        !this.obj
      , function(){ return 'expected to be not used anymore'; }
      , function(){ return 'expected to be not used anymore'; }
    );
  };

  expect.Assertion.prototype.tag = function(selector){
    this.matchSelector(selector);
  };

  Structure = function(name, component) {
    this.component = component;
    this.component.assertOnError = Assert.errorCallback;
    this.component.assertName = name;
    this.expect = expect(this.component);
  };

  Structures = function(selector) {
    var components, i, component, structure;
    components = document.querySelectorAll(selector);

    this.structures = [];

    for (i = 0; i < components.length; i += 1) {
      component = components[i];
      structure = new Structure(selector, component);
      this.structures.push(structure);
    }
  };

  Structures.prototype.toHave = function(cb) {
    var i, structure;

    for(i = 0; i < this.structures.length; i += 1) {
      structure = this.structures[i];

      cb(structure.expect);
    }
  };

  Assert = function(selector) {
    return new Structures(selector);
  };

  Assert.errorCallback = function(obj, error) {
    console.warn(obj, error.message);
  };

  Assert.infoCallback = function(obj, message) {
    console.info(obj, message);
  };

  Assert.onError = function(callback) {
    this.errorCallback = callback;
  };

  return Assert;
}());
