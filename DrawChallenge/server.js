const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + "/public"));

app.get('/', (req, res) => {
    res.sendFile('/index.html');
});


words = ['phone', 'house', 'tree', 'car']

users = [] // {username, socket.id, isHost}
rooms = [] // {roomname, insadeUsersName, word}

io.on('connection', (socket) => {

    let roomName = null
    let userName = null

    socket.on('disconnect', () => {
        for (let i = 0; i < users.length; i++) {
            if (users[i].id == socket.id) {
                users.splice(i, 1);
                break
            }
        }
        socket.leave(roomName)
        for (let room of rooms) {
            if (room.roomname == roomName) {
                room.users.splice(room.users.indexOf(userName), 1)
                if (room.users.length == 0) {
                    rooms.splice(rooms.indexOf(room), 1)
                }
                break
            }
        }
        console.log('user disconnected ' + socket.id);
    });




    socket.on('login', (data) => {
        let obj
        try {
            obj = JSON.parse(data);
            console.log(obj.username);

            users.forEach(user => {
                if (user.username == obj.username) {
                    throw new Error('Whoops!')
                }
            });

            socket.join(obj.roomname)
            roomName = obj.roomname
            userName = obj.username
            for (let room of rooms) {
                if (room.roomname == obj.roomname) {
                    users.push({
                        username: obj.username,
                        id: socket.id,
                        isHost: false
                    })
                    room.users.push(obj.username)
                    socket.emit('loginResponse', 1)
                    // io.in(roomName).emit('userJoin', obj.username)
                    socket.broadcast.to(roomName).emit('userJoin', obj.username)
                    return
                }
            }
            users.push({
                username: obj.username,
                id: socket.id,
                isHost: true
            })
            rooms.push({
                roomname: obj.roomname,
                users: [obj.username],
                word: null
            })
            socket.emit('loginResponse', 2)
            socket.broadcast.to(roomName).emit('userJoin', obj.username)
        } catch (e) {
            console.log("Invalid User Name");
            socket.emit('loginResponse', 0)
        }

    })

    socket.on('startGame', () => {
        for (let room of rooms) {
            if (room.roomname == roomName) {
                room.word = words[Math.floor(Math.random() * words.length)];
                socket.emit('start', room.word)
                socket.broadcast.to(roomName).emit('start', null)
                break
            }
        }

    })

    socket.on('answer', (answer) => {
        let word
        for (let room of rooms) {
            if (room.roomname == roomName) {
                word = room.word
            }
        }
        if (answer == word) {
            socket.emit('answerResponse', true)
            socket.broadcast.to(roomName).emit('winner', userName)
        } else {
            socket.emit('answerResponse', false)
        }
    })


    socket.on('updateCanvas', imageData => {
        socket.broadcast.to(roomName).emit('updateClientCanvas', imageData)
    })

})







http.listen(process.env.PORT || 8000, () => {
    console.log(`Server Works !!! At port ${process.env.PORT || 8000}`);
});