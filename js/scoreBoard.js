class ScoreBoard extends Phaser.Scene {
    constructor(){
        super("ScoreBoard")
        this.playerName = ""
        this.playerScores = []
        this.nameInput = null

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

        // Menu button
        const menuButton = this.add.text(
            game.config.width / 2,
            game.config.height / 5,
            "Back",
            this.textStyle
        )
        
        menuButton.setOrigin(0.5)
        menuButton.setInteractive()

        // Handle button click also making sure that the input field is destroyed then
        menuButton.on("pointerdown", () => {
            this.scene.start("Menu")
            if (this.nameInput) {
                document.body.removeChild(this.nameInput)
                this.nameInput = null
            }
        })

        menuButton.on("pointerover", () => {
            menuButton.setStyle( {fill: "#FFC0CB"})
        })

        menuButton.on("pointerout", () => {
            menuButton.setStyle( {fill: "#ffffff"})
        })

        // if the finalscore is 0 the scoreboard is empty
        if(this.finalScore == 0) {
            this.displayPlayerName()
        } else{
        
            const nameInput = document.createElement("input")
            nameInput.type = "text"
            nameInput.placeholder = "Enter your name"
            nameInput.style.position = "absolute"
            nameInput.style.left = "50%"
            nameInput.style.top = "50%"
            nameInput.style.transform = "translate(-50%, -50%)"
            document.body.appendChild(nameInput)

            // Event listener for the Enter key press
            nameInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault()
                    this.playerName = nameInput.value || "Player"
                    this.playerNameEntered = true

                    // finalscore is multiplied by 10 to get the score look better 
                    this.finalScore = this.finalScore*10
                    this.scoreboardSave(this.playerName, this.finalScore)
                    document.body.removeChild(nameInput)
                    this.displayPlayerName()
                }
            })
            this.nameInput = nameInput
        }
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
        if (this.playerNameEntered || this.playerScores.length > 0) {
            // sorting playerScores by score in descending order
            this.playerScores.sort((a, b) => b.score - a.score)

            let y = game.config.height / 3
            for (let i = 0; i < this.playerScores.length; i++) {
                const player = this.playerScores[i]
                this.add.text(game.config.width / 2.6, y, `${i + 1}. ${player.name}: ${player.score}`, this.textStyle)
                y += 40 // putting the space between the different scores
            }
        } else {
            this.add.text(game.config.width / 3, game.config.height / 2, 'Scoreboard is empty :(( ', this.textStyle)
            this.add.text(game.config.width / 4, game.config.height / 1.5, 'Play the game to get on the scoreboard!!', this.textStyle)
        }
    }
}