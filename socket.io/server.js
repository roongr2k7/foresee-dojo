var http = require('http');
var express = require('express');
var app = express();

var server = exports.server = http.createServer(app).listen(3000, function(){
  console.log("Express server started.")
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

var io = require('socket.io').listen(server, {"log level": 0});

var sockets = new Array();
var users = {};
io.sockets.on("connection", function (socket) {
  console.log('connected');
  
  socket.on("echo", function (msg) {
    socket.emit("echo", msg);
  });
  
  socket.on("adduser", function (username) {
    console.log( socket.id + ' - ' +username + " connected.");
    users[socket.id] = username;    
    socket.broadcast.emit("updateusers", users);
    socket.emit("updateusers", users);
  });
  
  socket.on("disconnect", function() {
    console.log( socket.id + ' - ' + users[socket.id] + " disconnected.");
    delete users[socket.id];
  });
});