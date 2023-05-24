export class Game {
    constructor(video, name, init, poster) {
        this.videoSrc = video;
        this.name = name;
        this.init = init;
        this.poster = poster;
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