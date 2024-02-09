const knex = require('./database');
const parse = require('./getLinks').getLinks
const checkDubl = require('./checkDublicate').checkDublicateGameInData

module.exports = {
    async addGameInData(link) {
        let dublicate = await checkDubl(link)
        if(dublicate === true){
            return {
                error: 'Error',
                messege: 'Игра уже в базе'
            }
        }
        let data = await parse(link);
        if(data.error){
            return {
                status: 'Error',
                messege: 'Страница не существует'
            }
        }
        let gameId = await knex('games').insert({
            'name': data.name,
            'link': link,
        })
        .returning('id')
        .into('games');
        await knex('prise').insert({
             'game-id': gameId,
             'date': knex.raw('CURRENT_TIMESTAMP'),
             'price': parseInt(data.price), 
        });
        return {
            status: 'OK',
            messege: 'Игра добавлена'
        }
    }
}