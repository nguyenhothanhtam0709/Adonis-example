import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'indexed_posts';

  public async up() {
    this.schema.raw(`create virtual table ${this.tableName} using FTS5(title, content)`);
    this.schema.raw(`
    INSERT INTO ${this.tableName}(title,content) VALUES
    ('Learn SQlite FTS5','This tutorial teaches you how to perform full-text search in SQLite using FTS5'),
    ('Advanced SQlite Full-text Search','Show you some advanced techniques in SQLite full-text searching'),
    ('SQLite Tutorial','Help you learn SQLite quickly and effectively'),
    ('SQLite FTS5 Extension', 'FTS5 is an SQLite virtual table module that provides full-text search functionality to database applications. In their most elementary form, full-text search engines allow the user to efficiently search a large collection of documents for the subset that contain one or more instances of a search term. The search functionality provided to world wide web users by Google is, among other things, a full-text search engine, as it allows users to search for all documents on the web that contain, for example, the term fts5.'),
    ('It is an error to add types.', 'Once populated, there are three ways to execute a full-text query against the contents of an FTS5 table.');
    `);
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
