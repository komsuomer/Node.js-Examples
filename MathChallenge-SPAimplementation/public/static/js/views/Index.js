import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Index");
    }

    async getHtml() {
        return `
            <div class="set-name">
                <div style="display: flex;">
                    <p>What is your nickname : </p>
                    <input id="nickname-input" />
                </div>
                <input type="button" value="Set Name" id="setNameButton">
            </div>
        `;
    }

    
}