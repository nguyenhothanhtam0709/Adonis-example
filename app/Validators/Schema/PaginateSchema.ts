import { schema, rules } from '@ioc:Adonis/Core/Validator';

const BasePaginateSchema = {
  pageSize: schema.number.optional([rules.unsigned()]),
  pageIndex: schema.number.optional([rules.unsigned()]),
};
export default BasePaginateSchema;
