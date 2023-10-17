class ScoreBoard extends Phaser.Scene {
    constructor(){
        super("ScoreBoard")
        this.playerName = ""
        this.playerScores = []

        this.textStyle = {
            fontSize: "36px",
            fill: '#ffffff',
            fontFamily: 'Times New Roman',
        }
    }

    // Taking the score from the game scene
    init(data){
        this.finalScore = data.score
    }

    create() {
        this.cameras.main.setBackgroundColor(0x808080)

        this.add.text(game.config.width / 2.6, game.config.height / 4, '  Scoreboard:', this.textStyle)

        const nameInput = document.createElement("input")
        nameInput.type = "text"
        nameInput.placeholder = "Enter your name"
        nameInput.style.position = "absolute"
        nameInput.style.left = game.config.width / 2.3 + "px"
        nameInput.style.top = game.config.height / 2.5 + "px"
        document.body.appendChild(nameInput)


        // Event listener for the Enter key press
        nameInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault()
                this.playerName = nameInput.value || "Player"
                this.playerNameEntered = true
                
                this.scoreboardSave(this.playerName, this.finalScore)
                document.body.removeChild(nameInput)

                this.displayPlayerName()
            }
        })

        // Menu button
        const menuButton = this.add.text(
            game.config.width / 2,
            game.config.height / 5,
            "Main Menu",
            this.textStyle
        )
        
        menuButton.setOrigin(0.5)
        menuButton.setInteractive()

        // Handle button click also making sure that the input field is destroyed then
        menuButton.on("pointerdown", () => {
            this.scene.start("Menu", { playerScores: this.playerScores })
            document.body.removeChild(nameInput)
        })
    }

    // saving player and their score to a list
    scoreboardSave(name, score) {
        this.playerScores.push({ name, score })
    
        // sorting the scores in descending order
        this.playerScores.sort((a, b) => b.score - a.score)

        // keeping only the top 10 scores, removing the lowest ones
        if (this.playerScores.length > 5) {
            this.playerScores.pop() 
        }
    }


    // iterating through the list  to get the scoreboard visible 
    displayPlayerName() {
        if (this.playerNameEntered && this.playerScores.length > 0) {
            // sorting playerScores by score in descending order
            this.playerScores.sort((a, b) => b.score - a.score)

            let y = game.config.height / 2
            for (let i = 0; i < this.playerScores.length; i++) {
                const player = this.playerScores[i]
                this.add.text(game.config.width / 2.6, y, `${i + 1}. ${player.name}: ${player.score}`, this.textStyle)
                y += 40 // putting the space between the different scores
            }
        }
    }
}