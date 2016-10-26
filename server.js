var morgan = require('morgan');
var express = require('express');
var path = express('path')

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// const http = require('http');
// const server = http.createServer(app)
// const io = require('socket.io')(server)
app.use(morgan('combined'))

// Setting static directory for the views
  app.use(express.static('public'));

// Controllers
  app.get('/', function(req, res){
    res.sendFile('index.html');
  });

//Socket
  var roomNo = 1;
  var userOn = []; //Socket.id containters

io.on('connection',function(socket){

  //----Global Settings
    var user = {}
    user[`user${userOn.length}`] = socket.id;
    userOn.push( user );

    socket.broadcast.emit('incomer',{welcome:`New User_id: ${socket.id} Joined!`});
    io.emit('list-all',{users: userOn}); // format-> {users: [{}]}


    socket.on('global message', function(msg){
      console.log('>>Message:', msg)
      io.emit('global message', msg);
    });

  //----Room Settings----
    socket.on('create', function(room) {
      var entry = room + roomNo
      socket.join(entry);
      console.log('>>>Checking Rooms:', socket.adapter.rooms);
      socket.emit('joined-room',{room: entry})
    });

    socket.on('room1 message', function(data){
      console.log(`>>Message to ${data.room}: ${data.msg}`)
      io.to('room1').emit('room-message', data.msg);
    });

    socket.on('leaveRoom',()=>{
      socket.leave('room1')
      console.log('>>>Leave Rooms:', socket.adapter.rooms);
    })

    socket.on('disconnect',()=>{
      console.log('user disconnected');
      console.log('>>Remaining Clients: ', socket.adapter.rooms)
    })

});

http.listen(3000,()=>{
  console.log('try-socket.app: Ready on localhost:3000');
})
