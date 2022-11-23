import { DateTime } from 'luxon';
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm';
import User from './User';
import HashTag from './HashTag';

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public content: string;

  @column({ columnName: 'user_id' })
  public userId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @manyToMany(() => HashTag, {
    pivotTable: '_hashtags_videos_',
  })
  public hashTags: ManyToMany<typeof HashTag>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
