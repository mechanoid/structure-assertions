/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

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

	  __webpack_require__(1);

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


/***/ },
/* 1 */
/***/ function(module, exports) {

	/*jslint white: true, browser: true, devel: true, nomen: true */
	/*globals expect, module */

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
	module.exports = (function(chai) {
	  "use strict";

	  function beginsWithVowel() {
	    return (['a', 'e', 'i', 'o', 'u'].indexOf(this[0].toLowerCase()) !== -1);
	  }

	  chai.use(function (_chai, utils) {
	    utils.overwriteMethod(chai.Assertion.prototype, 'assert', function (_super) {
	      return function () {
	        try {
	          _super.apply(this, arguments);
	        } catch(error) {
	          var cb;
	          if (utils.flag(this, 'isOptional')) {
	            if (utils.flag(this, 'optionalsCb')) {
	              cb = utils.flag(this, 'optionalsCb');
	            } else {
	              // by default do nothing for optionals
	              cb = function() {};
	            }
	          } else {
	            cb = utils.flag(this, 'onAssertionError');
	          }

	          if (cb !== undefined) {
	            cb.call(this, error);
	          } else {
	            throw error;
	          }
	        }
	      };
	    });

	    utils.addProperty(chai.Assertion.prototype, 'withCallback', function () {
	      return function(cb) {
	        utils.flag(this, 'onAssertionError', cb);
	        return this;
	      };
	    });

	    utils.addProperty(chai.Assertion.prototype, 'withOptionalsCallback', function () {
	      return function(cb) {
	        utils.flag(this, 'optionalsCb', cb);
	        return this;
	      };
	    });

	    utils.addProperty(chai.Assertion.prototype, 'may', function () {
	      utils.flag(this, 'isOptional', true);

	      return this;
	    });

	    _chai.Assertion.addMethod('child', function (selector) {

	      var matchesChildren = function(selector){
	        var children, child, i;
	        children = this._obj.children;

	        for (i in children) {
	          if (children.hasOwnProperty(i)) {
	            child = this._obj.children[i];
	            if (child.matches(selector)) {
	              return true;
	            }
	          }
	        }

	        return false;
	      };

	      this.assert(
	          matchesChildren.call(this, selector)
	        , 'expected element to have a at least on child ' + selector
	        , 'expected element to not have a child ' + selector
	      );
	    });

	    _chai.Assertion.addMethod('descendant', function (selector) {
	      this.assert(
	          this._obj.parentNode.matches(selector)
	        , 'expected element to be a descendant to ' + selector
	        , 'expected element to not be descendant to ' + selector
	      );
	    });

	    _chai.Assertion.addMethod('deprecated', function () {
	      this.assert(
	          false
	        , 'expected element to not be used anymore'
	        , 'deprecation does not make no sense in any way o_O'
	      );
	    });

	    _chai.Assertion.addMethod('tag', function (tagName) {
	      var messageTagName = ' ' + tagName;

	      if (beginsWithVowel.call(tagName)) {
	        messageTagName = 'n' + messageTagName;
	      }

	      this.assert(
	          this._obj.tagName.toLowerCase() === tagName.toLowerCase()
	        , 'expected element to be a ' + tagName + '-tag'
	        , 'expected element to not be a ' + tagName + '-tag'
	      );
	    });

	    _chai.Assertion.addMethod('descendantOf', _chai.Assertion.prototype.descendant);

	    _chai.Assertion.addMethod('class', function (className) {
	      var regexp, messageBegin;

	      regexp = new RegExp("(?:(?![-])\\b"+className+"\\b(?![\\w-]))");
	      messageBegin = 'expected element to have a class ';

	      if (utils.flag(this, 'isOptional')) {
	        messageBegin = 'element may have a class ';
	      }

	      this.assert(
	          this._obj.className.match(regexp)
	        , messageBegin + className
	        , 'expected element to not have a class "' + className + '"'
	      );
	    });

	    // TODO: implement multiple classes case in detail with matcher for multiple classes
	    _chai.Assertion.addMethod('classes', function () {
	      var messageBegin;

	      if (utils.flag(this, 'isOptional')) {
	        messageBegin = 'element may have any classes of ';
	      }

	      this.assert(
	          false
	        , messageBegin + '"' + Array.prototype.join.call(arguments) + '"'
	        , 'does not make no sense in any way for optionals o_O'
	      );
	    });

	    _chai.Assertion.addMethod('attribute', function (attribute, value) {
	      var messageBegin = 'expected element to have an attribute ';

	      if (utils.flag(this, 'isOptional')) {
	        messageBegin = 'element may have an attribute ';
	      }

	      this.assert(
	          this._obj.hasAttribute(attribute)
	        , messageBegin + '"' + attribute + '"'
	        , 'expected element to have not an attribute "' + attribute + '"'
	      );

	      if (value !== undefined) {

	        this.assert(
	            this._obj.getAttribute(attribute) === value
	          , messageBegin + '"' + attribute + '"' +' with value: "' + value + '"'
	          , 'expected element to not have an attribute  "' + attribute + '" with value: "' + value + '"'
	        );
	      }
	    });
	  });
	}(window.chai));


/***/ }
/******/ ]);