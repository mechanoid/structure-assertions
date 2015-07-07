/*jslint white: true, browser: true, devel: true, nomen: true */
/*globals $, component */

(function(){
  "use strict";

  var simpleUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
  };

  component.onError(function(error){
    var $elem = $(this._obj),
        uuid = simpleUUID(),
        $tooltip = $('<span class="mdl-tooltip mdl-tooltip--large" for="' + uuid + '" />').text(error.message);

    $elem
      .attr('id', uuid)
      .css('border', '1px solid red')
      .after($tooltip);

  });

  component('.mdl-card').assert(function(expect) {
    expect.to.have.a.class('mdl-cell');
  });

  component('.mdl-card__title').assert(function(expect) {
    expect.to.be.descendantOf('.mdl-cell');
  });

  component('.mdl-card__title-text').assert(function(expect) {
    expect.to.be.descendantOf('.mdl-card__title');
  });

  component('.so-deprecated').assert(function(expect){
    expect.to.be.deprecated();
  });

  component('.mdl-button').assert(function(expect){
    expect.to.be.tag('button');
  });

}());
