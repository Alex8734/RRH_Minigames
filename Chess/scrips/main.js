export const canvas = document.getElementById("canvas");
export const ctx = canvas.getContext("2d");

canvas.height = 750;
canvas.width = 750;

async function init(){
    const game = new Game()
    await game.client.syncMove (4,"RH7A8",
        _ => {alert("added move successfully")},
        _ => {alert("error, not added!")})

}

$(async function () {
    await init()
})
