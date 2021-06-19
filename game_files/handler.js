import Game from './run_game.js';
import {makeGame} from "./make_game.js";

const gameSelector = document.getElementById('game-selector');
const gameSelectButton = document.getElementById('selected-level');

const game = new Game();

const startNewGame = async (gameNum) => {
    let returnedGame = await fetch(`http://www.playsudoku.cloud/games/${gameNum}`);
    console.log(returnedGame);
    console.log(gameNum);
    if (returnedGame) {
        returnedGame = await returnedGame.json();
        let gameArrs = makeGame(returnedGame.gameStr, returnedGame.solutionStr);
        game.runGame(gameArrs[0], gameArrs[1]);
    }
}

startNewGame(gameSelector.value);


gameSelectButton.addEventListener('click', () => startNewGame(gameSelector.value));


// gameSelector.addEventListener('input',startNewGame);


