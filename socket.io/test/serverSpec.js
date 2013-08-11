var mocha = require('mocha');
var should = require('should'); 
var io = require('socket.io-client');

function getValues(obj) {
  return Object.keys(obj).map(function(key) {return obj[key]});
}

describe("chat server", function () {
  var socketURL = "http://localhost:3000";
  var server;
  var options = {
      transports: ['websocket'],
      'force new connection': true
  };
 
  beforeEach(function (done) {
    server = require('../server').server;
    done();
  });
  
  it("able to connect on port 3000", function (done) {
    var client = io.connect(socketURL, options);
    done();
  });
  
  it("echos message", function (done) {
    var client = io.connect(socketURL, options);
 
    client.once("connect", function () {
      client.once("echo", function (message) {
        message.should.equal("Hello World");
        client.disconnect();
        done();
      });
 
      client.emit("echo", "Hello World");
    });
  });
  
  it("add new user", function (done) {
    var client = io.connect(socketURL, options);
 
    client.on("connect", function () {
      client.on("updateusers", function (users) {
        getValues(users).should.eql(["John"]);
        client.disconnect();
        done();
      });
 
      client.emit("adduser", "John");
    });
  });
  
  it('Should broadcast new user to all users', function(done) {
    var client1 = io.connect(socketURL, options);
    client1.on('connect', function(data){      
      client1.emit('adduser', "user1");
      
      var client2 = io.connect(socketURL, options);
      client2.on('connect', function(data){
        client2.on("updateusers", function (users) {
          getValues(users).should.eql(["user1", "user2"]);
          client1.disconnect();
          client2.disconnect();
          done();
        });        
        client2.emit('adduser', "user2");
      });
    });      
  });
});