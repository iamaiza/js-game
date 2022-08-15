class Enemy {
    constructor() {
        this.frameX = 0
        this.frameY = 0
        this.fps = 20
        this.frameTimer = 0
        this.frameInterval = 1000 / this.fps
        this.markForDeletion = false
    }

    update(deltaTime) {
        this.x -= this.speedX + this.game.speed
        this.y += this.speedY

        if(this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if(this.frameX < this.maxFrames) this.frameX++
            else this.frameX = 0
        }
        else this.frameTimer += deltaTime

        if(this.x + this.width < 0) this.markForDeletion = true
    }

    draw(ctx) {
        if(this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(
            this.img,
            this.frameX * this.width,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
        )
    }
}

export class FlyingEnemies extends Enemy {
    constructor(game) {
        super()
        this.game = game
        this.width = 60
        this.height = 44
        this.x = this.game.width + Math.random() * this.game.width * 0.5
        this.y = Math.random() * this.game.height * 0.5
        this.speedX = Math.random() + 1
        this.speedY = 0
        this.maxFrames = 5
        this.img = document.getElementById('flyEnemy')

        this.angle = 0
        this.va = Math.random() * 0.1 + 0.1
    }

    update(deltaTime) {
        super.update(deltaTime)
        this.angle += this.va

        this.y += Math.sin(this.angle)
    }

    // draw(ctx) {
    //     super.draw(ctx)
    // }
}

export class GroundEnemies extends Enemy {
    constructor(game) {
        super()
        this.game = game
        this.width = 60
        this.height = 87
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin
        this.img = document.getElementById('plantEnemy')
        this.speedX = 0
        this.speedY = 0
        this.maxFrames = 1
    }
}

export class ClimbingEnemies extends Enemy {
    constructor(game) {
        super()
        this.game = game
        this.width = 120
        this.height = 144
        this.x = this.game.width
        this.y = Math.random() * this.game.height * 0.5
        this.img = document.getElementById('bigSpiderEnemy')
        this.speedX = 0
        this.speedY = Math.random() > 0.5 ? 1 : -1
        this.maxFrames = 5
    }

    update(deltaTime) {
        super.update(deltaTime)
        if(this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1
        if(this.y < -this.height) this.markForDeletion = true
    }

    draw(ctx) {
        super.draw(ctx)
        ctx.beginPath()
        ctx.moveTo(this.x + this.width/2, 0)
        ctx.lineTo(this.x + this.width/2, this.y + 50)
        ctx.stroke()
    }
}