/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

Route.get('/', async ({ view }: HttpContextContract) => {
  return view.render('home');
});

Route.group(() => {
  Route.group(() => {
    Route.post('register', 'AuthController.register');
    Route.post('login', 'AuthController.login');
    Route.group(() => {
      Route.post('logout', 'AuthController.logout');
      Route.get('profile', 'AuthController.profile');
    }).middleware('auth:api');
  }).prefix('auth');

  Route.resource('posts', 'PostsController')
    .apiOnly()
    .middleware({
      '*': ['auth:api'],
    });

  Route.group(() => {
    Route.get('my-posts', 'FeedsController.myPosts').middleware(['auth:api']);
    Route.get('by-hashtags', 'FeedsController.postsByHashtag');
  }).prefix('feeds');

  Route.group(() => {
    Route.get('', 'HashTagsController.index');
    Route.group(() => {
      Route.post('', 'HashTagsController.store');
      Route.delete(':id', 'HashTagsController.delete');
    }).middleware(['auth:api']);
  }).prefix('hash-tags');

  Route.group(() => {
    Route.get('search', 'IndexedPostsController.index').middleware(['auth:api']);
  }).prefix('indexed-posts');

  Route.group(() => {
    Route.get('status', 'SSEController.getStatus');
    Route.get('events', 'SSEController.getEvents'); // sse route
    Route.post('fact', 'SSEController.addFact');
  }).prefix('sse');
}).prefix('api');
