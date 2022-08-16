import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemies, GroundEnemies, ClimbingEnemies } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load", () => {
    /** @type {HTMLCanvasElement} */

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    // const backdrop = document.querySelector('.backdrop')
    // const modal = document.querySelector('.modal')
    // const playBtn = document.getElementById('play')

    canvas.width = 1395;
    canvas.height = 698;

    class Game {
        // It will construct the player, enemies and etc.
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 65;
            // this.groundMargin = 97;
            this.speed = 0;
            this.maxSpeed = 6;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UIClass = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = []
            this.floatingMessages = []
            this.maxParticles = 200
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.fontColor = "black";
            this.time = 0
            this.maxTime = 80000
            this.gameOver = false
            this.lives = 5
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        // it will update the player and enemies movements
        update(deltaTime) {
            this.time += deltaTime
            if (this.time > this.maxTime) {
                this.gameOver = true
            }


            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else this.enemyTimer += deltaTime;

            this.enemies.forEach((enemy) => {
                enemy.update(deltaTime);
            });

            this.floatingMessages.forEach((msg) => {
                msg.update();
            });

            // handle particles
            this.particles.forEach((el, idx) => {
                el.update();

                if (el.markForDeletion) this.particles.splice(idx, 1);
            });

            if(this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles
            }

            // handle collisions
            this.collisions.forEach((el, idx) => {
                el.update(deltaTime)
                
                if(el.markForDeletion) this.collisions.splice(idx, 1)
            })

            this.enemies = this.enemies.filter(enemy => !enemy.markForDeletion)

            this.floatingMessages = this.floatingMessages.filter(msg => !msg.markForDeletion)

        }

        // it will display the player and enemies on screen
        draw(ctx) {
            this.background.draw(ctx);
            this.player.draw(ctx);

            this.enemies.forEach((enemy) => {
                enemy.draw(ctx);
            });

            this.particles.forEach((el, idx) => {
                el.draw(ctx);

                if (el.markForDeletion) this.particles.splice(idx, 1);
            });

            this.collisions.forEach(collision => {
                collision.draw(ctx)
            })

            this.floatingMessages.forEach(msg => {
                msg.draw(ctx);
            });
            this.UIClass.draw(ctx);
        }

        addEnemy() {
            if (this.speed > 0 && Math.random() < 0.5)
                this.enemies.push(new GroundEnemies(this));
            else if (this.speed > 0)
                this.enemies.push(new ClimbingEnemies(this));
            this.enemies.push(new FlyingEnemies(this));

            // console.log(this.enemies);
        }

        restartGame() {
            this.player.restart()
            this.background.restart()
            this.score = 0
            this.time = 0
            this.enemies = []
            this.collisions = []
            this.particles = []
            this.floatingMessages = []
            this.gameOver = false

            animation(0)
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;
    // game animation function
    function animation(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animation);
    }
    animation(0);
});
