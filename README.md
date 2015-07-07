[![Build Status](https://travis-ci.org/mechanoid/structure-assertions.svg?branch=master)](https://travis-ci.org/mechanoid/structure-assertions)
[![npm version](https://badge.fury.io/js/structure-assertions.svg)](http://badge.fury.io/js/structure-assertions)
[![bower version](https://badge.fury.io/bo/structure-assertions.svg)](http://badge.fury.io/bo/structure-assertions)

# structure assertions

## introduction

Many projects nowadays work with a centralized asset library that sports css and/or js components.
In many cases this library/framework is created from ux/marketing/whatever-agencies or much better in your own responsibility,
but in either way you are facing the same kind of problems.

An **HTML interface** contract is in place that binds the components maintained in the centralized repository
to the implementations created in apps that include this repository. Once the framework is released in a new version this contract may be violated. Evolving designs may involve demands to the html structure they are applied on, so that html and css usually have to be adjusted side to side.

While a good frontend framework is provided with [semantic versioning](http://semver.org/) which gives you information if new features are added or either the interface to some of your components have changed, it is still hard to figure out which components have changed and what you have to adjust.

Where other frontend libraries try to share global templates as part of their frontend library, it may be better to give the consumer a hint about where the usage of the library is out of sync and what has to be done to get it aligned again.

**Structure Assertions** provide a possibility to enrich a front-library / styleguide / js-component with assertions, that consumers of that lib can include in his page,
to see if their implementations are matching the expectations made by the lib.

## usage

### node

Structure Assertions are meant to be run in the actual code of the consumer,
so a node-only usage may make no sense. Anyway we will provide a npm version soon, to
have the library available in headless browser scenarios and similar available.

### browser

See that you have chai.js and the structure-assertions.js libs available via `npm`, `bower` or raw download from github:

```sh
npm install --save-dev chai
npm install --save-dev structure-assertions

# or

bower install --save-dev chai
bower install --save-dev structure-assertions
```

```html
<script src="./node_modules/chai/chai.js"></script>
<script src="./node_modules/structure-assertions/dist/structure-assertions.js"></script>
```

---

### demo

have a look at the [demo](https://mechanoid.github.io/structure-assertions/example/demo.html) page,
with assertion errors highlighted with tooltipster - tooltips.

---

### assertion api

#### declaring a frontend component and its assertions

basically the structure assertions library offers the `component` function, which defines a component and offers the ability to specify its assertions.

```js
// @param selector [String] - css selector, at the moment also used as the component identifier
component(selector)
```

```js
// @param expect - chai assertion of a specific dom element
var assertions = function(expect) {
  /* ... */
};

# @param assertions [Function] - function callback
component('.example').assert(assertions);
```



#### declaring the 'must haves' for a component

**class dependency**

Declare a class the component must have. Think of components, that make only sense when combined with other components.

```js
component('.hilarious').assert(function(expect) {
  // will cry out loud in case the component has no class awesome
  expect.to.have.class('awesome');
});
```

**attribute dependency**

Attribute dependencies are for example very helpful to assert that a component is aligned to the js code, so that functions can work properly.
For sure that does not replace proper error handling in your javascript code, but think of structure assertions as a possibility to test your current html code against structure assertions of later versions of a central frontend library.

```js
component('.tutorial').assert(function(expect) {
  // will moan about a missing attribute data-message or when it is not of the given value.
  expect.to.have.an.attribute('data-message', 'Hello, World!');
});
```

**child dependency**

A child assertion is a strong assumption, that should be used only in rare cases. But sometimes it is mandatory, that a component has to have a certain child, to have it work as expected.

But please consider that HTML components should be as flexible as possible, so it may make more sense to use the `descendantOf`-assertion
in favor of the `child`-assertion when possible.

```js
component('.example').assert(function(expect) {
  expect.to.have.a.child('.example-child');
});
```

**parent dependency**

It may be important that a sub component lies directly inside of its parent component,
and if it is like that, you may specify it now with the `descendant` or `descendantOf` assertion.

```js
component('.example').assert(function(expect) {
  // example must have a direct parent specified by the selector or the world is gonna end.
  expect.to.be.a.descendantOf('.mother-of-all-examples');
});
```



#### declaring the 'optionals' for a component

While many assumptions are mandatory for a component, some are not.

And yes, it does not really make sense to define assertions for things,
that may, or may not be, the structure assertions provide a nice place,
to document things like that.

But because of the optional character of that, the default implementation
of the callback of 'what to do with optionals' is empty.

But you may provide a callback that kicks in for every optional assertion,
that is defined. With this in your toolkit you  may for example create tooltips,
that give hints about additional usage of a component.


**optional class(es)**

One of the main case may be to specify alternative classes that can be applied to a component,
to adjust its default behaviour.

```js
component('.example').assert(function(expect) {
  // example may have the class example-danger
  expect.to.may.have.a.class('example-danger');

  // and example may have the class example-warn
  expect.to.may.have.a.class('example-warn');
});
```

There is also a method to define multiple additional attributes at once.

```js
component('.example').assert(function(expect) {
  // example may have the classes example-danger, example-warn or example-success
  expect.to.may.have.any.classes('example-danger', 'example-warn', 'example-success');
});
```

**optional attribute**

Similar important to change a components behaviour may be to give it some additional attributes,
like for example `data-remote`, which some may recognize from Ruby on Rails' form-helper,
which makes forms to send its data via ajax.

```js
component('.example').assert(function(expect) {
  // and example may have the attribute data-remote
  expect.to.may.have.an.attribute('data-remote');
});
```

#### other helpful declarations

**deprecation**

components of some kind may be not maintained anymore, may have lost its purpose or are just replaced by
another component. In such cases it may make sense to flag such component usage as deprecated.

```js
component('.old-example').assert(function(expect) {
  // just blame this kind of stuff!
  expect.to.be.deprecated('');
});
```

---

### examples

#### in general

You may add some component assertions to your page (usually only in dev or test environments), that will cry out for components that are out of sync to the frontend lib.

```js
component('.awesome-component').assert( function(expect) {
  expect.to.have.an.attribute("data-awesomeness", "true");
});

component('.awesome-component-content').assert( function(expect) {
  expect.to.be.a.descendantOf('.awesome-component');
}
```

> NOTE: please consider to make assupmtions as weak as possible in component design.
> As shown in the examble above there may be components that may have certain children,
> but in case the component would work without such a child component, we should
> declare them as optional by reversing the relationship constraint in declaring the
> child component to have to be a descendant to its parent component.

#### optionals

In detail that means that we want to describe rules about our JS and CSS components,
that are must haves and can be asserted. While those assertion make a good deal about documentation, they are not documenting all possibilities for your component.

While assertions are about breaking changes and must haves, where we want to see directly when we are breaking the contract, assertions are not telling us if we have certain optional possibilities for a component. Therefore structure-assertions may have additional optionals defined that are available on the asserted object and will be printed to the debug console for default.

But the real match may be the assertion definition itself, where it may be a proper documentation about optionals.

```js
component('.awesome-component').assert( function(expect) {
    expect.to.may.have.any.classes('data-awesome-default', 'data-awesome-danger', 'data-awesome-warn');
    expect.to.may.have.an.attribute('data-awesome');
});
```


#### for something like twitters Bootstrap

With this in mind imagine a library of structure-assertions for [Bootstrap](http://getbootstrap.com/),
that may look like that.

**list-group**

```html
<ul class="list-group">
  <li class="list-group-item">Cras justo odio</li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
```

```js
component('.list-group').assert( function(expect) {
  expect.to.be.tag('ul,ol');
  expect.to.have.a.child('.list-group-item');
});

component('.list-group-item').assert( function(expect) {
  expect.to.be.tag('li');
  expect.to.be.a.descendantOf('.list-group');
});
```

**panel**

```html
<div class="panel panel-danger">
 <div class="panel-heading">Panel heading without title</div>
 <div class="panel-body">
   Panel content
 </div>
</div>
```

```js
component('.panel').assert( function(expect) {
  expect.to.have.a.child('.panel-body');
  expect.to.may.have.any.classes('panel-primary', 'panel-success', 'panel-info', 'panel-warning', 'panel-danger');
});

component('.panel-heading').assert( function(expect) {
  expect.to.be.tag('div');
}

component('.panel-body').assert( function(expect) {
  expect.to.be.tag('div');
}

component('.panel-body, .panel-footer, .panel-heading').assert( function(expect) {
  expect.to.be.a.descendantOf('.panel');
}

component('.panel-danger').assert( function(expect) {
  // only an example ;)
  expect.to.be.deprecated();
});
```

## Credits

The MIT License (MIT)

Copyright (c) 2015 Falk Hoppe <falkhoppe81@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

### 3rd-party

Internally the structure-assertions library relies heavily on:

[Chai](http://chaijs.com/) by Jake Luer <jake@alogicalparadox.com>
