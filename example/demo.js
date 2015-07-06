/*jslint white: true, browser: true, devel: true */
/*globals $, component */

(function(){
  "use strict";

  var componentAssertions, componentName, comp, $component, components, i, directions, optionals;

  componentAssertions = {};
  directions = ['top', 'right', 'bottom', 'left'];

  component.onError(function(obj, error){
    if (componentAssertions[obj.componentName] === undefined) {
      componentAssertions[obj.componentName] = [];
    }

    componentAssertions[obj.componentName].push({obj: obj, error: error});
  });

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

  for(componentName in componentAssertions) {
    if(componentAssertions.hasOwnProperty(componentName)) {
      components = componentAssertions[componentName];
      for (i = 0; i < components.length; i += 1) {
        comp = components[i];
        $component = $(comp.obj);
        $component.tooltipster({
          multiple: true,
          animation: 'fade',
          delay: 200,
          content: comp.error.message,
          theme: 'tooltipster-punk',
          position: directions[i % 3]
        });
        $component.tooltipster('show');
        $component.css('border', '2px solid #000');

        optionals = {};
        if (comp.obj.optional) {
          optionals = comp.obj.optional;
        }

        console.info("%c"+componentName+": \n\n"+comp.error.message, "color: blue;", " \n\n", {obj: comp.obj, optionals: optionals}, "\n\n");
      }
    }
  }

}());
