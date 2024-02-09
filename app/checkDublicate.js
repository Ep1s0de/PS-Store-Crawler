const knex = require('./database');

module.exports = {
    async checkDublicateGameInData(link){
        let dublicate = await knex('games').where('link', link).first();
        if(!dublicate){
            return false
        }
        return true
    }

}