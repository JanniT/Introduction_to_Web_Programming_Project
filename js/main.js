// Used this to check how the audios work: https://newdocs.phaser.io/docs/3.55.2/Phaser.Sound.Events.COMPLETE
// Used this spritesheet https://fernandoruizrico.com/phaser-unit-3/

let game 

const gameOptions = {
    dudeGravity: 400,
    dudeSpeed: 300
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#336633",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.RESIZE,
            parent: 'game-container',
            width: 900,
            height: 680,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 450
                }
            }
        },
        scene: [PlayGame, Menu]
    }

    game = new Phaser.Game(gameConfig)
    window.focus()
}