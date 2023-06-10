import {Category} from "./main.js";
export class Game {
    constructor(video, name, init, poster, category) {
        this.videoSrc = video;
        this.name = name;
        this.init = init;
        this.poster = poster;
        this.category = category;
    }

    loadGame()
    {
        this.init();
    }

    getHtml()
    {
        let html = `<div class="game">
            <video poster="${this.poster}" class="video" src="${this.videoSrc}"></video>
            <p class="game-name">
                ${this.name}
            </p>
        </div>`

        return html;
    }
}