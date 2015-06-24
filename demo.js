/*jslint white: true, browser: true, devel: true */
/*globals assert */

(function(){
  "use strict";

  assert('.awesome-component').toHave( function(expect) {
      expect.to.have.attr("data-awesomeness");
      expect.to.containChild('.awesome-component-footer');

      expect.optional.classes('data-awesome-default', 'data-awesome-danger', 'data-awesome-warn');
      expect.optional.attributes('data-awesome');
  });

  assert('.awesome-component-action').toHave( function(expect) {
    expect.to.be.tag('button');
  });

  assert('.awesome-component-action.big').toHave( function(expect) {
    expect.to.be.deprecated();
  });
}());
