/*jslint white: true, browser: true, devel: true */
/*globals assert */

(function(){
  "use strict";

  component('.awesome-component').toHave( function(expect) {
      expect.to.have.attr("data-awesomeness");

      expect.optional.classes('data-awesome-default', 'data-awesome-danger', 'data-awesome-warn');
      expect.optional.attributes('data-awesome');
  });

  component('.awesome-component-header').toHave( function(expect) {
      expect.to.be.descendant(".awesome-component");
  });

  component('.awesome-component-action').toHave( function(expect) {
    expect.to.be.descendant(".awesome-component-content");
    expect.to.be.tag('button');
  });

  component('.awesome-component-action.big').toHave( function(expect) {
    expect.to.be.deprecated();
  });
}());
