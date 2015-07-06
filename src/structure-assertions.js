/*jslint white: true, browser: true, devel: true, nomen: true */
/*globals chai, require */

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

window.component = (function(){
  "use strict";
  var Structure, Structures, Assert, expect;

  require('./chai-dom-assertions.js');

  expect = chai.expect;

  // constructor method which inits an expect object, for a specific dom element,
  // including dsl method wrappers for the optional expect rules.

  // @param component [dom] - dom object
  Structure = function(component) {
    // memoize the actual dom node
    this.component = component;
    // create initial expect component to register assertions on
    this.expect = expect(this.component);

    this.expect.withCallback(function(error){
      Assert.errorCallback.call(this, error);
    });

    this.expect.withOptionalsCallback(function(error){
      Assert.optionalsCallback.call(this, error);
    });
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
      structure = new Structure(component);
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
  Assert.errorCallback = function(error) {
    console.info("%c" + error, "color: #aaa;", this._obj);
  };

  // setter for the errorCallback
  Assert.onError = function(callback) {
    // overwrite the default error callback
    this.errorCallback = callback;
  };

  // default callback for reacting on assertion errors
  Assert.optionalsCallback = function(error) {
    // console.info("%c" + error, "color: #81acd0;", this._obj);
  };

  // setter for the errorCallback
  Assert.onOptionals = function(callback) {
    // overwrite the default error callback
    this.optionalsCallback = callback;
  };

  // return assertion instance as lib entry
  return Assert;
}());
