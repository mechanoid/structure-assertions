/*jslint white: true, browser: true, devel: true */
/*globals component */

(function(){
  "use strict";

  component('.awesome-component').assert( function(expect) {
      expect.to.have.attr("data-awesomeness");

      expect.optional.classes('data-awesome-default', 'data-awesome-danger', 'data-awesome-warn');
      expect.optional.attributes('data-awesome');
  });

  component('.awesome-component-header').assert( function(expect) {
      expect.to.be.descendant(".awesome-component");
  });

  component('.awesome-component-action').assert( function(expect) {
    expect.to.be.descendant(".awesome-component-content");
    expect.to.be.tag('button');
  });

  component('.awesome-component-action.big').assert( function(expect) {
    expect.to.be.deprecated();
  });
}());
