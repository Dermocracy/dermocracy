exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.bigIncrements('id').primary();
    table.bigInteger('chat_id').unique().notNullable();
    table.string('lang', 2);
    table.timestamps(false, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
