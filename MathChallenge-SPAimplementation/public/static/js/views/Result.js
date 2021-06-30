import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Result");
    }

    async getHtml() {
        return `
            <div class="winner-area" hidden>
                <p id="congrulationsMessage"></p>
                // Restart ekle / odadan cikmayi ekle
            </div>
        `;
    }
}