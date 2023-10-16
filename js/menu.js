class Menu extends Phaser.Scene {
    constructor(){
        super("Menu")
    }

    create() {
        this.cameras.main.setBackgroundColor(0x808080);
    
        this.add.text(game.config.width / 2.5, game.config.width / 5, 'Main Menu', { fontSize: "36px", fill: '#ffffff'})

        // Map1 button to start the map
        const map1Button = this.add.text(
            game.config.width / 2,
            game.config.height / 2.6,
            "Map1",
            {
                fontSize: "36px",
                fill: "#ffffff",
            }
        )
        
        map1Button.setOrigin(0.5)
        map1Button.setInteractive()

       // Handle button click
       map1Button.on("pointerdown", () => {
        // Restart the game scene
        this.scene.start("PlayGame")
        })


        // Map2 button to start the map
        const map2Button = this.add.text(
            game.config.width / 2,
            game.config.height / 2,
            "Map2",
            {
                fontSize: "36px",
                fill: "#ffffff",
                align: "center"
            }
        )
        
        map2Button.setOrigin(0.5)
        map2Button.setInteractive()

       // Handle button click
       map2Button.on("pointerdown", () => {
        // Restart the game scene
        this.scene.start("Playgame2")
        })
    }
}