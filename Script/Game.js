export class Game {
    constructor(video, name, init) {
        this.videoSrc = video;
        this.name = name;
        this.init = init;
    }

    loadGame()
    {
        this.init();
    }

    getHtml()
    {
        let html = `<div class="game">
            <video class="video" src="${this.videoSrc}"></video>
            <p class="game-name">
                ${this.name}
            </p>
        </div>`

        return html;
    }
}