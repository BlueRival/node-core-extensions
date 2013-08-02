core-extensions
====================

A set of extensions to the node core library, such as an Object.isObject()
method to parallel Array.isArray(), a clone() method on all objects and a
mixin() method on all objects, and a getType() method.

Name spacing is supported as of version 0.3.0. See new init function for details.

isObject() will return TRUE for anything that is typeof object, is not an Array, and is not NULL
clone.
getType() will return 'null' for NULL, 'array' for an Array, 'float' for a non-integer number, 'integer' for an integer number, and typeof result for all else.
clone() will return a distinct copy of the object it was called from. Date objects are cloned, arrays and objects are recursively cloned down 100 levels max and all else is just passed through.
mixin() will return a clone of the original object, with any passed in objects merged in recursively up to 100 levels max. mixin() accepts an arbitrary number of arguments, they will be mixed in from left to right.

Documentation
====================

For the time being, please see the test cases in test/default.js to understand
exactly how Object.isObject(), clone() and mixin() behave.


TO DO
====================

- write examples in this doc
- add support of custom clone functions based on object type
- add support of defaulting to clone() methods already on items to be cloned
- make each extension optional


License
====================

(The MIT License)

Copyright (c) 2012 BlueRival Software <anthony@bluerival.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
