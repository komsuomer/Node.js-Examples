import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create or Join");
    }

    async getHtml(rooms) {
        let list = "";
        if(rooms){
            for(let i = 0; i<rooms.length; i++){
                list += `<li id='roomListElement' style='cursor: pointer'>${rooms[i]}</li>\n`;
            }
        }

        return `
        <div class="set-room">
            <p>Room List</p>
            <ul id="roomList">
                ${list}
            </ul>
            <input type="button" value="Join" id="joinBtn" >
            <p> 
                OR 
            </p>
            <div style="display: flex; margin-top: 20px;">
                <input id="roomName" placeholder="Room Name"/>
                <input type="button" value="Create" id="createBtn" >
            </div>
        </div>
        `;
    }
}


