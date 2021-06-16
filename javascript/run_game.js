
import { gameGrid, solutionGrid } from "./make_game.js";


const sudokuTable = document.getElementById('sudoku-grid');

const completedCellClass = 'cell-completed';
const selectedCellClass = 'cell-selected';
const idleCellClass = 'cell-idle';
const highlightedCellClass = 'cell-highlighted';
const completedAllCellClass = 'cell-completed-all';

const idleNumberButtonClass = 'num-button-idle';
const completedNumberButtonClass = 'num-button-completed';

const cellArr = [];

const thickBorder = '3px solid black';

sudokuTable.style.border = thickBorder;

class ScoreKeeper {
	constructor(gameGrid){

        this._howManyLeft = {};

        for (let i = 1; i<=9; i++ ){
            this._howManyLeft[i] = 9;
        }

		gameGrid.forEach((currentLine) => {
			currentLine.forEach((curr) => { 
                curr = Number(curr);
                if (curr !== 0){
                    this._howManyLeft[curr] -= 1;
                } 
            })
		});

	}

	foundOne(i) {
		this._howManyLeft[i] -= 1;
        return this._howManyLeft[i] === 0;
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

    markHighlighted() {
        this._setCellClass(highlightedCellClass);
    }

    markCompletedAll() {
        this._setCellClass(completedAllCellClass);
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

    flashRed() {
        this._cell.classList.add('red');
        setTimeout( () => {
            this._cell.classList.remove('red');
        }, 100);
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
        // this._highLightAroundSelected();
    }

    foundAll(num) {
        for (let row of this._boardArr){
            for (let sudCell of row) {
                if (sudCell.getValue() == num) {
                    sudCell.markCompletedAll();
                }
            }
        }
    }

    /*
    _highLightAroundSelected() {
        let position = this._selected.getCoordinates();
        let i_pos = position[0];
        let j_pos = position[1];

        for (let i = 0; i< 9;i++ ){
            let x_el = this._boardArr[i_pos][i]
            let y_el = this._boardArr[i][j_pos]
            this._highlightIfIdle(x_el);
            this._highlightIfIdle(y_el);

        }
    }

    _highlightIfIdle(sudCell){
        if (sudCell.isIdle()) {
            sudCell.markHighlighted()
        }
    }
    */

    tryInsert(num) {
        if(this._selected) {
            let coordinates = this._selected.getCoordinates();
            let i = coordinates[0];
            let j = coordinates[1];
            if (this._solutionGrid[i][j] === num){
                this._boardArr[i][j].setValue(num)
                this._boardArr[i][j].markCompleted();
                return true;
            } else {
                this._boardArr[i][j].flashRed();
                return false;
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

    _clearClickCallbacks() {
        for (let i = 0; i< this._clickCallbacks.length; i++) {
            this._numButton.removeEventListener('click',this._clickCallbacks[i]);
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

    markCompleted() {
        this._setClass(completedNumberButtonClass);
        this._clearClickCallbacks();
    }

    markIdle() {
        this._setClass(idleNumberButtonClass);
    }


    flashRed() {
        this._numButton.classList.add('red');
        setTimeout( () => {
            this._numButton.classList.remove('red');
        }, 100);
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

    flashRed(num) {
        this._numberButtonsArr[num - 1].flashRed();
    }

    foundAll(num) {
        this._numberButtonsArr[num - 1].markCompleted();
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
            this.numberButtons.setClickCallback(i, () => {
                let succeeded = this.sudokuBoard.tryInsert(i);
                if (!succeeded) {
                    this.numberButtons.flashRed(i);
                } else {
                    let foundAll = this.scoreKeeper.foundOne(i);
                    if (foundAll) {
                        this.sudokuBoard.foundAll(i);
                        this.numberButtons.foundAll(i);
                    }

                }
            });
        }
    }



}

const game = new Game(gameGrid, solutionGrid);

