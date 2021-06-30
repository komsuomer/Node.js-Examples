var socket = io();

const roomList = document.getElementById('roomList');
const question = document.getElementById('question');
const answer = document.getElementById('answer');
const check_btn = document.getElementById('checkBtn');
const infoMessage = document.getElementById('infoMessage');
const userList = document.getElementById('userList');

var myNickName;
var selectedRoom = '';

function setName() {
    myNickName = document.getElementById('nickname-input').value;
    if (myNickName != '') {
        document.querySelector('.set-name').hidden = true;
        document.querySelector('.set-room').hidden = false;
        socket.emit('getRooms');
    }
}


function joinRoom() {
    if (selectedRoom != '') {
        socket.emit('joinroom', {'roomName':selectedRoom, 'userNick':myNickName});
    
        document.querySelector('.set-room').hidden = true;
        document.querySelector('.game-area').hidden = false;
        question.innerHTML = 'host is expected to initiate';
    }
}

function createRoom() {
    selectedRoom = document.getElementById('roomName').value;
    if( selectedRoom != ''){
        socket.emit('createroom', {'roomName':selectedRoom, 'userNick':myNickName});
    
        document.querySelector('.set-room').hidden = true;
        let gameArea = document.querySelector('.game-area');
        gameArea.hidden = false;

        let startBtn = document.createElement('input');
        let newP = document.createElement('p');
        startBtn.type = 'button';
        startBtn.value = 'Start';
        startBtn.addEventListener('click', () => {
            socket.emit('startGame', selectedRoom);
            startBtn.remove();
            newP.remove();
        });
        newP.innerHTML = 'Push the start button for start game'

        gameArea.prepend(startBtn);
        gameArea.prepend(newP);

        let userElement = document.createElement('li');
        userElement.innerHTML = myNickName + '\t|' + ' '.repeat(10) + '|';
        userList.appendChild(userElement);        
    }
}


function updateRoomList(rooms){
    while (roomList.firstChild) roomList.removeChild(roomList.firstChild);

    rooms.forEach(room => {
        let roomElement = document.createElement("li");
        roomElement.innerHTML = room;
        roomElement.addEventListener('click', () => {
            selectedRoom = room;
            roomList.childNodes.forEach((li)=>{
                li.style.backgroundColor = 'transparent';
            })
            roomElement.style.backgroundColor='#F39814';
        })
        roomElement.style.cursor = 'pointer';
        roomList.appendChild(roomElement);
    });
}

function updateUserList(users){
    while (userList.firstChild) userList.removeChild(userList.firstChild);

    users.forEach(user => {
        let userElement = document.createElement('li');
        userElement.innerHTML = user.userNick + '\t|' + '='.repeat(user.indexQ) + ' '.repeat(10-user.indexQ) + '|';
        userList.appendChild(userElement);
    })
}


function setGameArea(question){
    question.innerHTML = question;
    answer.value = '';
    wrongMessage.innerHTML = '';
}

function checkAnswer(){
    socket.emit('checkAnswer', {'roomName':selectedRoom, 'answer':parseInt(document.getElementById('answer').value)});
}


socket.on('activeRooms', (rooms) => {
    updateRoomList(rooms);
});


socket.on('createdRoom', (rooms) => {
    if(!document.querySelector('.set-room').hidden){
        updateRoomList(rooms);
    }
});

socket.on('usersUpdate', (users) => {
    updateUserList(users);
});

socket.on('gameStarting', (firstQ) => {
    for(let i = 3; i > 0; i--){
        setTimeout(()=>{document.getElementById('question').innerHTML = 'Game Starting ' + i},1000*(3-i));
    }
    // console.log(firstQ);
    setTimeout(()=>{document.getElementById('question').innerHTML =firstQ},3000);
});

socket.on('nextQuestion', (data) => { // data = question, index
    infoMessage.innerHTML = 'Your answer is Correct';
    setTimeout(() => {infoMessage.innerHTML = ''}, 2000);
    document.getElementById('question').innerHTML = data.question;
    document.getElementById('answer').value = '';
})

socket.on('wrongAnswer', () => {
    document.getElementById('answer').value = '';
    infoMessage.innerHTML = 'Your answer is Wrong';
    setTimeout(() => {infoMessage.innerHTML = ''}, 3000);
})

socket.on('winner', winner => {
    document.querySelector('.game-area').hidden = true;
    document.querySelector('.winner-area').hidden = false;
    if(winner == myNickName) {document.getElementById('congrulationsMessage').innerHTML = 'Congrulations\nYou Win';}
    else {document.getElementById('congrulationsMessage').innerHTML = 'Game Over\nWinner ' + winner;}
})




// document.addEventListener('DOMContentLoaded', () => {
//     var socket = io();

//     const questionElement = document.querySelector('.question');
//     const answer = document.querySelector('.answer');
//     const checkButton = document.querySelector('.check-btn');
//     const resultShow = document.querySelector('.result');

//     console.log(checkButton);

//     const operations = ['+','-'];
//     var checked;

//     function setQuestion(){
//         checked = false;
//         var a = Math.floor(Math.random()*99)+1;
//         var b = Math.floor(Math.random()*99)+1;
//         var operation = operations[Math.floor(Math.random()*2)];

//         questionElement.innerHTML = `${a} ${operation} ${b}`;
//         answer.value = '';
//         checkButton.value = 'Check';
//         resultShow.innerHTML = '';
//     }

//     checkButton.addEventListener('click', () => {
//         if(checked){
//             setQuestion();
//         }
//         else if(answer.value == eval(questionElement.innerHTML)){
//             checkButton.value = 'New Question';
//             resultShow.innerHTML = 'Correct, Congratulations';
//             checked = true;
//         }
//         else {
//             checkButton.value = 'New Question';
//             resultShow.innerHTML = `Wrong, Correct answer is ${eval(questionElement.innerHTML)}`;
//             checked = true;
//         }

//         socket.emit('result', answer.value);
//     })

//     socket.on('socket id', (data) => { 
//         document.getElementById('socketID').innerHTML = 'Socket Id : ' + data;
//     });

//     setQuestion();
// });