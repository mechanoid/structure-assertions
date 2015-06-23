/*jslint white: true, browser: true */
/*globals assert */

(function(){
  "use strict";

  assert('.awesome-component').toHave( function(expect) {
      expect.to.be.hidden();
      expect.to.have.attr("data-awesomeness");
      expect.to.containChild('.awesome-component-footer');
  });

  assert('.awesome-component-action').toHave( function(expect) {
    expect.to.matchSelector('button');
  });
}());
