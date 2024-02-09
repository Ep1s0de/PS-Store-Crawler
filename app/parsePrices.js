const knex = require('./database');
const parse = require('./getLinks').getLinks


let parserWorking = false
function chackParserWork(){
    if(parserWorking === false){
        return false
    }
    return true
}

async function parsePrices (links){
    parserWorking = true
    if(Array.isArray(links) === false){
        return {
            error: 'Ссылки не в массиве'
        }
    }
    for (let link of links) {
            let data = await parse(link);
                let game = await knex('games').select('*').where({
                    link: link
                  }).first();
                await knex('prise').insert({
                    'game-id': game.id,
                    'date': knex.raw('CURRENT_TIMESTAMP'),
                    'price': data.price, 
               });
    }
    parserWorking = false
    return {
        message: 'Актуальные цены загружены'
    }
}

module.exports = {
    parsePrices,
    chackParserWork,
}