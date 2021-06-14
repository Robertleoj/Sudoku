


// const gameStr = '1..5.37..6.3..8.9......98...1.......8761..........6...........7.8.9.76.47...6.312'

// const solutionStr = '198543726643278591527619843914735268876192435235486179462351987381927654759864312'
// const gameStr = '...81.....2........1.9..7...7..25.934.2............5...975.....563.....4......68.'
// const solutionStr = '934817256728653419615942738176425893452398167389176542897564321563281974241739685'
const gameStr = '1....4..2..27....49...5.7...9..21..8.6.....3...1..9........71..52...........3.62.'
const solutionStr = '175964382682713594943852716397621458268475931451389267836297145529146873714538629'
let gameGrid = [];
let solutionGrid = [];

let line = [];
let solutionLine = [];
for (let i = 0; i< gameStr.length; i++ ){

	let char = gameStr[i];
	let solutionChar = solutionStr[i];

	line.push(char === '.' ? 0 : Number(char));
	solutionLine.push(Number(solutionChar));

	if ((i + 1) % 9 === 0 ){
		gameGrid.push(line);
		solutionGrid.push(solutionLine);
		solutionLine = [];
		line = [];
	}
}


export {gameGrid,solutionGrid};



