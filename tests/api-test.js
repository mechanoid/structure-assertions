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
      func.apply(this, arguments);
      component.onError = before;
    });
  };

  QUnit.testDone(function(){
    $('body').html('');
  });

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
    var results = [];
    overwriteOnError(function(error){
      results.push(error.message);
    });

    $('body').append($('<div class="fabula" />'));

    component('.fabula').assert(function(expect) {
      expect.to.be.deprecated();
    });

    assert.strictEqual(results.indexOf('expected element to not be used anymore'), 0, "nodes that are deprecated but still available in dom should be marked as erroneous");
  });

  QUnit.test("test class assertion to match exactly the class name", function(assert) {
    var results;
    results = [];

    $('body').append($('<div class="fabula test fast-hyphen" />'));

    overwriteOnError(function(error){
      results.push(error.message);
    });

    component('.fabula').assert(function(expect) {
      expect.to.have.a.class('test');
      expect.to.have.a.class('fast');
      expect.to.have.a.class('fast-hyphen');
      expect.to.have.a.class('hyphen');
    });

    assert.strictEqual(results.indexOf('expected element to have a class test'), -1, "class test should be found");
    assert.strictEqual(results.indexOf('expected element to have a class fast'), 0, "class fast should be found, because it is followed by a hyphen");
    assert.strictEqual(results.indexOf('expected element to have a class fast-hyphen'), -1, "class fast-hyphen instead should be found");
    assert.strictEqual(results.indexOf('expected element to have a class hyphen'), 1, "class hyphen again should not be found, because prepended by a hyphen");
  });

  QUnit.test("test attribute assertion", function(assert) {
    var results = [];

    $('body').append($('<div class="component-with-attribute" data-test="true" />'));

    overwriteOnError(function(error){
      results.push(error.message);
    });
    component('.component-with-attribute').assert(function(expect) {
      expect.to.have.an.attribute('data-test');
      expect.to.have.an.attribute('data-not-there');
      expect.to.have.an.attribute('data-test', false);
    });

    assert.strictEqual(results.indexOf('expected element to have an attribute "data-test"'), -1, "data-test should be found");
    assert.strictEqual(results.indexOf('expected element to have an attribute "data-not-there"'), 0, "data-not-there should not be found");
    assert.strictEqual(results.indexOf('expected element to have an attribute "data-test" with value: "false"'), 1, "data-test should have had value true, but has false");
  });

  QUnit.test("test that may is doing nothing, when included, to signal optional classes and attributes", function(assert) {
    var results = [];

    $('body').append($('<div class="componet-with-optionals" />'));

    overwriteOnError(function(error){
      results.push(error.message);
    });

    component('.componet-with-optionals').assert(function(expect) {
      expect.to.may.have.a.class('test');
      expect.to.may.have.an.attribute('data-test');
    });

    assert.strictEqual(results.indexOf('expected element to have a class test'), -1, "there should be no error for the class");
    assert.strictEqual(results.indexOf('expected element to have an attribute "data-test""'), -1, "there should be no error for the attribute");
  });
}());
