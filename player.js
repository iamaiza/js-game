import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerStates.js'
import { CollisionAnimation } from './collisionAnimation.js'
import { FloatingMessage } from './floatingMsg.js'


export class Player {
   constructor(game) {
      this.game = game
      this.img = playerImage
      this.width = 100
      this.height = 91.3
      this.x = 0
      this.y = this.game.height - this.height - this.game.groundMargin
      this.vy = 0
      this.weight = 1
      this.frameX = 0
      this.frameY = 0
      this.maxFrames
      this.fps = 20
      this.frameTimer = 0
      this.frameInterval = 1000 / this.fps
      this.speed = 0
      this.maxSpeed = 10
      this.states = [
         new Sitting(this.game),
         new Running(this.game),
         new Jumping(this.game),
         new Falling(this.game),
         new Rolling(this.game),
         new Diving(this.game),
         new Hit(this.game)
      ]
   }

   restart() {
      this.x = 0
      this.y = this.game.height - this.height
      this.maxFrames = 8
      this.frameY = 0
   }
   update(input, deltaTime) {

      this.checkCollision()

      this.currentState.handleInput(input)
      // horizontal movement
      this.x += this.speed

      if((input.includes('ArrowRight') || input.includes('swipe right')) && this.currentState !== this.states[6]) this.speed = this.maxSpeed
      else if((input.includes('ArrowLeft') || input.includes('swipe left')) && this.currentState !== this.states[6]) this.speed = -this.maxSpeed
      else this.speed = 0

      // set horizontal boundries
      if(this.x < 0) this.x = 0
      else if(this.x > this.game.width - this.width) this.x = this.game.width - this.width

      // vertical movement 
      this.y += this.vy

      if(!this.onGround()) this.vy += this.weight
      else this.vy = 0

      // set verticle boundries
      if(this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin

      // sprite animation
      if(this.frameTimer > this.frameInterval) {
         this.frameTimer = 0
         if(this.frameX < this.maxFrames) this.frameX++
         else this.frameX = 0
      }
      else {
         this.frameTimer += deltaTime
      }
      // if(input.includes('Escape')) this.game.restartGame(deltaTime)
   }

   draw(ctx) {
      if(this.game.debug) ctx.strokeRect(this.x, this.y, this.width, this.height)
      ctx.drawImage(
         this.img,
         this.frameX * this.width,
         this.frameY * this.height,
         this.width,
         this.height,
         this.x,
         this.y,
         this.width,
         this.height
      )
   }

   onGround() {
      return this.y >= this.game.height - this.height - this.game.groundMargin
   }

   setStates(state, speed) {
      this.currentState = this.states[state]
      this.game.speed = this.game.maxSpeed *speed
      this.currentState.enter()
   }

   checkCollision() {
      this.game.enemies.forEach(enemy => {
         if(
            enemy.x < this.x + this.width &&
            enemy.x + enemy.width > this.x &&
            enemy.y < this.y + this.height &&
            enemy.y + enemy.height > this.y
         ) 
         {
            // collision detect
            enemy.markForDeletion = true

            this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))

            if(this.currentState === this.states[4] || this.currentState === this.states[5]) {
               this.game.score++
               this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50))
            }

            else {
               this.setStates(6, 0)
               this.game.lives--
               if(this.game.lives <= 0) {
                  this.game.gameOver = true
               }
            }
         }
      })
   }
}