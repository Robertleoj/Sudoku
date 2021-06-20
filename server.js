const express = require('express');
const app = express();
const path = require('path');
const javaScriptRouter = require('./javascriptRequests.js');
const gameRouter = require('./games.js');



const PORT = process.env.PORT || 3000;

app.use('/games', gameRouter);
app.use(express.static('static'));
app.use(express.static('game_files'));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/index.html' ));
});



app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})
