


const makeGame = (gameStr, solutionStr) => {
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
    return [gameGrid, solutionGrid];
}


export {makeGame};



