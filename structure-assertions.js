/*jslint white: true, browser: true, devel: true, nomen: true */
/*globals expect */

// The MIT License (MIT)
//
// Copyright (c) 2015 Falk Hoppe <falkhoppe81@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var assert = (function(window){
  "use strict";
  var Structure, Structures, Assert;

  // because of a lack of a real plugin mechanism of expect.js we have to monkey patch
  // the assert method, because we want to be able to run through all assertions without
  // stopping execution on first fail (like in usual test frameworks).

  // backup original expect.js assert method
  window.expect.Assertion.prototype.baseAssert = window.expect.Assertion.prototype.assert;

  // overwrite assertion method to run in assertion error callback on execption
  window.expect.Assertion.prototype.assert = function(){
    try {
      this.baseAssert.apply(this, arguments);
    } catch(e) {
      // console.warn("Component", this.obj, ":", e.message);
      this.obj.assertOnError(this.obj, e);
    }
  };

  // adding deprecated expectation to expect.js assertions
  window.expect.Assertion.prototype.deprecated = function(){
    this.assert(
        !this.obj
      , function(){ return 'expected to be not used anymore'; }
      , function(){ return 'expected to be not used anymore'; }
    );
  };

  // adding possibility to document optionals to a component, like classes, attributes and children.
  // The optional object provides for each category a function that sets its arguments to the
  // internal expectation object.
  //
  // To make the this context and its object available, we have to create a related public
  // method to the specific structure.expect object itself, so that we can bind the expect object
  // as context (see Structure-Constructor).
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

  // shortcut method for matchSelector
  window.expect.Assertion.prototype.tag = function(selector){
    this.matchSelector(selector);
  };

  // constructor method which inits an expect object, for a specific dom element,
  // including dsl method wrappers for the optional expect rules.
  //
  // @param name [String] - a key to identify a component (is usually logged to the console)
  // @param component [dom] - dom object
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

  // constructor method for breaking up dom object occurances in single structure components,
  // and builds the core of the exposed Assert objects dsl.
  //
  // @param selector [String] - css selector
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

  // dsl method for starting configuring component assertions,
  // that binds the structures expect object to the configuration callback.
  Structures.prototype.toHave = function(cb) {
    var i, structure;

    for(i = 0; i < this.structures.length; i += 1) {
      structure = this.structures[i];

      cb(structure.expect);
    }
  };

  // exposed assert object
  Assert = function(selector) {
    return new Structures(selector);
  };

  // default callback for reacting on assertion errors
  Assert.errorCallback = function(obj, error) {
    var optionals = {};
    if (obj.optional) {
      optionals = obj.optional;
    }

    console.info("%c"+obj.componentName+": \n\n"+error.message, "color: blue;", " \n\n", {obj: obj, optionals: optionals}, "\n\n");
  };

  // setter for the errorCallback
  Assert.onError = function(callback) {
    this.errorCallback = callback;
  };

  return Assert;
}(this));
