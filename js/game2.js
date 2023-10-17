class Playgame2 extends Phaser.Scene {

    constructor() {
        super("Playgame2")
        this.score = 0
        this.score2 = 0
        this.jumpCount = 0
        this.starsCreated = false
        this.groundGroup = null
    }

    preload() {
        this.load.image("ground", "assets/platform.png")
        this.load.image("grass", "assets/platform2.png")
        this.load.image("bomb", "assets/bomb.png")
        this.load.image("sky", "assets/sky.png")
        this.load.image("background", "assets/background.png")
        this.load.image("star", "assets/star.png")
        this.load.image("heart", "assets/heart.png")

        this.load.spritesheet("girl", "assets/girl.png", 
        {frameWidth: 64, frameHeight: 64})

        this.load.audio("spell", "assets/sounds/spell2.mp3")
        this.load.audio("bombSound", "assets/sounds/bomb.mp3")
        this.load.audio("roundWin", "assets/sounds/roundWin.mp3")
    }

    create() {
        this.add.image(400,300, "background")

        this.groundGroup = this.physics.add.staticGroup();
        this.groundGroup.create(470, 710, "grass").setScale(3).refreshBody()

        this.groundGroup.create(500, 200, "grass")
        this.groundGroup.create(800, 400, "grass")
        this.groundGroup.create(90, 540, "ground")
        this.groundGroup.create(130, 350, "ground")
        this.groundGroup.create(420, 490, "ground")
        
        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "girl")
        
        //adding a little bounce to the girl when he falls on the ground
        this.player.setBounce(0.3)

        //Checking that the girl cannot go out of the world
        this.player.setCollideWorldBounds(true)

        //Checking that the girl has collision to the ground
        this.physics.add.collider(this.player, this.groundGroup)

        this.createAnimations()
        

        //Stars physics
        const starsGroup = this.physics.add.group({
            key: "star",
            repeat: 9,
            setXY: { x: 12, y: 0, stepX: 95 },
        })
        starsGroup.children.iterate(function(child){
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5))
        })

        this.physics.add.collider(starsGroup, this.groundGroup)
        this.physics.add.overlap(this.player, starsGroup, this.collectStar, null, this)

        
        this.add.image(16, 16, "star")
        this.scoreText = this.add.text(32, 3, "0", {fontSize: "30px", fill: "#ffffff"})    
        
        
        //Heart physics
        const heartsGroup = this.physics.add.group({
            key: "heart",
            repeat: 0,
            setXY: { x: Phaser.Math.FloatBetween(400, 800), y: 0, stepX: 95 },
        })
        heartsGroup.children.iterate(function(child){
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5))
        })

        this.physics.add.collider(heartsGroup, this.groundGroup)
        this.physics.add.overlap(this.player, heartsGroup, this.collecHeart, null, this)

            // setting up the countter
        this.add.image(16, 50, "heart")
        this.scoreText2 = this.add.text(32, 38, "0", {fontSize: "30px", fill: "#ffffff"})

    }

    spawnBomb() {
        const bombsGroup = this.physics.add.group({
            key: "bomb",
            repeat: 0, // Number of bombs to create
            setXY: { x: Phaser.Math.FloatBetween(400, 800), y: 0, stepX: 95 },
        })
        bombsGroup.children.iterate(function (child) {
            child.setBounce(1)
            child.setCollideWorldBounds(true)
            child.setVelocity(Phaser.Math.Between(-200, 200), 20)
        })
    
        this.physics.add.collider(bombsGroup, this.groundGroup)
        this.physics.add.overlap(this.player, bombsGroup, this.bombTouched, null, this)
    }


    collectStar(player, star) {
        star.disableBody(true, true)
        this.score += 1
        this.scoreText.setText(this.score) 

        if (this.score % 10 === 0 && !this.starsCreated){
            let soundSample = this.sound.add("roundWin")
            soundSample.play()
            soundSample.setVolume(0.1)
            // creating the stars
            this.createStars()

            // spawnig a heart
            if (Math.random() < 0.7) { // 70% probability
                this.spawnHearts();
            }

            // spawning a bomb
            this.spawnBomb()
        }
    
        // adding the soundeffect
        let soundSample = this.sound.add("spell")
        soundSample.play()
        soundSample.setVolume(0.1)
    }

    // the hearts are created with 70% of chance.
    spawnHearts() {
        const heartsGroup = this.physics.add.group({
            key: "heart",
            repeat: 0,
            setXY: { x: Phaser.Math.FloatBetween(400, 800), y: 0, stepX: 95 },
        })
        heartsGroup.children.iterate(function(child){
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5))
        })
        this.physics.add.collider(heartsGroup, this.groundGroup)
        this.physics.add.overlap(this.player, heartsGroup, this.collecHeart, null, this)
    }

    // when the 10 first stars are collected this function is called
    createStars() {
        const starsGroup = this.physics.add.group({
            key: "star",
            repeat: 9,
            setXY: { x: 12, y: 0, stepX: 95 },
        })
        starsGroup.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5))
        })
    
        this.physics.add.collider(starsGroup, this.groundGroup)
        this.physics.add.overlap(this.player, starsGroup, this.collectStar, null, this)
    }

    // function for the heart counter
    collecHeart(player, heart) {
        heart.disableBody(true, true)
        this.score2 += 1
        this.scoreText2.setText(this.score2)
    }

    // If the bomb is touched this is called
    bombTouched(player, bomb){
        this.physics.pause()
        this.player.setTint(0xff000)
        this.player.anims.play("turn")
        this.score = 0
        this.score2 = 0

        this.scene.start("ScoreBoard", { score: this.score });
    }

    createAnimations(){
        //Creating the animations for the girl
            this.anims.create({
                key: "left",
                frames: this.anims.generateFrameNumbers("girl", {start: 9, end: 17}),
                frameRate: 10,
                repeat: -1
            })
            this.anims.create({
                key: "turn",
                frames: [{key: "girl", frame: 24}],
                frameRate: 10,
            })
    
            this.anims.create({
                key: "right",
                frames: this.anims.generateFrameNumbers("girl", {start: 27, end: 35}),
                frameRate: 10,
                repeat: -1
            })
    
            this.anims.create({
                key: "up",
                frames: this.anims.generateFrameNumbers("girl", {start: 0, end: 8}),
                frameRate: 10,
                repeat: -1
            })
        }

    update() {
        const cursors = this.input.keyboard.createCursorKeys()


        if(cursors.left.isDown) {
            this.player.body.velocity.x = -gameOptions.dudeSpeed
            this.player.anims.play("left", true)
        } else if(cursors.right.isDown) {
            this.player.body.velocity.x = gameOptions.dudeSpeed
            this.player.anims.play("right", true)
        } else {
            this.player.body.velocity.x = 0
            this.player.anims.play("turn", true)
        }

        //Trying to create a double jump
        if (this.player.body.touching.down) {
            this.jumpCount = 0
        }

        var canDoubleJump = this.jumpCount < 2
        
        if(cursors.up.isDown && (this.player.body.touching.down || canDoubleJump)) {
            this.jumpCount++
            this.player.body.velocity.y = -gameOptions.dudeGravity / 1
        }
    }
}