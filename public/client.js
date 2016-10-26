var roomInit = false;
var socket = io();

$(document).ready(()=>{

  chatGlobal();

//----Events----
  $('#room1').click(()=>{
      if (roomInit == false){
      console.log(socket.id + " is joining a room");
      socket.emit('create', 'room');
      chatRoom();
      roomInit = true;
    }
  })

  $('#leaveRoom').click(()=>{
    if(roomInit == true) {
      socket.emit('leaveRoom', socket.id);
    }
  })

  $('#get_user').click(()=>{
    console.log(`hello, ${$('#username').val()}`)
  })

  $('#formGlobal').submit(function(){
    socket.emit('global message', $('#inputGlobal').val());
    $('#inputGlobal').val('');
    return false;
  });

}) //End of DOM content loaded

function chatGlobal(){
    console.log(socket)
    socket.on('incomer',(data)=>{ // New user prompt
      $('#global').append($('<li>').text(`>>Tada , ${data.welcome}`));
    })

    socket.on('global message', function(msg){
      $('#global').append($('<li>').text(msg));
    });

    socket.on('list-all',(users)=>{
      var allUsers = ''
      console.log(`>>users, ${users.users.length}`);
      users.users.forEach((user)=>{
        console.log(user)

        for(var key in user){
          allUsers += `${key}, `
        }//end of forEach
      });
      $('#messages').append($('<li>').text(`>>Users online: ${allUsers}`));
    });
}

function chatRoom(){
  var roomNo;

  socket.on('joined-room', (room)=>{
    roomNo = room;
    console.log(`${socket.id} joined ${roomNo.room},`)
    $('#room').append($('<li>').text(room.room));
  });

  socket.on('room-message', (msg)=>{
    $('#room').append($('<li>').text(msg));
  });

  $('#formRoom').submit(function(){
      var msg = $('#inputRoom').val()
      socket.emit('room1 message',
        { room: roomNo,
          msg: msg }
    );
    $('#inputRoom').val('');
    return false;
  });


}
