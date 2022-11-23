import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';

export default class HashTag extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public key: string;

  @column({ columnName: 'parent_id' })
  public parentId?: number;

  @belongsTo(() => HashTag)
  parent: BelongsTo<typeof HashTag>;

  @hasMany(() => HashTag)
  children: HasMany<typeof HashTag>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
