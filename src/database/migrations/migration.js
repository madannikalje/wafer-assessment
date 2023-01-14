exports.up = async (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.string('email').unique().notNullable();
    table.string('mobile').unique().notNullable();
    table.string('password').notNullable();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('otp').defaultTo(null);
    table.boolean('verified').notNullable().defaultTo(false);
  })
}

exports.down = async (knex) => {
  return knex.schema.dropTableIfExists('users')
}