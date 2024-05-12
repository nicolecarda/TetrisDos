class Board {
    constructor() {
        this.columns = 10
        this.rows = 20
        this.block_side = 25
        this.width = this.columns * this.block_side
        this.height = this.rows * this.block_side
        this.position = createVector(board_margin, board_margin + 2 * this.block_side) // prop lets us position the board on the screen

        // Board initialization

        this.storedBlocks = []  // stores tetriminos
        for (let row = 0; row < this.rows; row++) {
            this.storedBlocks[row] = [] //empty array
            for (let column = 0; column < this.columns; column++) {
                this.storedBlocks[row].push("") //array with empty text
            }
        }
    }

    set storeBlock(tetrimino) {
        for (const block of tetrimino.BoardMap) {
            if (block.y < 0) { // when we loose the game starts again
                board = new Board()  // reset board
                tetrimino = new Tetrimino() // reset tetrimino
                made_lines = 0
            }
            this.storedBlocks[block.x][block.y] = tetrimino.name
        }
        this.searchCompletedLines();
    }


    // method for going round the columns and rows and detecting the ones we have to delete

   searchCompletedLines() {
        let lines = [];
        for (let row = this.rows; row >= 0; row--) {
            let add = true;
            for (let column = 0; column < this.columns; column++) {
                if (!this.storedBlocks[column][row]) {
                    add = false;
                    break;
                }
            }
            if (add) {
                lines.push(row) //If a row is found to be fully occupied, it adds its index to the lines array
            }
        }
        this.deleteCompletedLines(lines);
    }

    // method for deleting completed rows when you win

    deleteCompletedLines(lines) {
        made_lines += lines.length;
        for (const line of lines) {
            for (let row = line; row >= 0; row--) {
                for (let column = 0; column < this.columns; column++) {
                    if (row == 0) {
                        this.storedBlocks[column][row] = "";
                        continue;
                    }
                    this.storedBlocks[column][row] = this.storedBlocks[column][row - 1] // Clear the top row
                }
            }
        }
    } 



    // for positioning the board

    coordinate(x, y) {
        return createVector(x, y).mult(this.block_side).add(this.position);
    } // The vector is multiplied by block_side to scale



    // function for drawing the board

    draw() {

        push() // for adding elements at th end of an array
        noStroke() // avoid drawing blocks borders



        for (let column = 0; column < this.columns; column++) {
            for (let row = 0; row < this.rows; row++) {
                fill("green");
                let c = this.coordinate(column, row);
                rect(c.x - 1, c.y - 1, this.block_side + 2, this.block_side + 2); // Larger rectangle with white border

                // Draw black square
                fill("black");
                rect(c.x, c.y, this.block_side, this.block_side); // square
            }
        }
        pop()
        this.drawStoredBlocks()
    }

    // for drawing stored tetriminos at the bottom of the board

    drawStoredBlocks() {
        push()
        for (let column = 0; column < this.columns; column++) {
            for (let row = 0; row < this.rows; row++) {
                let blockName = this.storedBlocks[column][row]
                if (blockName) { // if the block has a name, we will mantain its color when it gets to the bottom of the board
                    let color = tetriminosBase[blockName].color
                    fill(color)
                    Tetrimino.drawBlock(this.coordinate(column, row))
                }
            }
        }
        pop()
    }

}