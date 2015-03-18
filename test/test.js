
// module core

module('Core'); //////////////////////////////////////////////////////////////////

test('namespace', function() {
  equal( window.inQuery, inQuery, 'window.inQuery namespace is inQuery' );
  equal( window.inQuery, inQuery, 'window.inQuery namespace is inQuery' );
  equal( window.$, jQuery, 'window.inQuery is NOT inQuery' );
});

test('length', function() {
  equal( inQuery('#test').length, 1, '#test length should be 1' );
  equal( inQuery('.test').length, 2, '.test length should be 2' );
  equal( inQuery('.nonExistant').length, 0, 'non existant .class length should be 0' );
  equal( inQuery('#nonExistant').length, 0, 'non existant #id length should be 0' );
  equal( inQuery('dl').length, 0, 'non existant tag length should be 0' );
  equal( inQuery('.dl > ul #header').length, 0, 'non existant expression length should be 0' );
});

test('chaining', function() {
  inQuery('.test').attr('title','testing')
    .append('<i>2</i>')
    .prepend('<i>1</i>')
    .addClass('testing')
    .hide().css('color','red');

  var ok = false;
  if(inQuery('.test').eq(0).hasClass('testing')
  && inQuery('.test').eq(1).hasClass('testing')
  && inQuery('.test').eq(0).css('display') == 'none'
  && inQuery('.test').eq(1).css('display') == 'none'
  && inQuery('i').length == 4)
    ok = true;

  inQuery('.test').removeClass('testing').show();
  inQuery('i').remove();
  equal( ok, true, 'chaining multiple operations' );
});

module('Selector'); //////////////////////////////////////////////////////////////

test('window', function() {
  equal( inQuery(window).get(0), window, 'window is a valid selector' );
});

test('document', function() {
  var title = inQuery(document).get(0).title;
  inQuery(document).get(0).title = 'test123';
  equal( inQuery(document).get(0).title, 'test123', 'document.title is test123' );
  inQuery(document).get(0).title = title;
  equal( inQuery(document).get(0), document, 'document is a valid selector' );
});

test('objects', function() {
  var domo = document.getElementById('test');
  equal( inQuery(domo).attr('id'), 'test', 'object from getElementById() is a valid selector' );

  var domox = document.getElementsByClassName('test');
  equal( inQuery(domox).attr('class'), 'test', 'objects from getElementsByClassName() are valid selectors' );

  var domoy = document.querySelectorAll('#qunit-fixture [title="cool"]');
  equal( inQuery(domoy).attr('class'), 'maintest', 'objects from querySelectorAll() are valid selectors' );
});

test('inQuery object', function() {
  var uq = inQuery(window);
  equal( inQuery(uq).get(0), window, 'inQuery object is a valid selector' );
});

test('#id', function() {
  equal( inQuery('#test').length, 1, '#id is a valid selector' );
  equal( inQuery('#test').attr('id'), 'test', 'the attribute id of a selector #test is test' );
});

test('.class', function() {
  equal( inQuery('.test').length, 2, '.class is a valid selector' );
  equal( inQuery('.test').eq(0).attr('id'), 'li1', 'id attribute of .test:eq(0)#li1 is li1' );
  equal( inQuery('.test').eq(1).attr('id'), 'li2', 'id attribute of .test:eq(1)#li2 is li2' );
});

test('tag', function() {
  inQuery('#test').append('<i>1</i><i>2</i>');
  equal( inQuery('i').length, 2, 'tagName is a valid selector' );
  equal( inQuery('*').get(0).tagName.toLowerCase(), 'html', 'the '*' (meaning all tags) is a valid selector' );
});

test('expression', function() {
  equal( inQuery('#test-list li').length, 2, 'expression "#test-list li" is a valid selector' );
  equal( inQuery('div[title="cool"]').length, 1, 'expression div[title="cool"] is a valid selector' );
  equal( inQuery('div>ul').length, 1, 'expression "div>ul" is a valid selector' );
  equal( inQuery('div:nth-of-type(1)').length, 2, 'expression "div:nth-of-type(1)"" is a valid selector' );
  equal( inQuery('#li1.test').length, 1, 'expression "#li1.test" is a valid selector' );
});

module('Style'); /////////////////////////////////////////////////////////////////
test('css', function() {
  inQuery('#test').css('color', 'red');
	equal( inQuery('#test').css('color'), 'red', '#test color is changed to red' );
  inQuery('#test').css('color', 'blue');
  equal( inQuery('#test').css('color'), 'blue', '#test color is changed to blue' );

  var ok = true;
  inQuery('.test').css('color','red');
  inQuery('.test').each(function() {
    if(this.style.color != 'red')
      ok = false;
  });
  equal( ok, true, 'all .test colors ar changed to red' );

  inQuery('#test').css({'fontSize':'12px','width':'100px'});
  equal( inQuery('#test').css('fontSize') + inQuery('#test').css('width') , '12px100px', 'change multiple properties with {"style":"value","style":"value"}' );

});

test('hide', function() {
  inQuery('#test').show().hide();
  equal( inQuery('#test').css('display'), 'none', '#test has display changed to none' );
  inQuery('.test').hide();
  var ok = true;
  inQuery('.test').each(function() {
    if(this.style.display != 'none')
      ok = false;
  });
  equal( ok, true, 'all .test have display changed to none' );
});

test('show', function() {

  inQuery('#test').hide().show();
  inQuery('.test').hide().show();

  equal( inQuery('#test').css('display'), 'block', '#test has display changed to block' );
  var ok = true;
  inQuery('.test').each(function(o) {
    if(inQuery(this).css('display') != 'list-item')
      ok = false;
  });
  equal( ok, true, 'all .test have display changed to list-item' );
});

module('Traversal'); //////////////////////////////////////////////////////////////

test('get', function() {

  equal( inQuery('.test').get(0).id, 'li1', '.test.get(0) #id shoud be li1' );
  equal( inQuery('.test').get(1).id, 'li2', '.test.get(1) #id shoud be li2' );
  equal( inQuery('.test').get() instanceof Array, true, '.test.get() should be an instanceof Array' );

  var error = false;
  inQuery('.test').get().forEach(function(a) {
    if(a.id != 'li1' && a.id != 'li2')
      error = true;
  });
  equal( error, false, '.test.get().forEach() should work' );

});

test('eq', function() {

  equal( inQuery('.test').eq(0).attr('id'), 'li1', '.test.eq(0).attr(id) shoud be li1' );
  equal( inQuery('.test').eq(1).attr('id'), 'li2', '.test.eq(1).attr(id) shoud be li2' );
  var error = false;
  inQuery('.test').eq().each(function(i, a) {
    if(a.id != 'li1' && a.id != 'li2')
      error = true;
  });
  equal( error, false, '.test.eq().each() should work' );

});

/*
test('next', function() {
  equal( inQuery('#test').next().attr('id'), 'test-list', '.test.eq(0).attr(id) shoud be li1' );
});

test('prev', function() {
  equal( inQuery('#li2').prev().attr('id'), 'li1', '.test.eq(0).attr(id) shoud be li1' );
});
*/

test('each', function() {
  var ok = true;
  inQuery('.test').css('color','red');
  inQuery('.test').each(function() {
    if(this.style.color != 'red')
      ok = false;
  });
  equal( ok, true, '.each is working' );
});

module('Manipulation'); //////////////////////////////////////////////////////////////
test('html', function() {
  equal( inQuery('.test').html(), 'testclass1', '.test.html() shoud be testclass1' );
  inQuery('#test').html('<span id="anothertest">anothertest</span>');
  equal( inQuery('#anothertest').html(), 'anothertest', '#anothertest.html() shoud be anothertest' );
  inQuery('#anothertest').remove();
});

test('text', function() {
  inQuery('#test').html('<span id="anothertest">anothertest</span>');
  equal( inQuery('#test').text(), 'anothertest', '#test.text() shoud be anothertest' );
  inQuery('#anothertest').text('anothertest2');
  equal( inQuery('#test').text(), 'anothertest2', '#test.text() shoud be anothertest2' );
  inQuery('#anothertest').remove();
});

test('append', function() {
  inQuery('#test').append('<i>1</i>');
  inQuery('#test').append('<i>2</i>');
  inQuery('#test').append('<i>3</i>');

  equal( inQuery('#test i').eq(0).html(), 1, 'first append is the first element' );
  equal( inQuery('#test i').eq(1).html(), 2, 'second append is the second element' );
  equal( inQuery('#test i').eq(2).html(), 3, 'third append is the third element' );

  inQuery('.test').append('<i>1</i>').append('<i>2</i>').append('<i>3</i>');
  var error = false;
  inQuery('.test i').each(function(i, o) {
    if(o.innerHTML != i%3+1) {
      error = true;
    }

  });
  equal( error, false, 'multiple append on .test' );
});

test('prepend', function() {
  inQuery('#test').prepend('<i>1</i>');
  inQuery('#test').prepend('<i>2</i>');
  inQuery('#test').prepend('<i>3</i>');

  equal( inQuery('#test i').eq(0).html(), 3, 'first prepend is the last' );
  equal( inQuery('#test i').eq(1).html(), 2, 'second prepend is the second' );
  equal( inQuery('#test i').eq(2).html(), 1, 'third prepend is the first' );

  inQuery('.test').prepend('<i>1</i>').prepend('<i>2</i>').prepend('<i>3</i>');
  var error = false;
  inQuery('.test i').each(function(i, o) {
    if(o.innerHTML != 3-i%3) {
      error = true;
    }
  });
  equal( error, false, 'multiple prepend on .test' );

});

test('after', function() {
  inQuery('#test').after('<div id="test-after">after</div>');

  equal( inQuery('#test + #test-after').html(), 'after', '#test-after is after #test' );

  equal( inQuery('#qunit-fixture :nth-child(2)').html(), 'after', '#test-after is the second child of #qunit-fixture' );

  inQuery('#test-list li').after('<i>1</i>');
  var error = false;
  inQuery('#test-list *').each(function(i, o) {
    if(o.tagName.toLowerCase() == 'i' && o.innerHTML != '1') {
      error = true;
    }
  });
  equal( error, false, 'all i elements are after li elements' );
});

test('before', function() {
  inQuery('#test').before('<div id="test-before">before</div>');
  equal( inQuery('#test-before + #test').html(), 'testid', '#test-before is before #test' );

  equal( inQuery('#qunit-fixture :first-child').html(), 'before', '#test-before is the first child of #qunit-fixture' );

  inQuery('#test-list li').before('<i>1</i>');
  var error = false;
  inQuery('#test-list *').each(function(i, o) {
    if(o.tagName.toLowerCase() == 'i' && o.innerHTML != '1') {
      error = true;
    }
  });
  equal( error, false, 'all i elements are before li elements' );
});

test('remove', function() {
  inQuery('#test').remove();
  equal( inQuery('#test').length, 0, 'remove by #id' );

  inQuery('.test').remove();
  equal( inQuery('.test').length, 0, 'remove by .class' );

  QUnit.reset();
  inQuery('#test').append('<i>ii</i><i>iii</i>');
  inQuery('i').remove();
  equal( inQuery('i').length, 0, 'remove by tagName' );

  inQuery('[title="cool"]').remove();
  equal( inQuery('#test').length + inQuery('[title=cool]').length, 0, 'remove by expression [attr=value]' );

  inQuery('#li1, #li2').remove();
  equal( inQuery('#li1, #li2').length, 0, 'remove by expression #id1, #id2' );
});


module('Attribute'); //////////////////////////////////////////////////////////////
test('attr', function() {
  inQuery('#test').attr('title','titletest');
  equal( inQuery('#test').attr('title'), 'titletest', '#test.attr("title") shoud be titletest' );
});

test('removeAttr', function() {
  inQuery('#test').attr('title','titletest');
  inQuery('#test').removeAttr('title');
  equal( inQuery('#test').attr('title'), null, '#test.attr("title") shoud be null' );
});

test('hasClass', function() {
  equal( inQuery('#test').hasClass('maintest'), true, '#test.hasClass "mainclass" shoud be true' );
  equal( inQuery('#test').hasClass('fakeclass'), false, '#test.hasClass "fakeclass" shoud be false' );
  var error = false;
  inQuery('.test').each(function(i, a) {
    if(!inQuery(a).hasClass('test'))
      error = true;
  });
  equal( error, false, '.test.hasClass "test" shoud be true' );
});

test('addClass', function() {
  inQuery('#test').addClass('anotherclass');
  equal( inQuery('#test').hasClass('anotherclass'), true, '#test.addClass "anotherclass" shoud be true' );
});

test('removeClass', function() {
  var x = inQuery('#test').get(0).className;
  inQuery('#test').removeClass();
  equal( inQuery('#test').get(0).className, '', '#test.get(0).className shoud be ""' );
  inQuery('#test').get(0).className = x + ' testclassname';
  inQuery('#test').removeClass('testclassname');
  equal( inQuery('#test').hasClass('testclassname'), false, '#test.hasClass "testclassname" shoud be false' );
  inQuery('#test').get(0).className = x;
});

module('Event'); //////////////////////////////////////////////////////////////
test('on', function() {

  inQuery('#test').on('click',function() {
    this.innerHTML = 'onclickok';
  });
  inQuery('#test').trigger('click');
  equal( inQuery('#test').get(0).innerHTML, 'onclickok', '#id has click event bound to it' );

  inQuery('.test').on('click',function() {
    this.innerHTML = 'onclickok';
  });

  inQuery('.test').each(function() {
    inQuery(this).trigger('click');
  });

  var error = false;
  inQuery('.test').each(function() {
    if(this.innerHTML != 'onclickok')
      error = true;
  });
  equal( error, false, 'all .test have event bound to it' );

  inQuery('#qunit-fixture ul .test').on('dblclick', function() {
    this.innerHTML = 'dblclickok';
  });

  inQuery('#qunit-fixture ul .test').trigger('dblclick');

  error = false;
  inQuery('#qunit-fixture ul .test').each(function() {
    if(this.innerHTML != 'dblclickok')
      error = true;
  });
  equal( error, false, 'expression "#qunit-fixture ul .test" has dblclick bound to it' );

  inQuery('#test').on('click.namespace',function() {
    this.innerHTML = 'onclicknamespace';
  });
  inQuery('#test').trigger('click');
  equal( inQuery('#test').get(0).innerHTML, 'onclicknamespace', '#id has a custom namespace "click.namespace" bound to it' );

  inQuery('#test').on('tripleclick',function() {
    this.innerHTML = 'ontripleclick';
  });
  inQuery('#test').trigger('tripleclick');
  equal( inQuery('#test').get(0).innerHTML, 'ontripleclick', '#id has a custom event "tripleclick" bound to it' );

});

test('off', function() {

  inQuery('#test').on('click',function() {
    this.innerHTML = 'clickok';
  });
  inQuery('#test').off('click');
  inQuery('#test').trigger('click');

  equal( inQuery('#test').text(), 'testid', 'remove binding by event name' );


  inQuery('#test').on('click.namespace',function() {
    this.innerHTML = 'clicknamespace';
  });
  inQuery('#test').off('click.namespace');
  inQuery('#test').trigger('click');

  equal( inQuery('#test').text(), 'testid', 'remove binding by event.namespace' );

  var handler = function() {
    this.innerHTML = 'clicknamespace';
  };
  inQuery('#test').on('click', handler);
  inQuery('#test').off('click', handler);
  inQuery('#test').trigger('click');

  equal( inQuery('#test').text(), 'testid', 'remove binding by handler function(){}' );

  inQuery('#test').on('customevent',function() {
    this.innerHTML = 'clickcustom';
  });
  inQuery('#test').off('customevent');
  inQuery('#test').trigger('customevent');

  equal( inQuery('#test').text(), 'testid', 'remove custom event binding by custom event name' );


  inQuery('#qunit-fixture ul .test').on('dblclick', function() {
    this.innerHTML = 'dblclickok';
  });

  inQuery('#qunit-fixture ul .test').off('dblclick');
  var error = false;
  inQuery('#qunit-fixture ul .test').each(function() {
    if(this.innerHTML != 'testclass1' && this.innerHTML != 'testclass2')
      error = true;
  });
  equal( error, false, 'expression "#qunit-fixture ul .test" should have dblclick unbound to it from all .test' );
});

test('ready', function() {
  inQuery(document).ready(function() {
    window.x = 1;
  });
  inQuery(document).trigger('DOMContentLoaded');
  equal( window.x, 1, 'Execute code on DOMContentLoaded (forced with .trigger())' );
  inQuery('#test').remove();
});

test('trigger', function() {
  // event exist, custom event, bubling
  inQuery('#test').on('click', function() {
    this.innerHTML = 'clickok';
  }).trigger('click');

  equal( inQuery('#test').text(), 'clickok', 'trigger click on #id' );

  inQuery('.test').on('click', function() {
    this.innerHTML = 'clickok';
  }).trigger('click');

  var error = false;
  inQuery('.test').each(function() {
    if(this.innerHTML != 'clickok')
      error = true;
  });

  equal( error, false, 'trigger click on .class' );

  inQuery('#test').on('tripleclick', function() {
    this.innerHTML = 'tripleclick';
  });

  inQuery('#test').trigger('tripleclick');

  equal( inQuery('#test').html(), 'tripleclick', 'trigger custom event on #id' );


  inQuery('#test').on('click.nice', function() {
    this.innerHTML = 'click.nice';
  });

  inQuery('#test').trigger('click.nice');

  equal( inQuery('#test').html(), 'click.nice', 'trigger event by namespace on #id' );

  inQuery('#li1').off('click');
  inQuery('#li1').html('');
  inQuery('#li1').on('click', function() {
    this.innerHTML += 'clicked';
  });

  inQuery('#li1').on('click.custom', function() {
    this.innerHTML += 'custom';
  });

  inQuery('#li1').trigger('click');
  equal( inQuery('#li1').html(), 'clickedcustom', '#id has 2 bound events, trigger both' );

  inQuery('#li1').trigger('click.custom');
  equal( inQuery('#li1').html(), 'clickedcustomcustom', '#id has 2 bound events, trigger only one (click.custom)' );

  inQuery('#test-list').on('click', function() {
    inQuery('#li2').html('#test-list-clicked');
  });

  inQuery('#li2').on('click', function() {
    inQuery('#li2').html('#li2-clicked');
  });

  inQuery('#li2').trigger('click', false);
  equal( inQuery('#li2').html(), '#li2-clicked', 'do not bubble events from children to parent' );
});

test('triggerHandler', function() {
  inQuery('#li1').on('click', function() {
    this.innerHTML = 0;
  });
  inQuery('#li1').on('click.one', function() {
    this.innerHTML = 1;
  });
  inQuery('#li1').on('click.two', function() {
    this.innerHTML = 2;
  });
  inQuery('#li1').triggerHandler('click');
  equal( inQuery('#li1').text(), 0, 'trigger the function (handler) of click, do not execute the browser\'s click event (wich would trigger other bound handlers)' );
});
