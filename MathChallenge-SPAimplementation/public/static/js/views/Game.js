import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Game Page");
        this.userList = '<li>asdfghjkl</li>';
        this.question = '';
    }

    async getHtml({amIHost, questionText, users}={}) {
        console.log(amIHost + ' - ' + questionText + ' - ' + users);
        let startButton = '';
        if(amIHost){
            if(amIHost === true){
                this.question = 'Push the start button for start game';
                startButton = "<input id='startBtn' type='button' value='Start'></input><br>";
            }else{
                this.question = 'host is expected to initiate';
            }
        }
        if(questionText){
            this.question = questionText;
        }
        if(users){
            let userLiElements = '';
            users.forEach(user => {
                userLiElements.concat(`<li>${user.userNick}</li>`)
                //userLiElements.concat(`<li>${user.userNick} \t| ${'X'.repeat(user.indexQ)} ${'O'.repeat(10-user.indexQ)} |</li>`);
            });
            this.userList = userLiElements;
            console.log(this.userLiElements);
        }

        return `
            <div class="game-area">
                <p id="question">${this.question}</p>
                ${startButton}
                <input type="number" placeholder="Your Answer" id="answer" />
                <input id="checkBtn" type="button" value="Check">
                <p id="infoMessage"></p>
                <hr>
                <ul id="userList">${this.userList}</ul>

                <!-- odadan cikmayi ekle **********************************-->
            </div>
        `;
    }
}