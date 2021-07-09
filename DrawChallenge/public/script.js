var socket = io();
const loginDiv = document.getElementsByClassName('login')[0]
const gameDiv = document.getElementsByClassName('gameDiv')[0]
const hostDiv = document.getElementsByClassName('hostDiv')[0]

var scripts = ['https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js','https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js', 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js', 'handTrackingScript.js']

var amIHost = false


function sendUserName() {
    let username = document.getElementById('username').value;
    let roomname = document.getElementById('roomname').value;

    if(username != '' && roomname != ''){
        socket.emit('login', JSON.stringify({
            username: username,
            roomname: roomname
        }));
    }
}



socket.on('loginResponse', result => {
    console.log(result);
    if (result == 0) {
        alert('Invalid User Name')
    } else if (result == 1) {
        loginDiv.hidden = true
        gameDiv.hidden = false
        amIHost = false
    } else if (result == 2) {
        loginDiv.hidden = true
        hostDiv.hidden = false
        amIHost = true
    } else {
        alert('Unknown Error - Please Try Again')
    }
})

socket.on('userJoin', username => {
    console.log('User Join the Room, ' + username);
})




function startGame(e){
    socket.emit('startGame')
    let element = e.target
    element.parentNode.removeChild(element);
}

socket.on('start', data => {
    if(amIHost){
        let p = document.createElement('p')
        p.innerHTML = 'Your Word : <strong>' + data + '</strong>'
        hostDiv.appendChild(p)
        document.getElementsByClassName('container')[0].hidden = false

        let count = 0  
        const recursivelyAddScript = (script, cb) => {
            const el = document.createElement('script')
            el.src = script
            el.crossorigin="anonymous"
            if(count < scripts.length) {
                count ++
                el.onload = () => recursivelyAddScript(scripts[count])
                document.body.appendChild(el)
            } else {
                console.log('All script loaded')
                return
            }
        }
        recursivelyAddScript(scripts[count])

        // setInterval(function(){ 
        //     console.log(commands);
        //     if(sessionStorage.getItem('commands') != undefined){
        //         socket.emit('updateCanvas', sessionStorage.getItem('commands'))
        //         sessionStorage.getItem('commands',[])
        //     }
        // }, 500);

        setInterval(function(){ 
            if(commands != ''){
                socket.emit('updateCanvas', commands)
                commands = ''
            }        
        }, 500);

    }else{
        var clientCanvas = document.getElementById('client_canvas')
        var ctx_client = clientCanvas.getContext('2d');
        socket.on('updateClientCanvas', commands => {
            // console.log(commands);
            commandList = commands.split('//')
            console.log(commandList);
            for(let command of commandList){
                c = command.split(',')
                if(c[0] == '0'){
                    ctx_client.fillRect(c[1], c[2], 7, 7)
                }else if(c[0] == '1'){
                    ctx_client.fillRect(c[1], c[2], 1, 1)
                }else if(c[0] == '2'){
                    ctx_client.clearRect(c[1], c[2], 10, 10)
                }
            }
        })
        document.getElementById('sendAnswerBtn').disabled = false
    }
})


function sendAnswer(){
    let answer = document.getElementById('answer').value.toLowerCase()
    if(answer != ''){
        socket.emit('answer', answer)
    }
}

socket.on('answerResponse', data => {
    if(data){
        alert('You find first')
    }else{
        alert('Wrong Answer')
    }
})

socket.on('winner', userName => {
    alert('Winner : ' + userName)
})


