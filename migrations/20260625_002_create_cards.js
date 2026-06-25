exports.up = function (knex) {
  return knex.schema.createTable('cards', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table
      .string('status', 50)
      .notNullable()
      .defaultTo('todo')
      .checkIn(['todo', 'in_progress', 'done']);
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamps(true, true);

    table.index('user_id');
    table.index('status');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('cards');
};
