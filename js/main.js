// Used this in help to check how the audios work: https://newdocs.phaser.io/docs/3.55.2/Phaser.Sound.Events.COMPLETE
// This on how to pass parameters: https://stackoverflow.com/questions/53356039/how-do-i-pass-data-from-scene-to-scene-in-phaser-3
// This to get the tint right: https://newdocs.phaser.io/docs/3.55.2/focus/Phaser.GameObjects.Group-setTint

let game 

const gameOptions = {
    dudeGravity: 400,
    dudeSpeed: 300
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        // backgroundColor: "grey",
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
        scene: [Menu, PlayGame, ScoreBoard, Settings]
    } 

    game = new Phaser.Game(gameConfig)
    window.focus()
}