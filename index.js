const knex = require('./app/database');
const addGame = require('./app/addGames').addGameInData
const parseLinks = require('./app/parsePrices').parsePrices
const parserWorking = require('./app/parsePrices').chackParserWork


const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('views/assets'));
const bodyParser = require('body-parser');
const { stat } = require('fs');
const XLSX = require('xlsx');



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/gameadd', async function (req, res) {
    let status = await addGame(req.body.link);
    if(status.error){
        return res.send(status.messege)
    }
    return res.send(status.messege)
})
app.get('/parsealldata', async function (req, res) {
    let sourceLinks =  await knex('games').select('link');
    let links= [];
    sourceLinks.forEach(link => {
        links.push(link.link)
    });
    let status = await parseLinks(links)
    res.send(status.messege)
})
app.get('/renderdata', async function (req, res) {
    let games = await knex('games').select('*');
    let prices = await knex('prise').select('*').orderBy('id', 'desc');
    let hashMap = {}

    games.forEach(game => {
        hashMap[game.id] = []
        prices.forEach(price => {
            if(game.id === price['game-id']){
                hashMap[game.id].push([price.date.toString().slice(0, 16), price.price])
            }
        });
    });
    res.send(JSON.stringify({
        parser: parserWorking,
        games: games,
        prices: prices,
        hashMap: hashMap
    }))
})
app.get('/', async function (req, res) {
    let status = parserWorking();
    if(status === false){
        res.render('', {
            layout: 'default-layout',
          });
    }
    else{
        res.render('save', {
            
          });
    }
    
});
app.get('/pricelist', async function (req, res) {
    let games = await knex('games').select('*');
    let prices = await knex('prise').select('*').orderBy('id', 'desc');
    let hashMap = {}

    games.forEach(game => {
        hashMap[game.id] = []
        prices.forEach(price => {
            if(game.id === price['game-id']){
                hashMap[game.id].push([price.date.toLocaleDateString(), price.price])
            }
        });
    });
    res.send(JSON.stringify(hashMap));
});
app.post('/parseone', async function (req, res) {
    let link = await knex('games').select('link').where({ id: req.body.id });
    let parsedData = await parseLinks([link[0].link])
    if(parsedData.error){
        res.send(`${req.body.id} Возникла ошибка`)
    }
    else{
        res.send(`${req.body.id} загружен`)
    }

    
});
app.get('/deleteallprices', async function (req, res) {
    await knex('prise')
    .del()
    res.send('Все цены удалены')
})
app.get('/cleandatabase', async function (req, res) {
    await knex('prise')
    .del()
    await knex('games')
    .del()
    res.send('База очищена')
})
app.post('/deletegame', async function (req, res) {
    await knex('prise')
    .where({
        'game-id': req.body.id
    })
    .del()
    await knex('games')
    .where({
        id: req.body.id
    })
    .del()
    
    await res.send('Игра удалена')
});

app.get('/getexcelfile', async function (req, res) {
    let now = new Date()
    let games = await knex('games').select('*');
    let prices = await knex('prise').select('*').orderBy('id', 'desc');
    let data = []

    games.forEach(game => {
        let obj = {}
        prices.forEach(price => {
            if(game.id === price['game-id']){

                data.push(obj)
            }
        });
    });
    res.sendFile(`./temp/report-${now.toISOString()}.xlsx`)
});

app.listen(3000)