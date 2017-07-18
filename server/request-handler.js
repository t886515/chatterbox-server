var url = require('url');
var qs = require('querystring');
var id = 1;

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var messagePlus = {results: [ {
  username: 'Jono',
  message: 'Do my bidding!',
  roomname: 'lobby',
  objectId: '0'
}]};


var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
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
      body += chunk;
    });
    request.on('end', () => { 
      
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
};

exports.requestHandler = requestHandler;

