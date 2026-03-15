import { Hono } from 'hono'
import { UsersController } from './users.controller';

const userRoutes = new Hono();
const userController = new UsersController();

userRoutes.get('/', (c) => userController.getAll(c));
userRoutes.post('/', (c) => userController.createUser(c));

export default userRoutes