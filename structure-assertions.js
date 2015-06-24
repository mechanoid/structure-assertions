/*jslint white: true, browser: true, devel: true, nomen: true */
/*globals expect */

var assert = (function(window){
  "use strict";
  var Structure, Structures, Assert;

  window.expect.Assertion.prototype.baseAssert = window.expect.Assertion.prototype.assert;

  window.expect.Assertion.prototype.assert = function(){
    try {
      this.baseAssert.apply(this, arguments);
    } catch(e) {
      // console.warn("Component", this.obj, ":", e.message);
      this.obj.assertOnError(this.obj, e);
    }
  };

  window.expect.Assertion.prototype.deprecated = function(){
    this.assert(
        !this.obj
      , function(){ return 'expected to be not used anymore'; }
      , function(){ return 'expected to be not used anymore'; }
    );
  };

  window.expect.Assertion.prototype.optional = {
      _attributes: function(){
        this.obj.optional = (this.obj.optional || {});
        this.obj.optional.attributes = arguments;
      },
      _classes: function(){
        this.obj.optional = (this.obj.optional || {});
        this.obj.optional.classes = arguments;
      },
      _children: function(){
        this.obj.optional = (this.obj.optional || {});
        this.obj.optional.children = arguments;
      }
  };

  window.expect.Assertion.prototype.tag = function(selector){
    this.matchSelector(selector);
  };

  Structure = function(name, component) {
    var self = this;

    this.component = component;
    this.component.assertOnError = Assert.errorCallback;
    this.expect = window.expect(this.component);
    this.expect.obj.componentName = name;

    this.expect.optional.attributes = function(){
      window.expect.Assertion.prototype.optional._attributes.apply(self.expect, arguments);
    };

    this.expect.optional.classes = function(){
      window.expect.Assertion.prototype.optional._classes.apply(self.expect, arguments);
    };

    this.expect.optional.children = function(){
      window.expect.Assertion.prototype.optional._children.apply(self.expect, arguments);
    };
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
    var optionals = {};
    if (obj.optional) {
      optionals = obj.optional;
    }

    console.info("%c"+obj.componentName+": \n\n"+error.message, "color: blue;", " \n\n", {obj: obj, optionals: optionals}, "\n\n");
  };

  Assert.infoCallback = function(obj, message) {
    console.info(obj, message);
  };

  Assert.onError = function(callback) {
    this.errorCallback = callback;
  };

  return Assert;
}(this));
