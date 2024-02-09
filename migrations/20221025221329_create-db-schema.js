module.exports.up = async knex => {
    await knex.schema.createTable('games', table => {
      table.increments('id').notNullable().unsigned().primary();
      table.string('name').notNullable().unique();
      table.string('link').notNullable().unique();

    });
    await knex.schema.createTable('prise', table => {
        table.increments('id').notNullable().unsigned().primary();
        table.string('price');
        table.integer('game-id').notNullable().unsigned().references('id').inTable('games');
        table.date('date').notNullable();
      })
  };
  
  module.exports.down = async knex => {
    await knex.schema.dropTable('general');
  };
  