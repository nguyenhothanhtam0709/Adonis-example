import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class IndexedPost extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public content: string;
}
