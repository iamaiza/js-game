export class InputHandler {
    constructor(game) {
        this.game = game
        this.keys = []
        this.touchX = ''
        this.touchY = ''
        this.touchTreshold = 30

        window.addEventListener('keydown', (e) => {
            if(
                (
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowDown' ||
                    e.key === 'ArrowRight' ||
                    e.key === 'Enter'
                ) &&
                this.keys.indexOf(e.key) === -1
            )
            {
                this.keys.push(e.key)
            }
            else if(e.key === 'd') this.game.debug = !this.game.debug

            else if(e.key === 'Escape' && this.game.gameOver) {
                this.game.restartGame()
            }
        })

        window.addEventListener('keyup', (e) => {
            if(
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowDown' ||
                e.key === 'ArrowRight' ||
                e.key === 'Enter'

            )
            {
                this.keys.splice(this.keys.indexOf(e.key), 1)
            }
            
        })

        window.addEventListener('touchstart', (e) => {
            this.touchX = e.changedTouches[0].pageX
            this.touchY = e.changedTouches[0].pageY
        })

        window.addEventListener('touchmove', (e) => {
            const swipeMovement = e.changedTouches[0].pageX - this.touchX
            const swipeDistance = e.changedTouches[0].pageY - this.touchY

            if(
                swipeDistance < -this.touchTreshold &&
                this.keys.indexOf('swipe up') === -1
            ) {
                this.keys.push('swipe up')
            }

            else if(
                swipeMovement < -this.touchTreshold &&
                this.keys.indexOf('swipe left') === -1
            ) {
                this.keys.push('swipe left')
            }

            else if(
                swipeDistance > this.touchTreshold &&
                this.keys.indexOf('swipe down') === -1
            ) {
                this.keys.push('swipe down')
            }

            else if(
                swipeMovement > this.touchTreshold && 
                this.keys.indexOf('swipe right') === -1
            ) {
                this.keys.push('swipe right')
            }
            
        })

        window.addEventListener('touchend', (e) => {
            this.keys.splice(this.keys.indexOf('swipe up'), 1)
            this.keys.splice(this.keys.indexOf('swipe left'), 1)
            this.keys.splice(this.keys.indexOf('swipe down'), 1)
            this.keys.splice(this.keys.indexOf('swipe right'), 1)
        })

    }
}