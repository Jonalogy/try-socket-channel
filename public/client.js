$(document).ready(()=>{
  var socket = io();

  console.log(socket)

  $('#get_user').click(()=>{
    console.log(`hello, ${$('#username').val()}`)
  })

  socket.on('incomer',(data)=>{ // New user prompt
    $('#messages').append($('<li>').text(`>>Tada , ${data.welcome}`));
  })

  socket.on('list-all',(users)=>{
    var allUsers = ''
    console.log(`>>users, ${users.users.length}`);
    users.users.forEach((user)=>{

      for(var key in user){
        console.log(key)
        allUsers += `${key}, `

      }
    });

    // for(var user in users){
    //   console.log('>>who', user)
    // }
    $('#messages').append($('<li>').text(`>>Users online: ${allUsers}`));
  });

  $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

}) //End of DOM content loaded
