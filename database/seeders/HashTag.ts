import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import HashTag from 'App/Models/HashTag';

export default class HashTagSeeder extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await HashTag.updateOrCreateMany('id', [
      {
        id: 1,
        name: 'Sport',
        key: 'sport',
      },
      {
        id: 2,
        name: 'Soccer',
        key: 'soccer',
        parentId: 1,
      },
      {
        id: 3,
        name: 'Book',
        key: 'book',
      },
      {
        id: 4,
        name: 'Gaming',
        key: 'gaming',
      },
      {
        id: 5,
        name: 'Programing',
        key: 'programing',
      },
    ]);
  }
}
