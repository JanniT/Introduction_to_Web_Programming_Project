class Settings extends Phaser.Scene {
    constructor(){
        super("Settings")
    }

    preload(){
        this.load.image("star", "assets/star.png")
        this.load.image("heart", "assets/heart.png")
    }

    create() {
        this.cameras.main.setBackgroundColor(0x808080)

        const textStyle = {
            fontSize: "36px",
            fill: '#ffffff',
            fontFamily: 'Times New Roman',
        }

        this.add.text(game.config.width / 2.5, game.config.height / 5, 'How to play:', textStyle)

        const text1 = (`
        - Use the keyboard to move (arrowkeys) \n
        - Use the mouse to shoot the bombs \n
        - Collect the stars to get score \n
        - Collect the hearts to get hp (3 is full)`)

        this.add.text(game.config.width / 6, game.config.width / 5, text1, textStyle)

        // Menu button
        const menuButton = this.add.text(
            game.config.width / 2,
            game.config.height / 9,
            "Back",
            textStyle
        )
        
        menuButton.setOrigin(0.5)
        menuButton.setInteractive()

        // Handle button click also making sure that the input field is destroyed then
        menuButton.on("pointerdown", () => {
            this.scene.start("Menu")
        })

        menuButton.on("pointerover", () => {
            menuButton.setStyle( {fill: "#FFC0CB"})
        })

        menuButton.on("pointerout", () => {
            menuButton.setStyle( {fill: "#ffffff"})
        })
    }
}