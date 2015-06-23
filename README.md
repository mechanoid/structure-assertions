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
