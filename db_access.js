const {MongoClient} = require('mongodb');

const url = "mongodb+srv://robbi:.R*TMp9hvYP43Vz@sudoku.q55f7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

const dbName = "Sudoku";

const getGamesColl = async () => {
    try {
        await client.connect();
        console.log('Connected');
        const db = client.db(dbName);
        const gamesColl = db.collection('games');
        return gamesColl;
    } catch(err) {
        console.log(err);
    }
}

const insertGame = async (id, difficulty, gameStr, solutionStr) => {
    try {
        const coll = await getGamesColl();

        const game = {
            'gameNum': id,
            'difficulty': difficulty,
            'gameStr': gameStr,
            'solutionStr': solutionStr
        };

        const result = await collection.insertOne(game);
        console.log(`${result.insertedCount} document was inserted with the _id: ${result.insertedId}`);


    } catch(err) {
        console.log(err);
    }
};

const insertManyGames = async (games) => {
    try{
        const gamesColl = await getGamesColl();
        await gamesColl.insertMany(games);
    } catch(err) {
        console.log(err);
    }
}

const getGameByNum = async (gameNum) => {
    try {
        gamesColl = await getGamesColl();
        game = gamesColl.findOne({gameNum: Number(gameNum)});
        return game;

    } catch(err) {
        console.log(err.stack);
    }

    /*
    finally {
        await client.close();
    }
    */
};

const getGamesQuery = async (query) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('games');
        return col.find(query);
    } catch(err) {
        console.log(err.stack);
    }
};

module.exports = {
    getGameByNum,
    getGamesQuery,
    insertGame,
    insertManyGames
};

/*
let diff = 1.4;
let gameStr = '........5.2...9....9..2...373..481.....36....58....4...1...358...42.......978...2';
let solutionStr = '473816925628539741195427863732948156941365278586172439217693584864251397359784612';


insertGame(2.2, gameStr, solutionStr);
*/

/*
getGameById().then((data) => {
    data.forEach(console.dir);

});
*/