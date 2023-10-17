// I used this in help to get the bullets correctly formed: https://blog.ourcade.co/posts/2020/fire-bullets-from-facing-direction-phaser-3/

class PlayGame extends Phaser.Scene {

    constructor() {
        super("PlayGame")
        this.score = 0
        this.heartCount = 0
        this.jumpCount = 0
        this.bulletCount = 0
        this.bulletCountText = 3
        this.lastBulletTime = 0
        this.isCooldown = false
        this.starsCreated = false
        this.groundGroup = null
    }

    preload() {
        this.load.image("ground", "assets/platform.png")
        this.load.image("grass", "assets/platform2.png")
        this.load.image("bomb", "assets/bomb.png")
        this.load.image("sky", "assets/sky.png")
        // this.load.image("background", "assets/background.png")

        this.cameras.main.setBackgroundColor(0x808080)

        this.load.image("star", "assets/star.png")
        this.load.image("heart", "assets/heart.png")
        this.load.image("bullet", "assets/bullet.png")

        this.load.spritesheet("girl", "assets/girl.png", 
        {frameWidth: 64, frameHeight: 64})

        this.load.audio("spell", "assets/sounds/spell2.mp3")
        this.load.audio("bombSound", "assets/sounds/bomb.mp3")
        this.load.audio("roundWin", "assets/sounds/roundWin.mp3")
        this.load.audio("shooting", "assets/sounds/shooting.mp3")
    }

    create() {
        // this.add.image(400,300, "background")

        const textStyle = {
            fontSize: "36px",
            fill: '#ffffff',
            fontFamily: 'Times New Roman',
        }

        this.groundGroup = this.physics.add.staticGroup()
        this.groundGroup.create(470, 710, "grass").setScale(3).refreshBody()

        this.groundGroup.create(90, 250, "grass")
        this.groundGroup.create(620, 400, "grass")
        this.groundGroup.create(700, 200, "ground")
        this.groundGroup.create(120, 500, "ground")
        this.groundGroup.create(420, 570, "ground")
        
        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "girl")
        
        //adding a little bounce to the girl when he falls on the ground
        this.player.setBounce(0.3)

        //Checking that the girl cannot go out of the world
        this.player.setCollideWorldBounds(true)

        //Checking that the girl has collision to the ground
        this.physics.add.collider(this.player, this.groundGroup)

        this.createAnimations()

        //shooting / bullet physics
        this.bulletGroup = this.physics.add.group()
        this.input.on('pointerdown', this.shoot, this)
        this.physics.add.collider(this.bulletGroup, this.groundGroup)

        this.add.image(16, 98, "bullet")
        this.bulletText = this.add.text(32, 78, "3", textStyle)  
        
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
        this.scoreText = this.add.text(32, 3, "0", textStyle )    
        
        
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

        this.add.image(16, 50, "heart")
        this.scoreText2 = this.add.text(32, 38, "0", textStyle)
    }

    shoot(pointer) {
        if (!this.isCooldown) {// the bullet limit is 3 and it has a cool down
            if (this.bulletCount < 3) {

                // adding the soundeffect
                let soundSample = this.sound.add("shooting")
                soundSample.play()
                soundSample.setVolume(0.01)

                // Calculating the space between player and mouse pointer
                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y)

                // The bullet is created on the players position
                const bullet = this.bulletGroup.create(this.player.x, this.player.y, 'bullet')
                bullet.setCollideWorldBounds(true)
                bullet.setBounce(1)


                // calculating velocity components based on the angle
                const speed = 500
                const velocityX = Math.cos(angle) * speed
                const velocityY = Math.sin(angle) * speed

                bullet.body.velocity.setTo(velocityX, velocityY)

                //the bullets active time
                this.time.delayedCall(3000, () => {
                    bullet.destroy()
                })

                // updating the bullet count and the last bullet shot time
                this.bulletCount++
                this.bulletCountText--
                this.lastBulletTime = this.time.now
                this.bulletText.setText(this.bulletCountText) 

            } else {
                this.isCooldown = true
                this.bulletCount = 0
                this.bulletCountText = 3
                this.time.delayedCall(3000, () => {
                    this.bulletText.setText(this.bulletCountText)
                    this.isCooldown = false 
                    
            })
        }}
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
    
        //making sure that the bomb will be destroyed when colliding with the bullet
        this.physics.add.collider(bombsGroup, this.groundGroup)
        this.physics.add.overlap(this.bulletGroup, bombsGroup, this.bulletBombCollision, null, this)

        this.physics.add.collider(bombsGroup, this.groundGroup)

        this.physics.add.overlap(this.player, bombsGroup, this.bombTouched, null, this)
    }


    // A round is complete when a player has picked up 10 stars
    // then every round one bomb and possibly a heart will be spawn 
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
                this.spawnHearts()
            }

            // spawning a bomb
            this.spawnBomb()
        }
    
        // adding the soundeffect
        let soundSample = this.sound.add("spell")
        soundSample.play()
        soundSample.setVolume(0.01)
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
        this.heartCount += 1
        this.scoreText2.setText(this.heartCount)

        if (this.heartcount < 11){
            this.add.image(200, 200, "heart")
        }
    }

    // If the bomb is touched this is called
    bombTouched(player, bomb){
        this.physics.pause()
        this.player.setTint(0xff000)
        this.player.anims.play("turn")
        this.heartCount = 0

        this.scene.start("ScoreBoard", { score: this.score })

        this.score = 0

        // adding the soundeffect
        let soundSample = this.sound.add("bombSound")
        soundSample.play()
        soundSample.setVolume(0.8)
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

    bulletBombCollision(bullet, bomb) {
    bullet.destroy()
    bomb.destroy()
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

        const jumpJustDown = Phaser.Input.Keyboard.JustDown(cursors.up)

        if (jumpJustDown && (this.player.body.touching.down || this.jumpCount < 2)) {
            this.player.setVelocity(-330)
            this.jumpCount++
        }
        if (this.player.body.touching.down) {
            this.jumpCount = 0
        }
    }
}