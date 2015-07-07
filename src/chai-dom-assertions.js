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
