
const express = require('express');
const {getGameByNum} = require('./db_access.js');
const gameRouter = express.Router();


gameRouter.get('/:gameNum', async (req, res, next) => {
    console.log(req.params.gameNum);
    const game = await getGameByNum(req.params.gameNum);
    console.log(game);
    if (game) {
        res.json(game);
    } else {
        res.status(400).send();
    }
})

module.exports = gameRouter;