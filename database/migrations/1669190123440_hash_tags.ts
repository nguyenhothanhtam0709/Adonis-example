import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'hash_tags';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      table.string('name', 255).notNullable();
      table.string('key', 255).notNullable();

      table.integer('parent_id').nullable().unsigned();

      /**
       * reference
       */
      table.foreign('parent_id', 'parent_tag_foreign').references('id').inTable('hash_tags');

      /**
       *
       */
      table.unique('key');

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
