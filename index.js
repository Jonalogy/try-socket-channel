var morgan = require('morgan');
var express = require('express');
var path = express('path')

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// const http = require('http');
// const server = http.createServer(app)
// const io = require('socket.io')(server)

// this sets a static directory for the views
app.use(morgan('combined'))
app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile('index.html');
});

var userOn = []; //Socket.id containters

io.on('connection',function(socket){
  var user = {}
  user[`user${userOn.length}`] = socket.id;
  userOn.push( user );

  socket.broadcast.emit('incomer',{welcome:`New User of id:${socket.id} Joined!`});
  io.emit('list-all',{users: userOn}); // format-> {users: [{}]}

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect',()=>{
    console.log('user disconnected');
  })
});

http.listen(3000,()=>{
  console.log('try-socket.app: Ready on localhost:3000');
})
