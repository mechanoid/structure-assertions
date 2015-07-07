/*jslint white: true, browser: true, devel: true, nomen: true */
/*globals $, component */

(function(){
  "use strict";

  // var componentAssertions, componentName, comp, $component, components, i, directions;
  //
  // componentAssertions = {};
  // directions = ['top', 'right', 'bottom', 'left'];

  // component.onError(function(error){
  //   if (componentAssertions[this.componentName] === undefined) {
  //     componentAssertions[this.componentName] = [];
  //   }
  //
  //   componentAssertions[this.componentName].push({obj: this._obj, error: error});
  // });

  component('.mdl-card').assert(function(expect) {
    expect.to.have.a.class('mdl-cell');
    expect.to.have.a.class('mdl-cell--12-col');
  });

  // for(componentName in componentAssertions) {
  //   if(componentAssertions.hasOwnProperty(componentName)) {
  //     components = componentAssertions[componentName];
  //     for (i = 0; i < components.length; i += 1) {
  //       comp = components[i];
  //       $component = $(comp.obj);
  //       $component.tooltipster({
  //         multiple: true,
  //         animation: 'fade',
  //         delay: 200,
  //         content: comp.error.message,
  //         theme: 'tooltipster-punk',
  //         position: directions[i % 3]
  //       });
  //       $component.tooltipster('show');
  //       $component.css('border', '2px solid #000');
  //     }
  //   }
  // }

}());
