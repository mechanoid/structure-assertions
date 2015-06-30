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

var component = (function(window){
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
      // calling the original expect.js assert method
      this.baseAssert.apply(this, arguments);
    } catch(e) {
      // call assert error callback instead of throwing an exception for each assertion
      this.obj.assertOnError(this.obj, e);
    }
  };

  // adding deprecated expectation to expect.js assertions
  window.expect.Assertion.prototype.deprecated = function(){
    // just fail when obj is found
    this.assert(
        !this.obj
      , function(){ return 'expected to be not used anymore'; }
      , function(){ return 'expected to be not used anymore'; }
    );
  };

  // adding deprecated expectation to expect.js assertions
  window.expect.Assertion.prototype.descendant = function(selector){
    // just fail when obj is found
    this.assert(
        this.obj.parentNode.matches(selector)
      , function(){ return 'expected to be a descendant to ' + selector; }
      , function(){ return 'expected to be a descendant to ' + selector; }
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
      // initialize instance optional object
      this.obj.optional = (this.obj.optional || {});
      // set optional attributes
      this.obj.optional.attributes = arguments;
    },
    _classes: function(){
      // initialize instance optional object
      this.obj.optional = (this.obj.optional || {});
      // set optional classes
      this.obj.optional.classes = arguments;
    },
    _children: function(){
      // initialize instance optional object
      this.obj.optional = (this.obj.optional || {});
      // set optional children
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

    // memoize the actual dom node
    this.component = component;
    // create initial expect component to register assertions on
    this.expect = window.expect(this.component);
    // make assertion callback available to overwritten assert method
    this.expect.obj.assertOnError = Assert.errorCallback;
    // make component name available to expect object
    this.expect.obj.componentName = name;

    // public method to inject this.expect obj into private _attributes method
    this.expect.optional.attributes = function(){
      window.expect.Assertion.prototype.optional._attributes.apply(self.expect, arguments);
    };

    // public method to inject this.expect obj into private _classes method
    this.expect.optional.classes = function(){
      window.expect.Assertion.prototype.optional._classes.apply(self.expect, arguments);
    };

    // public method to inject this.expect obj into private _children method
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

    // all dom nodes matched by the selector (aka component name)
    components = document.querySelectorAll(selector);

    // list of structurized dom component nodes
    this.structures = [];

    for (i = 0; i < components.length; i += 1) {
      component = components[i];
      structure = new Structure(selector, component);
      this.structures.push(structure);
    }
  };

  // dsl method for starting configuring component assertions,
  // that binds the structures expect object to the configuration callback.
  Structures.prototype.assert = function(assertions) {
    var i, structure;

    // assign assertion bound to the component cluster to each single structure.
    for(i = 0; i < this.structures.length; i += 1) {
      structure = this.structures[i];

      // callback of assertions that are configured for that component
      assertions(structure.expect);
    }
  };

  // exposed assert object
  Assert = function(selector) {
    return new Structures(selector);
  };

  // default callback for reacting on assertion errors
  Assert.errorCallback = function(obj, error) {
    var optionals = {};

    // While many assertions are created by the expect.js dsl,
    // the expect.assertions created by out Structure-constructor
    // initialize optionals, which may address additional attributes, classes, or children.
    if (obj.optional) {
      optionals = obj.optional;
    }

    // default logging
    console.info("%c"+obj.componentName+": \n\n"+error.message, "color: blue;", " \n\n", {obj: obj, optionals: optionals}, "\n\n");
  };

  // setter for the errorCallback
  Assert.onError = function(callback) {
    // overwrite the default error callback
    this.errorCallback = callback;
  };

  // return assertion instance as lib entry
  return Assert;
}(this));
