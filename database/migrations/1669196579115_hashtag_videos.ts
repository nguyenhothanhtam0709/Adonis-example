import BaseSchema from '@ioc:Adonis/Lucid/Schema';

/**
 * join table for videos and hash_tags
 */
export default class extends BaseSchema {
  protected tableName = '_hashtags_videos_';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');

      /**
       *
       */
      table.integer('post_id').unsigned().references('posts.id').onDelete('SET NULL');
      table.integer('hash_tag_id').unsigned().references('hash_tags.id').onDelete('SET NULL');
      table.unique(['post_id', 'hash_tag_id']);

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
