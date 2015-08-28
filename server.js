#!/bin/env node
var express     = require('express');
var app         = express();
var server      = require('http').createServer(app);

var fs          = require('fs');

var ipAddress   = process.env.OPENSHIFT_NODEJS_IP;
var port        = process.env.OPENSHIFT_NODEJS_PORT || 8080;


/*************************/

app.set('port', port);
app.set('ipaddr', ipAddress);

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send('Admin Homepage');
});

//  Start the app on the specific interface (and port).
server.listen(port, ipAddress, function() {
    console.log('server starts!');
});

var io = require('socket.io').listen(server);
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

io.set('transports', [
    'websocket'
]);

io.sockets.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});
    socket.on('my other event', function (data) {
        console.log(data);
    });
});




