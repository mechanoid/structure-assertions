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

You may add some component assertions to your page (usually only in dev or test environments),
that will cry out for components that are out of sync to the frontend lib.

```js
assert('.awesome-component').toHave( function(expect) {
  expect.to.have.attr("data-awesomeness");
  expect.to.containChild('.awesome-component-footer');
});
```

With this in mind imagine a library of structure-assertions for [Bootstrap](http://getbootstrap.com/),
that may look like that.

**list-group**

```js
assert('.list-group').toHave( function(expect) {
  expect.to.matchSelector('ul,ol');
  expect.to.containChild('.list-group-item');
});

assert('.list-group-item').toHave( function(expect) {
  expect.to.matchSelector('li');
});
```
