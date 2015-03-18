(function(global){

var inq = {

  init : function() {
    global.inQuery = function(sel, root) {
      return inq.selector(sel, root);
    };

    if(!global.$)
      global.$ = global.inQuery;
  },

  selector : function(sel, root) {
    var obj;
    root = root || document;

    if(!sel)
      obj = [];
    else if (sel == global)
      obj = [global];
    // document, dom object, inQuery object, and getElementsByClassName
    // in safari (is typeof 'function')
    else if (typeof sel == 'object' || typeof sel == 'function')
      obj = sel.obj ? sel.obj : sel;
    else if(sel.indexOf(' ') != -1 || sel.indexOf(',') != -1
      || sel.indexOf('[') != -1 || sel.indexOf(':') != -1
      || sel.indexOf('>') != -1 || sel.lastIndexOf('.') > 0
      || sel.lastIndexOf('#') > 0)
      obj = root.querySelectorAll(sel);
    else if(sel.lastIndexOf('#') === 0)
      obj = document.getElementById(sel.substring(1, sel.length));
    else if(sel.lastIndexOf('.') === 0)
      obj = root.getElementsByClassName(sel.substring(1, sel.length));
    else
      obj = root.getElementsByTagName(sel);

    return inq.make(obj);
  },

  arr : function(a) {
    return Array.prototype.slice.call(a);
  },

  make : function(obj) {
    if(!obj)
      obj = [];

    if(obj.length === undefined) // make it an array
      obj = [obj];

    $.obj = obj;
    $.length = obj.length;
    return $;
  }
};


var $ = {
  /* module : filter */

  find : function(sel) {
    var n = [];
    return $.each(function(i, obj) {
      n = n.concat(Array.prototype.slice.call(inq.selector(sel, obj).obj));
    }).make(n);
  },

  is : function(sel) {
    var x = $.obj, found = false;
    inq.selector(sel).each(function(i, obj) {
      for(var n = 0, z = x.length; n < z; n++) {
        if(obj == x[n])
          found = true;
      }
    });
    return found;
  },

  /* module : traversal */
  each : function(func) {
    (function(obj){
      for(var i = 0, x = obj.length; i < x; i++) {
        func.call(obj[i], i, obj[i]);
      }
    })($.obj);

    $.make = inq.make;
    return $;
  },

  get : function(index) {
    return index !== undefined
    	? $.obj[index] : Array.prototype.slice.call($.obj);
  },

  eq : function(index) {
    $.obj = [ $.obj[ index || 0 ] ];
    return $;
  },

  /* module : manipulation */
  html : function(sel) {
    return sel === undefined ? $.obj[0].innerHTML : $.each(function(i, obj) {
      obj.innerHTML = sel;
    });
  },

  text : function(sel) {
    return sel === undefined ? $.obj[0].textContent : $.each(function(i, obj) {
      obj.textContent = sel;
    });
  },

  append : function(sel) {
    return $.each(function(i, obj){
      obj.insertAdjacentHTML('beforeEnd', sel);
    });
  },

  prepend : function(sel) {
    return $.each(function(i, obj){
      obj.insertAdjacentHTML('afterBegin', sel);
    });
  },

  after : function(sel) {
    return $.each(function(i, obj){
      obj.insertAdjacentHTML('afterEnd', sel);
    });
  },

  before : function(sel) {
    return $.each(function(i, obj){
      obj.insertAdjacentHTML('beforeBegin', sel);
    });
  },

  parents : function(sel) {
    var n = [], obj = $.obj[0];
    while (obj = obj.parentNode) {
      if(obj.nodeType === 1 && (sel === undefined
      		|| global.inQuery(obj).is(sel)))
        n.push(obj);
    }
    return inq.make(n);
  },

  children : function() {
    var n = [];
    return $.each(function(i, obj) {
      for(var j = 0, cn = obj.childNodes; j < cn.length; j++) {
        if(cn[j].nodeType === 1)
          n.push(cn[j]);
      }
    }).make(n);
  },

  sib : function(d) {
    var n = [];
    return $.each(function(i, obj) {
    if(obj[d])
      n.push(obj[d]);
    }).make(n);
  },

  siblings : function() {
    var n = [];
    return $.each(function(i, obj) {
      var c = obj.parentNode.childNodes;
      for(var j = 0; j < c.length; j++) {
        if(c[j] !== obj && c[j].nodeType === 1) {
          n.push(c[j]);
        }
      }
    }).make(n);
  },

  next : function() {
    return $.sib('nextElementSibling');
  },

  prev : function() {
    return $.sib('previousElementSibling');
  },

	// getElementsByClassName and getElementsByTagName generate live node lists.
	// Iteration must be backwards
  remove : function() {
    for(var i = $.obj.length - 1; i >= 0; i--) {
      if($.obj[i].parentNode)
        $.obj[i].parentNode.removeChild($.obj[i]);
    }
    return $;
  },

  /* module : attribute */
  attr : function(attr, value) {
    return !value ? $.obj[0].getAttribute(attr) : $.each(function(i, obj) {
      obj.setAttribute(attr, value);
    });
  },

  removeAttr : function(attr) {
    return $.each(function(i, obj) {
      obj.removeAttribute(attr);
    });
  },

  addClass : function(cname) {
    return $.each(function(i, obj) {
      obj.className = obj.className +' '+ cname;
    });
  },

  removeClass : function(cname) {
    return $.each(function(i, obj) {
      var a;
      obj.className = !cname ? '' : (a = obj.className.split(' '),
        a.splice( a.indexOf(cname) , 1),
        a.join(' ') );
    });
  },

	// jQuery seems to verify all objects and return true if one has the class
  hasClass : function(cname) {
     return (' '+ $.obj[0].className +' ').indexOf(' '+ cname +' ') != -1
     	? true : false;
  },

  /* module : event */
  on : function(event, func) { // do not accept multiple namespaces "click.a.b"
    return $.each(function(i, obj) {
      obj.addEventListener(event.split('.')[0], func, false);
      obj['event'+ event] = func;
    });
  },

  off : function(event, func) {
    return $.each(function(i, obj) {
      obj.removeEventListener(event.split('.')[0], func
      	|| obj['event'+ event], false);
      delete obj['event'+ event];
    });
  },

  ready : function(func) {
    return $.on('DOMContentLoaded', func);
  },

  trigger : function(event, b) { // b for bubbling. Default is true
    return $.each(function(i, obj) {
      var eventElement = document.createEvent('Event');
      eventElement.initEvent(event, !(b === false), true);
      event.indexOf('.') == -1
      	? obj.dispatchEvent(eventElement) : obj['event'+ event]();
    });
  },

  triggerHandler : function(event) {
    var args = arguments;
    return $.each(function(i, obj) {
      obj['event'+ event](args);
    });
  },

  /* module : style */
  hide : function() {
    return $.each(function(i, obj){
      var display = global.getComputedStyle(obj).getPropertyValue('display');
      if(display != 'none')
        obj.originalDisplay = display;
      obj.style.display = 'none';
    });
  },

  show : function() {
    return $.each(function(i, obj){
      obj.style.display = obj.originalDisplay || 'block';
      delete obj.originalDisplay;
    });
  },

  css : function(prop, value) {
    if(value) { // css set
      var x = {}; x[prop] = value; prop = x;
    }

    return typeof prop != 'object' ? $.obj[0].style[prop]
    		|| global.getComputedStyle($.obj[0]).getPropertyValue(prop)
    		: $.each(function(i, obj) {
      for(var key in prop) {
        obj.style[key] = prop[key];
      }
    });
  }
};

inq.init();

})(this);