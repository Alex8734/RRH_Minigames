import {Category} from "./main.js";
export class Game {
    constructor(video, name, link, poster, category) {
        this.videoSrc = video;
        this.name = name;
        this.link = link;
        this.poster = poster;
        this.category = category;
    }

    getHtml()
    {
        let html = `<a href="${this.link}">
            <div class="game">
            <video poster="${this.poster}" class="video" src="${this.videoSrc}"></video>
            <p class="game-name">
                ${this.name}
            </p>
        </div>
        </a>`

        return html;
    }
}