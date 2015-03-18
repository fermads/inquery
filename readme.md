# inQuery

A JavaScript library with support for a subset of jQuery's API
using browser native methods for DOM selection, filtering,
traversal, manipulation, styling and events

## Instalation

Download `dist/inquery-[version].min.js` and add it to your html file

## API

The API is similar to jQuery:

####selection
- $('any css selector')
- $(window)
- $(document)
- $(selector, root)

####filter
- .find()
- .is()

####traversal
- .each()
- .get()
- .eq()

####manipulation
- .html()
- .text()
- .append()
- .prepend()
- .after()
- .before()
- .parents()
- .children()
- .siblings()
- .next()
- .prev()
- .remove()

####attribute
- .attr()
- .removeAttr()
- .addClass()
- .removeClass()
- .hasClass()

####event
- .on()
- .off()
- .ready()
- .trigger()
- .triggerHandler()

####style
- .hide()
- .show()
- .css()