/*jslint white: true, browser: true, devel: true */
/*globals component */

(function(){
  "use strict";

  component('.awesome-component').assert( function(expect) {
      expect.to.have.an.attribute("data-awesomeness");

      expect.to.may.have.any.classes('data-awesome-default', 'data-awesome-danger', 'data-awesome-warn');
      expect.to.may.have.attribute('data-awesome');
  });

  component('.awesome-component-header').assert( function(expect) {
      expect.to.be.a.descendantOf(".awesome-component");
  });

  component('.awesome-component-action').assert( function(expect) {
    expect.to.be.a.descendantOf(".awesome-component-content");
    expect.to.be.tag('button');
  });

  component('.awesome-component-action.big').assert( function(expect) {
    expect.to.be.deprecated();
  });
}());
