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
        let html = `<div >
            <a href="${this.link}"  class="game">
                <video poster="${this.poster}" class="video" src="${this.videoSrc}"></video>
                <div class="game-name-box">
                    <p class="game-name">
                        ${this.name}
                    </p>
                </div>
            </a>
        </div>`

        return html;
    }
}