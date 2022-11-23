import Post from 'App/Models/Post';
import Factory, { FactoryContextContract } from '@ioc:Adonis/Lucid/Factory';

//@ts-ignore
export default Factory.define(Post, ({ faker }: FactoryContextContract) => {
  return {
    //
  };
}).build();
