
import { gameGrid, solutionGrid } from "./make_game.js";


const sudokuTable = document.getElementById('sudoku-grid');

const completedCellClass = 'cell-completed';
const selectedCellClass = 'cell-selected';
const idleCellClass = 'cell-idle';

const idleNumberButtonClass = 'num-button-idle';

const cellArr = [];

const thickBorder = '3px solid black';

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
	constructor(number=null, i = null, j = null, completed=false){
        
		this._cell = this._initializeCell();

        if (number) {
            this.setValue(number)
        }

        if (i && j){
            this._i = i;
            this._j = j;
        }
        this._selectCallbacks = [];
	}

    get cell() {
        return this._cell;
    }
    

    _initializeCell(number = null) {
        let cell = document.createElement('td');
        cell.classList.add('cell');
        cell.classList.add(idleCellClass);
        return cell
    }

    setCoordinates(i, j){
        this._i = i;
        this._j = j;
    }

    _setCellClass(cellClass) {
        this._cell.classList.remove(idleCellClass, completedCellClass, selectedCellClass);
        this._cell.classList.add(cellClass);
    }

    markCompleted() {
        this._setCellClass(completedCellClass);
        this._clearCallbacks();
    }

    markIdle() {
        this._setCellClass(idleCellClass);
    }

    markSelected() {
        this._setCellClass(selectedCellClass);
    }

    setValue(value) {
        this._cell.innerText = value;
    }

    getValue() {
        return  Number(this._cell.innerText);
    }

	getCoordinates() {
		return [this._i, this._j]
	}

    addClickCallback(callback) {
        this._selectCallbacks.push(callback);
        this._cell.addEventListener('click', callback);
    }

    _clearCallbacks() {
        for (let i =0; i< this._selectCallbacks.length; i++ ) {
            this._cell.removeEventListener('click', this._selectCallbacks[i]);
        }
        this._selectCallbacks = [];
    }


    isCompleted() {
        return this._cell.classList.contains(completedCellClass);
    }
    
    isSelected() {
        return this._cell.classList.contains(selectedCellClass);
    }

    isIdle() {
        return this._cell.classList.contains(idleCellClass);
    }
}


class SudokuBoard {
    constructor(gameGrid, solutionGrid) {
        this._boardTable;
        this._boardArr;
        this._initializeSudokuBoard(gameGrid);
        this._solutionGrid = solutionGrid;
        this._selected;
    }

	_initializeSudokuBoard(gameGrid) {
        this._boardArr = [];
		for (let i=0; i < gameGrid.length; i++){
            let boardArrRow = [];

			let row = document.createElement('tr');
			
			for (let j=0; j < gameGrid.length; j++){

                let num = gameGrid[i][j];
				let sudCell = this._makeCell(num, i, j);
				row.appendChild(sudCell.cell);
                boardArrRow.push(sudCell);
			}
			if ((i + 1) % 3 === 0 && i !== 8) {
				row.style.borderBottom = thickBorder;
			}
            this._boardArr.push(boardArrRow);
			sudokuTable.appendChild(row);
		}
	}

	_makeCell(num, i, j) {
        

        let sudCell = new SudokuCell();
        sudCell.setCoordinates(i, j);

		if (num !== 0){
			sudCell.innerText = num;
            sudCell.setValue(num);
            sudCell.markCompleted();
		} else {
			sudCell.addClickCallback(() => {this._select(sudCell)});
            sudCell.addClickCallback(() => {sudCell.markSelected()});
		}

		if ((j+ 1) % 3 === 0 && j !== 8) {
			sudCell.cell.style.borderRight = thickBorder;
		}

		return sudCell
	}

    _select(sudCell) {
        if (this._selected){
            if (this._selected.isSelected()){
                this._selected.markIdle();
            }
        }
        this._selected = sudCell;
    }

    tryInsert(num) {
        if(this._selected) {
            let coordinates = this._selected.getCoordinates();
            let i = coordinates[0];
            let j = coordinates[1];
            if (this._solutionGrid[i][j] === num){
                this._boardArr[i][j].setValue(num)
                this._boardArr[i][j].markCompleted();
            }
        }
    }

}

class NumberButton {
    constructor(num) {
        this._numButton;
        this._clickCallbacks = [];
        this._initializeNumberButton(num);

    }

    get numButton() {
        return this._numButton;
    }

    setClickCallback(callback) {
        this._clickCallbacks.push(callback);
        this._numButton.addEventListener('click', callback);
    }

    clearClickCallbacks() {
        for (let i = 0; i< this._clickCallbacks.length; i++) {
            this._numButton.removeEventListener(this._clickCallbacks[i]);
        }
        this.clickCallbacks = [];
    }

    _initializeNumberButton(num) {
        let numButton = document.createElement('td');
        numButton.innerText = num;
        numButton.classList.add('num-button');
        this._numButton = numButton;
        this.markIdle();
    }

    _setClass(numButtonClass) {
        this._numButton.classList.remove(idleNumberButtonClass);
        this._numButton.classList.add(numButtonClass);
    }

    /*
    markCompleted() {
        this._setCellClass(completedCellClass);
        this._clearCallbacks();
    }
    */

    markIdle() {
        this._setClass(idleNumberButtonClass);
    }

    /*
    markSelected() {
        this._setCellClass(selectedCellClass);
    }
    */

}

class NumberButtons {
    constructor() {
        this._numberButtonsArr;
        this.initializeNumberButtons();
    }

    initializeNumberButtons() {
        const buttonContainer = document.getElementById('sudoku-button-container');
		let row = document.createElement('tr');
        let numberButtonsArr = [];

		for (let i = 1; i <= 9; i++){

            let numButton = new NumberButton(i);
			row.appendChild(numButton.numButton)
            numberButtonsArr.push(numButton);
		}

		buttonContainer.appendChild(row)
        this._numberButtonsArr = numberButtonsArr;

    }

    setClickCallback(buttonNum, callback) {
        this._numberButtonsArr[buttonNum - 1].setClickCallback(callback);
    }
}

class Game {
	constructor(gameGrid, solutionGrid) {

        this.sudokuBoard = new SudokuBoard(gameGrid, solutionGrid);
		this.scoreKeeper = new ScoreKeeper(gameGrid);
        this.numberButtons = new NumberButtons();

        this.initializeGame();

	}
	

    initializeGame() {
        for (let i = 1; i <= 9; i++ ) {
            this.numberButtons.setClickCallback(i, () => {this.sudokuBoard.tryInsert(i)});
        }
    }



}

const game = new Game(gameGrid, solutionGrid);

