const dbAccess = require('./db_access.js');


const fs = require('fs');



let getLines = async function getLines (filename, lineCount, callback) {
  let stream = await fs.createReadStream(filename, {
    flags: "r",
    encoding: "utf-8",
    fd: null,
    mode: 438, // 0666 in Octal
    bufferSize: 64 * 1024
  });

  let data = "";
  let lines = [];
  stream.on("data", async function (moreData) {
    data += moreData;
    lines = data.split("\n");
    // probably that last line is "corrupt" - halfway read - why > not >=
    if (lines.length > lineCount + 1) {
        stream.destroy();
        lines = lines.slice(0, lineCount); // junk as above
        callback(false, lines);
    }
  });

  stream.on("error", function () {
    callback("Error");
  });

  stream.on("end", async function () {
    await callback(false, lines);
  });

};

getLines("./resources/sudokuGames/sudoku-3m.csv", 1000000 , async function (err, lines) {
    console.log(err);
    await dbAccess.insertManyGames(lines.map((line) => {
        lineArr = line.split(',');
        return {
            gameNum: Number(lineArr[0]),
            difficulty: Number(lineArr[4]),
            gameStr: lineArr[1],
            solutionStr: lineArr[2]
        };
    }))
});