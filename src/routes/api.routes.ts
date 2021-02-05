import { Router as ExpressRouter } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import auth from '../middleware/auth';
import user from '../middleware/user';

const Router = ExpressRouter();

Router.post('/auth/login', AuthController.login);
Router.post('/auth/register', AuthController.register);

Router.get('/users', user, auth, UserController.getAll);
Router.get('/users/:uuid', user, auth, UserController.get);
Router.delete('/users/:uuid', user, auth, UserController.destroy);
Router.put('/users/:uuid', user, auth, UserController.update);

export default Router;
