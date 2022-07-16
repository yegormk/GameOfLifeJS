const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resoluton = 6; // how small sell will be
canvas.width = window.innerWidth; // width of canvas
canvas.height = window.innerHeight; // height of canvas
const defectedWidth = canvas.width % resoluton;
const defectedHeight = canvas.height % resoluton;

const cols = (canvas.width - defectedWidth) / resoluton; // there is we are creating amount of cols for grid
const rows = (canvas.height - defectedHeight) / resoluton; // there is we are creating amount of rows for grid


class cell {
    constructor(){
        this.currentState = Math.floor(Math.random() * 2);
        this.total = 0;
    }
    setState (state) {
        this.currentState = state;
        this.total += state;
    }
}

// building grid
function buildGrid() {
    return new Array(cols).fill(null)
        .map(() => new Array(rows).fill(null)
        .map(() => new cell()));
}

let grid = buildGrid(); // call a function to build grid

// FPS
setInterval(() =>{
    grid = nextGen(grid);
    render(grid);
}, 10);

// Copy the old grid and forming a new one
function nextGen(grid) {
    // const nextGen = grid.map(arr => [...arr]);
    const currentGen = grid.map(arr => arr.map(cell => cell.currentState))

    for(let col = 0; col < currentGen.length; col++){
        for(let row = 0; row < currentGen[col].length; row++){
            const cell = currentGen[col][row];
            let numNeighbours = 0;
            for(let i = -1; i < 2; i++){
                for(let j = -1; j < 2; j++){
                    if( i === 0 && j === 0){
                        continue;
                    }
                    const x_cell = col + i;
                    const y_cell = row + j;

                    if(x_cell >= 0 && y_cell >= 0 && x_cell < cols && y_cell < rows){
                        const currentNeighbour = currentGen[col + i][row + j];
                        numNeighbours += currentNeighbour;
                    }
                }
            }
            // rules of game
            if(cell === 1 && numNeighbours < 2){
                grid[col][row].setState(0);
            }else if(cell === 1 && numNeighbours > 3){
                grid[col][row].setState(0);
            }else if(cell === 0 && numNeighbours ===3){
                grid[col][row].setState(1);
            }else {
                grid[col][row].setState(grid[col][row].currentState);
            }

        }
    }
    return grid;
}

//painting sells in canvas
function render(grid){
    let maxTotal = 0;
    for(let col = 0; col < grid.length; col++){
        for(let row = 0; row < grid[col].length; row++){
            const cell = grid[col][row];
            if(cell.total > maxTotal){
                maxTotal = cell.total;
            }
        }
    }


    for(let col = 0; col < grid.length; col++){
        for(let row = 0; row < grid[col].length; row++){
            const cell = grid[col][row];


            ctx.beginPath();
            ctx.rect(col * resoluton, row * resoluton, resoluton, resoluton);
            // ctx.fillStyle = cell.currentState ? 'black' : 'white';
            const normalised = cell.total / maxTotal;
            const h = (1.0 - normalised) * 240
            ctx.fillStyle = `hsl(${h}, 100%, 50%)`;
            ctx.fill();
            // ctx.stroke(); // blocks around each sell of grid
        }
    }

}