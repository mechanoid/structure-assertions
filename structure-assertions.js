/*jslint white: true, browser: true */
/*globals expect, console */

var assert = (function(){
  "use strict";
  var Structure, StructureAssertion, Assert;


  expect.Assertion.prototype.baseAssert = expect.Assertion.prototype.assert;

  expect.Assertion.prototype.assert = function(){
    try {
      this.baseAssert.apply(this, arguments);
    } catch(e) {
      console.warn("Component", this.obj, ":", e.message);
    }
  };

  Structure = function(component) {
    this.component = component;
    this.expect = expect(this.component);
  };

  StructureAssertion = function(selector) {
    var components, i, component, structure;
    components = document.querySelectorAll(selector);

    this.structures = [];
    this.assertions = [];

    for (i = 0; i < components.length; i += 1) {
      component = components[i];
      structure = new Structure(component);
      this.structures.push(structure);
    }
  };

  StructureAssertion.prototype.toHave = function(cb) {
    var i, structure;

    for(i = 0; i < this.structures.length; i += 1) {
      structure = this.structures[i];

      cb(structure.expect);
    }
  };

  Assert = function(selector) {
    return new StructureAssertion(selector);
  };

  Assert.atLeastNChildrenOf = function(selector, n) {
    return {"atLeastNChildrenOf": {n: n, selector: selector}};
  };

  return Assert;
}());
