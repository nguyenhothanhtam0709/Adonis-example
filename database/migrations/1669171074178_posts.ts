import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'posts';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('title', 255).notNullable();
      table.text('content').nullable();
      table.integer('user_id').notNullable().unsigned();

      /**
       * reference
       */
      table
        .foreign('user_id', 'user_post_foreign')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL');

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
