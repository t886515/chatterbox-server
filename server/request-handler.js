var url = require('url');
var qs = require('querystring');
var id = 1;
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  //'access-control-allow-credentials': true,
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var messagePlus = {results: [ {
  username: 'server',
  text: 'welcome to the server!',
  roomname: 'lobby',
  objectId: '0'
} ]};


var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  //response.results = [];
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // The outgoing status.
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';
  
  if (request.method === 'OPTIONS' && request.url === '/classes/messages') {
    var newCors = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST',
      'access-control-allow-headers': 'content-type, accept'
    };
    var statusCode = 204;
    response.writeHead(statusCode, newCors);
    response.end();
    //request.method = 'GET';
    //console.log('fdkslfjldsfjldksfjdlskjfldsfjkdshfds', request);
    // console.log(request.method);
      //console.log('434324', chunk);
      // if (request.AccessControlAllowMethod === 'POST') {
      //   request.method = 'POST';
      //   console.log('__________________________________________________');
      // } else {
      //   request.method = 'GET';
      //   console.log('fjdksfdsf=================================================', request.AccessControlAllowMethod);
      // }
      // //chunk !== undefined ? request.method = 'POST' : request.method = 'GET';
    // console.log(request.method);
  }
  
  if (request.url !== '/classes/messages') {
    var statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  } else if (request.method === 'POST') {
    var statusCode = 201;
    headers['Content-Type'] = 'text/plain';
    response.writeHead(statusCode, headers);
    var body = '';
    request.on('data', (chunk) => {
      //console.log('fis this herhehrhehrhrhe?==========================', chunk);
      body += chunk;
      // messagePlus.results.push(JSON.parse(chunk));
    });
    request.on('end', () => { 
      
      //body.createdAt = Date.now();
      var parsedBody = qs.parse(body);
      parsedBody.objectId = id;
      id += 1;
      messagePlus.results.push(parsedBody);
      response.end('Posted'); 
    });
  } else if (request.method === 'GET') {
    var statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(messagePlus));
  }
  
  //console.log('_______________________________________', JSON.stringify(messagePlus));
  //console.log('=======================================', JSON.parse(JSON.stringify(messagePlus)));
  // console.log('??????????????????????????????this is response', response);
  // var { method, url, headers } = request;
  // console.log('.....................................', method);
  // console.log('////////////////////////////////////', url);
  // var body = [];
  // request.on('data', (chunk) => {
  //   if (chunk) {
  //     body.push(chunk);
  //   }
  // });
  // request.on('end', () => {
  //   body = Buffer.concat(body);
  // });
  
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //console.log('=======================fdjiogjlkdfgjlkd', request);
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

exports.requestHandler = requestHandler;

