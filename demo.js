/*jslint white: true, browser: true, devel: true */
/*globals assert */

(function(){
  "use strict";

  assert('.awesome-component').toHave( function(expect) {
      expect.to.have.attr("data-awesomeness");
      expect.to.containChild('.awesome-component-footer');
  });

  assert('.awesome-component-action').toHave( function(expect) {
    expect.to.be.tag('button');
  });

  assert('.awesome-component-action.big').toHave( function(expect) {
    expect.to.be.deprecated();
  });
}());
