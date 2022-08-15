export class CollisionAnimation {
    constructor(game, x, y) {
        this.game = game
        this.img = document.getElementById('boom')
        this.spriteWidth = 100
        this.spriteHeight = 90
        this.sizeModifier = Math.random() + 0.5
        this.width = this.spriteWidth * this.sizeModifier
        this.height = this.spriteHeight * this.sizeModifier
        this.x = x - this.width * 0.5
        this.y = y - this.height * 0.5
        this.frameX = 0
        this.maxFrames = 4
        this.markForDeletion = false

        this.fps = Math.random() * 10 + 5
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps

        this.sound = new Audio()
        this.sound.src = 'bomm.wav'
    }

    update(deltaTime) {
        this.x -= this.game.speed

        if(this.frameX === 0) {
            this.sound.play()
        }

        if(this.frameTimer > this.frameInterval) {
            this.frameX++
            this.frameTimer = 0
        }
        else {
            this.frameTimer += deltaTime
        }
        
        if(this.frameX > this.maxFrames) this.markForDeletion = true
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}