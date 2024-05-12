const colors = ['yellow', 'red', 'blue', 'orange', 'green', 'magenta']

// function for setting tetriminos color

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)]
}

// A tetrimino is composed by many blocks

class Tetrimino {

    constructor(name = random(["Z", "S", "J", "L", "T", "O", "I"])) {
        this.name = name
        let base = tetriminosBase[name]
        this.color = base.color
        this.map = []
        for (const block of base.map) {  // for obataining the block position of the tetrimino
            this.map.push(block.copy()) // we add a copy of the block to the map array
        }
        this.position = createVector(int(board.columns / 2), -1) // set where the tetrimino appears
    }

    moveRIGHT() {
        this.position.x++
        if (this.badMovement) {
            this.moveLEFT()
        }
    }

    moveLEFT() {
        this.position.x--
        if (this.badMovement) {
            this.moveRIGHT()
        }
    }

    moveDOWN() {
        this.position.y++;
        if (this.badMovement) {
            this.moveUP();
            if (tetrimino == this) {
                board.storeBlock = this;
                tetrimino = new Tetrimino();
            }
            return false //bad movement
        }
        return true //gets to the end of the funcion
    }

    moveUP() {
        this.position.y--
    }

    putOnTheBack() {
        this.position = this.spectrum.position
        this.moveDOWN()
    }


    // method for rotating each block clockwise (90°)

    rotateClockWise() {
        for (const block of this.map) {
            block.set(block.y, -block.x)
        }

        // if there is a collision the block is going back to its position

        if (this.badMovement) {
            this.rotateCounterClockWise()
        }

    }

    // method for rotation blocks counterclokwise (-90°)

    rotateCounterClockWise() {
        for (const block of this.map) {
            block.set(- block.y, block.x)
        }

    }


    //checks if there is a collision

    get badMovement() {
        let Collision = !this.Collision
        return Collision || this.storedBlocksCollision
    }

    // to make blocks solidify

    get storedBlocksCollision() {
        for (const block of this.BoardMap) {
            if (board.storedBlocks[block.x][block.y]) { // if there is a stored block in that cell, it returns true
                return true
            }
        }
        return false
    }



    get Collision() {
        for (const block of this.BoardMap) {
            if (block.x < 0) { // to avoid the tetrimino getting outside the board on the left side
                return false
            }

            if (block.x >= board.columns) { // to avoid the tetrimino getting outside on the right side
                return false
            }

            if (block.y >= board.rows) { // to avoid the tetrimino getting outside at the bottom
                return false
            }
        }

        return true
    }

    get BoardMap() {  // return the canvas map
        let ret = []
        for (const block of this.map) {
            let copy = block.copy().add(this.position) // so that the tetrimino moves faster
            ret.push(copy)
        }
        return ret
    }


    get CanvasMap() {  // return the canvas map
        let ret = []
        for (const block of this.map) {
            let copy = block.copy().add(this.position) // so that the tetrimino moves faster
            ret.push(board.coordinate(copy.x, copy.y))
        }
        return ret
    }


    // drawing the tetrimino 

    draw() {
        push();
        fill(this.color);
        for (const block of this.CanvasMap) {
            Tetrimino.drawBlock(block); // as it is a static function we should call class Tetrimino
        }
        pop();

        if (tetrimino == this) {
            this.drawSpectrum();
        }
    }

    // drawing a spectrum of the tetrmino, so that the player knows where the tetrimino will fall
    drawSpectrum() {
        this.spectrum = new Tetrimino(this.name);
        this.spectrum.position = this.position.copy()
        for (let i = 0; i < this.map.length; i++) {
            this.spectrum.map[i] = this.map[i].copy()
        }
        while (this.spectrum.moveDOWN());
        push()
        drawingContext.globalAlpha = 0.3
        this.spectrum.draw();
        pop()
    }

    static drawBlock(block) {

        rect(block.x, block.y, board.block_side) // to establish the coordinates of the tetrimino on the board
        push()
        noStroke()
        fill(255, 255, 255, 80) // for adding brightness to the tetrimino 
        beginShape()
        vertex(block.x, block.y)
        vertex(block.x + board.block_side, block.y)
        vertex(block.x + board.block_side, block.y + board.block_side)
        endShape(CLOSE)
        beginShape()
        fill(0, 0, 0, 80)
        vertex(block.x, block.y)
        vertex(block.x, block.y + board.block_side)
        vertex(block.x + board.block_side, block.y + board.block_side)
        endShape(CLOSE)
        pop()
    }

}

//create tetriminos shapes

function baseMapTetriminosCreation() {
    tetriminosBase = {
        "Z": {
            color: getRandomColor(),
            map: [
                createVector(),
                createVector(-1, -1),
                createVector(0, -1),
                createVector(0, 0),
                createVector(1, 0),
            ]
        },

        "S": {
            color: getRandomColor(),
            map: [
                createVector(),
                createVector(1, -1),
                createVector(0, -1),
                createVector(-1, 0)
            ]
        },

        "J": {
            color: getRandomColor(),
            map: [
                createVector(),
                createVector(-1, 0),
                createVector(-1, -1),
                createVector(1, 0),
            ]
        },

        "L": {
            color: getRandomColor(),
            map: [
                createVector(),
                createVector(-1, 0),
                createVector(1, -1),
                createVector(1, 0),
            ]
        },

        "T": {
            color: getRandomColor(),
            map: [
                createVector(),
                createVector(-1, 0),
                createVector(1, 0),
                createVector(0, -1),
            ]
        },

        "O": {
            color: getRandomColor(),
            map: [
                createVector(),
                createVector(0, -1),
                createVector(1, -1),
                createVector(1, 0),
            ]
        },


        "I": {
            color: getRandomColor(),
            map: [
                createVector(),
                createVector(-1, 0),
                createVector(1, 0),
                createVector(2, 0),
            ]
        },
    }
}