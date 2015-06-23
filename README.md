# structure assertions

Many projects nowadays work with a centralized asset library that sports css and/or js components.
In many cases this library/framework is created from ux/marketing/whatever-agencies or much better in your own responsibility,
but in either way you are facing the same kind of problems.

An HTML interface contract is in place that binds the components maintained in the centralized repository
to the implementations created in apps that include this repository. Once the framework is released in a new version
this contract may be violated. Evolving designs may involve demands to the html structure they are applied on,
so that html and css usually have to be adjusted side to side.

In environments where frontend development is done beforehand or in a central repository,
so where side by side development is not possible we need a way to get in touch with those components
that become out of sync to the actual implementation.

In detail that means that we want to describe rules about our JS and CSS components,
that are must haves and can be asserted. While those assertion make a good deal about documentation,
they are not documenting all possibilities for your component.

Assertions are about breaking changes and must haves. We want to see directly when we are breaking the contract,
not if we have certain optional possibilities for a component. While i agree, that it would be nice
to have a direct link to the usage of a component (and all it options), we aim for clear and concise feedback about errors only.

## usage

### node

t.b.a

### browser

See that you have expect.js expect-dom.js and the structure-assertions.js libs available:

```html
<script src="./node_modules/expect-dom/vendor/expect.js"></script>
<script src="./node_modules/expect-dom/expect-dom.js"></script>
<script src="./structure-assertions.js"></script>
```

### examples

#### in general

You may add some component assertions to your page (usually only in dev or test environments),
that will cry out for components that are out of sync to the frontend lib.

```js
assert('.awesome-component').toHave( function(expect) {
  expect.to.have.attr("data-awesomeness");
  expect.to.containChild('.awesome-component-footer');
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
assert('.list-group').toHave( function(expect) {
  expect.to.matchSelector('ul,ol');
  expect.to.containChild('.list-group-item');
});

assert('.list-group-item').toHave( function(expect) {
  expect.to.matchSelector('li');
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
assert('.panel').toHave( function(expect) {
  expect.to.containChild('.panel-heading,.panel-body');
});

assert('.panel-danger').toHave( function(expect) {
  expect.to.be.deprecated();
});
```
