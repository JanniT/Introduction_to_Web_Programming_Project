class Menu extends Phaser.Scene {
    constructor() {
        super("Menu")
    }

    create() {
        // Create a popup menu background
        const background = this.add.graphics()
        background.fillStyle(0x000000, 0.7)
        background.fillRect(0, 0, game.config.width, game.config.height)

        // Add a "Replay" button to restart the game
        const replayButton = this.add.text(
            game.config.width / 2,
            game.config.height / 2,
            "Replay",
            {
                fontSize: "36px",
                fill: "#ffffff",
                align: "center",
            }
        )
        
        replayButton.setOrigin(0.5)
        replayButton.setInteractive()

       // Handle button click
       replayButton.on("pointerdown", () => {
        // Restart the game scene
        this.scene.start("PlayGame")
        })
    }
}