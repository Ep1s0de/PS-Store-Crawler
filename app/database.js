const connect = require('../knexfile').development.connection

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: connect.host,
    port: connect.port,
    user: connect.user,
    password: connect.password,
    database: connect.database
  }
});

module.exports = knex;