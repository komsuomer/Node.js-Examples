const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const genQ = require('./generateQuestion');

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

var rooms = [];  // {'roomName': ,'hostID': ,'users':[{'socketID': socket.id,'userNick': ,'isReady': false,'indexQ' :0}], 'questions'; ['question':, 'result':]}

io.on('connection', (socket) => {

  function sendRoomsNames(){
    let roomsNames = [];
    rooms.forEach((room) => {
      roomsNames.push(room.roomName);
    });
    return roomsNames;
  }

  socket.on('disconnect', () => { // TODO: if disconnected user is host of any room, delete the room and send all users in the room to setRoom page. 
    //users.splice(index, 1);
    console.log('user disconnected ' + socket.id);
    // if nobody in room delete or leave
  });

  socket.on('getRooms', () => {
    let roomsNames = sendRoomsNames();
    if(roomsNames.length > 0) socket.emit('activeRooms', roomsNames );
  })

  socket.on('createroom', (data) => { // data = roomName, userNick
    socket.join(data.roomName);

    rooms.push({
      'roomName': data.roomName, 
      'hostID': socket.id, 
      'users': [{ 
          'socketID': socket.id, 
          'userNick': data.userNick, 
          'isReady': false, 
          'indexQ': 0 
        }],
      'questions': []
    });

    for(let i = 0; i < 10; i++){
      rooms[rooms.length-1].questions.push(genQ.getNewQuestion());
    }

    socket.broadcast.emit('createdRoom', sendRoomsNames());
  })


  socket.on('joinroom', (data) => { // data = roomName, userNick
    socket.join(data.roomName);
    rooms.forEach((room) => {
      if(room.roomName == data.roomName){
        room.users.push({
          'socketID': socket.id, 
          'userNick': data.userNick,
          'indexQ': 0 
        });
      }
      io.in(data.roomName).emit('usersUpdate', room.users);
    });
  });

  socket.on('startGame', (roomName) => {
    for(let i = 0; i < rooms.length; i++){
      if(rooms[i].roomName == roomName){
        io.in(roomName).emit('gameStarting', rooms[i].questions[0].question);
        break;
      }
    }
  });

  socket.on('checkAnswer', (data) => { // data = roomName, answer
    for(let i = 0; i < rooms.length; i++){
      if(rooms[i].roomName == data.roomName){
        let user;
        for(let j = 0; j < rooms[i].users.length; j++){
          if(rooms[i].users[j].socketID == socket.id){
            user = rooms[i].users[j];
            break;
          }
        }

        if(data.answer == rooms[i].questions[user.indexQ].result){
          if(user.indexQ == 9){
            io.in(data.roomName).emit('winner', user.userNick);
            break
          }
          user.indexQ++;
          socket.emit('nextQuestion', {'question': rooms[i].questions[user.indexQ].question, 'index':user.indexQ});
          io.in(data.roomName).emit('usersUpdate', rooms[i].users);
        }
        else{
          socket.emit('wrongAnswer');
        }
        break;
      }
    }    
  })

});


http.listen(process.env.PORT || 8000, () => {
  console.log(`Server Works !!! At port ${process.env.PORT || 8000}`);
});

