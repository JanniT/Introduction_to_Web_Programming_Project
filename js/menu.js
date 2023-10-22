// I used this to get the button hovering work: https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event

class Menu extends Phaser.Scene {
    constructor(){
        super("Menu"),
        this.score = 0
    }

    create() {
        this.cameras.main.setBackgroundColor(0x808080)

        const textStyle = {
            fontSize: "36px",
            fill: '#ffffff',
            fontFamily: 'Times New Roman',
        }
    
        this.add.text(game.config.width / 2.5, game.config.width / 9, 'BombRider', textStyle)
        this.add.text(game.config.width / 2.5, game.config.width / 5, 'Main Menu:', textStyle)

        // Map1 button to start the map
        const map1Button = this.add.text(
            game.config.width / 2,
            game.config.height / 2.6,
            "Map1",
            textStyle,
        )
        map1Button.setOrigin(0.5)
        map1Button.setInteractive()

    
        // Handle button click
        map1Button.on("pointerdown", () => {
        // Restart the game scene
        this.scene.start("PlayGame", {map: "map1"})
        })

        // adding the color hovering
        map1Button.on("pointerover", () => {
            map1Button.setStyle( {fill: "#FFC0CB"})
        })

        map1Button.on("pointerout", () => {
            map1Button.setStyle( {fill: "#ffffff"})
        })

        // Map1 button to start the map
        const map2Button = this.add.text(
            game.config.width / 2,
            game.config.height / 2.1,
            "Map2",
            textStyle,
        )
        map2Button.setOrigin(0.5)
        map2Button.setInteractive()

    
        // Handle button click
        map2Button.on("pointerdown", () => {
        // Restart the game scene
        this.scene.start("PlayGame", {map: "map2"})
        })

        // adding the color hovering
        map2Button.on("pointerover", () => {
            map2Button.setStyle( {fill: "#FFC0CB"})
        })

        map2Button.on("pointerout", () => {
            map2Button.setStyle( {fill: "#ffffff"})
        })


        // random map button to start the map
        const mapRandomButton = this.add.text(
            game.config.width / 2,
            game.config.height / 1.7,
            "Random map",
            textStyle
        )
        mapRandomButton.setOrigin(0.5)
        mapRandomButton.setInteractive()

        // Handle button click
        mapRandomButton.on("pointerdown", () => {

        this.scene.start("PlayGame", {map: "randomMap"})
        })

        mapRandomButton.on("pointerover", () => {
            mapRandomButton.setStyle( {fill: "#FFC0CB"})
        })

        mapRandomButton.on("pointerout", () => {
            mapRandomButton.setStyle( {fill: "#ffffff"})
        })


        // Scoreboard button to start the map
        const scoreboardButton = this.add.text(
            game.config.width / 2,
            game.config.height / 1.4,
            "Scoreboard",
            textStyle
        )
        scoreboardButton.setOrigin(0.5)
        scoreboardButton.setInteractive()

        // Handle button click
        scoreboardButton.on("pointerdown", () => {
            this.scene.start("ScoreBoard", { score: this.score})
        })

        scoreboardButton.on("pointerover", () => {
            scoreboardButton.setStyle( {fill: "#FFC0CB"})
        })

        scoreboardButton.on("pointerout", () => {
            scoreboardButton.setStyle( {fill: "#ffffff"})
        })
        
        // settings button to start the map
        const settingsButton = this.add.text(
            game.config.width / 2,
            game.config.height / 1.2,
            "Help",
            textStyle
        )
        settingsButton.setOrigin(0.5)
        settingsButton.setInteractive()

        // Handle button click
        settingsButton.on("pointerdown", () => {
        this.scene.start("Settings")
        })

        settingsButton.on("pointerover", () => {
            settingsButton.setStyle( {fill: "#FFC0CB"})
        })

        settingsButton.on("pointerout", () => {
            settingsButton.setStyle( {fill: "#ffffff"})
        })
    }
}