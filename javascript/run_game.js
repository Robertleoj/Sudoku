
import { gameGrid, solutionGrid } from "./make_game.js";


const sudokuTable = document.getElementById('sudoku-grid');

const cellArr = [];

const thickBorder = '3px solid black';
const regularCellHighlightColor = 'lightgrey';
const startingCellHighlightColor = 'cornflowerblue';
const startingCellColor = 'lightblue';

sudokuTable.style.border = thickBorder;

class ScoreKeeper {
	constructor(gameGrid){
		this.numUnknown = gameGrid.reduce((unknown, currentLine) => {
			currentLine.reduce((count, curr) => {return curr === 0? 1 : 0})
		});
	}

	foundOne() {
		this.numUnknown -= 1;
	}

	hasWon() {
		return this.numUnknown === 0;
	}

}

class SudokuCell {
	constructor(cell, i, j){
		this.cell = cell
		this.i = i
		this.j = j
	}

	getCoordinates() {
		return [this.i, this.j]
	}
}

class Game {
	constructor(gameGrid, solutionGrid) {
		this.selected;
		this.scoreKeeper = new ScoreKeeper(gameGrid);
		this.gameGrid = gameGrid;
		this.solutionGrid = solutionGrid;
		this.sudCellArr;
	}
	highlight(cell, color=regularCellHighlightColor)  {
		cell.style.backgroundColor = color;
	}

	unHighlight(cell) {
		
		if (!this.selected || this.selected.cell !== cell){
			cell.style.backgroundColor = '';
		}
	}

	select(sudCell) {
		this.unselect(this.selected)
		sudCell.cell.style.backgroundColor = regularCellHighlightColor;
		this.selected = sudCell;
	}

	unselect(sudCell)  {
		if (this.selected){
			sudCell.cell.style.backgroundColor = '';
			this.selected = null;
		}
	}

	initialize(){


		for (let i=0; i < this.gameGrid.length; i++){
			let row = document.createElement('tr');
			
			for (let j=0; j < this.gameGrid.length; j++){

				let cell = document.createElement('td');

				let sudCell = new SudokuCell(cell, i, j);

				cell.id = `cell ${i} ${j}`;

				cell.classList.add('cell');

				let num = this.gameGrid[i][j]

				if (num !== 0){
					cell.classList.add('starting-cell');
					cell.style.backgroundColor = startingCellColor;
					cell.innerText = num;
					cell.addEventListener('mouseover', ()=>{this.highlight(cell, startingCellHighlightColor)})
				} else {
					cell.addEventListener('mouseover', ()=>{this.highlight(cell)});
					cell.addEventListener('click', () => {this.select(sudCell)});
				}

				row.appendChild(cell);



				if ((j+ 1) % 3 === 0 && j !== 8) {
					cell.style.borderRight = thickBorder;
				}

				cell.addEventListener('mouseout',()=> {this.unHighlight(cell)});
				
			}
			if ((i + 1) % 3 === 0 && i !== 8) {
				row.style.borderBottom = thickBorder;
			}

			sudokuTable.appendChild(row);
		}

		const buttonContainer = document.getElementById('sudoku-button-container');
		let row = document.createElement('tr');

		for (let i = 1; i <= 9; i++){
			let numButton = document.createElement('td');
			numButton.innerText = i;
			numButton.id = `numButton ${i}`;
			numButton.classList.add('num-button');
			numButton.addEventListener('click', () => {this.inputNumber(i, numButton)})
			numButton.addEventListener('mouseover', () => {this.highlight(numButton)})
			numButton.addEventListener('mouseout',() => {this.unHighlight(numButton)} )
			row.appendChild(numButton)
		}

		buttonContainer.appendChild(row)


	}


	correctInput(number){

		this.selected.cell.innerText = number;
		this.selected.cell.style.backgroundColor = startingCellColor;
		this.selected.cell.parentNode.replaceChild(this.selected.cell.cloneNode(true), this.selected.cell);

		this.selected = null;

		this.scoreKeeper.foundOne();
		if (this.scoreKeeper.hasWon()) {
			this.win();
		}
	}

	flashRed(el){
		let curr_col = el.style.backgroundColor;
		el.style.backgroundColor = 'red';
		setTimeout(() => {
			let other_col = el.style.backgroundColor;
			
			el.style.backgroundColor = other_col === 'red' ? curr_col: other_col;
		}, 200);
	}

	incorrectInput(numButton) {
		this.flashRed(this.selected.cell);
		this.flashRed(numButton);
	}


	inputNumber(number, numButton) {
		if (this.selected) {
			let coordinates = this.selected.getCoordinates();
			let i = coordinates[0];
			let j = coordinates[1];
			if (this.solutionGrid[i][j] === number){
				this.correctInput(number);
			} else {
				this.incorrectInput(numButton);
			}
			
		}
	}



}

const game = new Game(gameGrid, solutionGrid);
game.initialize();



/*

let selected;

let scoreKepper = new ScoreKeeper(gameGrid);

const highlight = (cell, color=regularCellHighlightColor) => {
	cell.style.backgroundColor = color;
};

const select = (sudCell) => {
	unselect(selected)
	sudCell.cell.style.backgroundColor = regularCellHighlightColor;
	selected = sudCell;
};

const unselect = (sudCell) => {
	if (selected){
		sudCell.cell.style.backgroundColor = '';
		selected = null;
	}
}


const unHighlight = (cell) => {
	
	if (!selected || selected.cell !== cell){
		cell.style.backgroundColor = '';
	}
};


for (let i=0; i < gameGrid.length; i++){
	let row = document.createElement('tr');

	let cellArrRow = [];
	
	for (let j=0; j < gameGrid.length; j++){

		let cell = document.createElement('td');

		let sudCell = new SudokuCell(cell, i, j);

		cell.id = `cell ${i} ${j}`;

		cell.classList.add('cell');

		let num = gameGrid[i][j]

		if (num !== 0){
			cell.classList.add('starting-cell');
			cell.style.backgroundColor = startingCellColor;
			cell.innerText = num;
			cell.addEventListener('mouseover', ()=>{highlight(cell, startingCellHighlightColor)})
		} else {
			cell.addEventListener('mouseover', ()=>{highlight(cell)});
			cell.addEventListener('click', () => {select(sudCell)});
		}
		row.appendChild(cell);


		cellArrRow.push(sudCell);

		if ((j+ 1) % 3 === 0 && j !== 8) {
			cell.style.borderRight = thickBorder;
		}

		cell.addEventListener('mouseout',()=> {unHighlight(cell)});
		
	}
	if ((i + 1) % 3 === 0 && i !== 8) {
		row.style.borderBottom = thickBorder;
	}

	cellArr.push(cellArrRow);

	sudokuTable.appendChild(row);
}

const correctInput = (number) => {
	selected.cell.innerText = number;
	selected.cell.removeEventListener('click', select);
	selected.cell.removeEventListener('mouseover', highlight);
	selected.cell.removeEventListener('mouseout', unHighlight);
	selected.cell.style.backgroundColor = startingCellColor;
	selected.cell.parentNode.replaceChild(selected.cell.cloneNode(true), selected.cell);
	selected = null;
	scoreKeeper.foundOne();
	if (scoreKeeper.hasWon()) {
		win();
	}
}

const inputNumber = (number) => {
	if (selected) {
		let coordinates = selected.getCoordinates();
		let i = coordinates[0];
		let j = coordinates[1];
		if (solutionGrid[i][j] === number){
			correctInput(number);
		} else {
			incorrectInput(selected.cell);
		}
		
	}
}

const buttonContainer = document.getElementById('sudoku-button-container');
let row = document.createElement('tr');

for (let i = 1; i <= 9; i++){
	let numButton = document.createElement('td');
	numButton.innerText = i;
	numButton.id = `numButton ${i}`;
	numButton.classList.add('num-button');
	numButton.addEventListener('click', () => {inputNumber(i)})
	numButton.addEventListener('mouseover', () => {highlight(numButton)})
	numButton.addEventListener('mouseout',() => {unHighlight(numButton)} )
	row.appendChild(numButton)
}

buttonContainer.appendChild(row)







*/




