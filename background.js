class Layer {
    constructor(game, width, height, speedModifier, img) {
        this.game = game
        this.width = width
        this.height = height
        this.speedModifier = speedModifier
        this.img = img
        this.x = 0
        this.y = 0
    }

    update() {
        if(this.x < -this.width) this.x = 0
        else this.x -= this.game.speed * this.speedModifier
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
        ctx.drawImage(this.img, this.x + this.width, this.y, this.width, this.height)
    }
}


export class Background {
    constructor(game) {
        this.game = game
        this.width = 1667
        this.height = 720
        this.layer1Img = layer1
        this.layer2Img = layer2
        this.layer3Img = layer3
        this.layer4Img = layer4
        this.layer5Img = layer5
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1Img)
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2Img)
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3Img)
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4Img)
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5Img)
        this.backgroundLayers = [
            this.layer1,
            this.layer2,
            this.layer3,
            this.layer4,
            this.layer5
        ]
    }

    restart() {
        this.backgroundLayers.forEach(layer => {
            layer.x = 0
        })
    }
    update() {
        this.backgroundLayers.forEach(layer => {
            layer.update()
        })
    }

    draw(ctx) {
        this.backgroundLayers.forEach(layer => {
            layer.draw(ctx)
        })
    }
}