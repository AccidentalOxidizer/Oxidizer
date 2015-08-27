// Notes 

// Obejctive: Find unique identifing path for a webpage

// Should we enable commenting for obviously dynamic content? 
// For instances: Google search results .. ?
// I think NO

// Should we account for hashbang and hash routing? 
// Some angular apps don't resolve their hashbangs & use that.
// Maybe?

// Should we work with google.com and www.google.com? 
// I don't think so. A quick testing has shown, they usually redirect

// Should we ignore https vs http?
// YES

// Should we strip port info? (:8080) 
// YES


// Easteregg: localhost / 127.0.0.1 :)
// We should have a special message here...


// Rules for url = parse(url);

// http / htpps - ignore. strip
// ? query strings
// # or not? only /#/ - otherwise strip 
// subdmain handling: if www. strip() (what about www1 / www2. / etc .. ) NO!
// user:pass@ - strip anything before @ ? NO!
// port information  -should be striped (:8080) YES


// Notes for testing url parsing

var URLtests = {
  // 'http://www.google.com': 'google.com/',
  // 'https://www.google.com': 'google.com/',
  // 'http://google.com': 'google.com/',
  // 'https://google.com': 'google.com/',
  // 'http://www.google.com/#': 'www.google.com/',
  // 'http://ww.google.com/#!/bar?baz=23': 'www.google.com/',
  // 'http://www.google.com/?baz=23#!/bar': 'www.google.com/',
  // 'http://www.google.com/#!?name=123': 'www.google.com/',
  // 'https://google.com/#/hello?this&that?or=more': 'www.google.com/#/hello',
  // 'http://www.google.com/some/long/path': 'www.google.com/some/long/path',
  // 'https://www.google.com/search?q=query+string&oq=query+string': 'www.google.com/search?q=query+string',
  // 'https://www.google.com/?gws_rd=ssl': 'www.google.com',
  // 'https://www.google.com/#q=test': 'www.google.com/#q=test'
  // https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=pinterest

  'http://www.google.com/#/this/is/a/path': 'hashtest OK',
  'http://www.google.com/this/is/a/path/#/and/hash': 'hashtest OK',
  'http://www.google.com/this/#hash': 'hashtest fail'
}

// var urlResult = parseURL('http://google.com');

// This means urlResult should now look like this:
/*
  urlResult = {
    message: errorMsg
  }
*/

// var getError = urlResult.message

// t.equal(getError, "URL Blacklists", "Success: Blacklisted URL detected!");


var url = require('url');


// URL PARSE TESTS

// Note: as of now query strings (?q=1&a=2) are not removed if after hash (#)

// should pass
var msg = 'passed';
var passingUrlTests = {
  'http://www.google.com': 'google.com/',
  'https://google.com': 'google.com/',
  'http://www.google.com/#!/hashbang': 'google.com/#!/hashbang/',
  'http://www.google.com/#/this/is/a/path': 'google.com/#/this/is/a/path/',
  'http://www.google.com/#removehash': 'google.com/',
  'http://www.google.com/?removequery': 'google.com/',
  'http://www.google.com/this/is/a/path/#/and/hash': 'google.com/this/is/a/path/#/and/hash/',
  'http://subdomain.google.com': 'subdomain.google.com/',
  'http://subdomain.google.com/path/#/and/hash': 'subdomain.google.com/path/#/and/hash/',
  'http://subdomain.google.com/#removehash': 'subdomain.google.com/',
  'http://subdomain.google.com/?removequery': 'subdomain.google.com/'
}

for (var key in passingUrlTests) {
  t.equal(utils.parseURL(key), passingUrlTests[key], msg)
}

// should pass by returning Error() object for blacklisted URLs
var errorUrlTests = {
  'http://www.bad.com': 'bad.com/',
  'http://www.dummy.com': 'dummy.com/',
}


// should fail