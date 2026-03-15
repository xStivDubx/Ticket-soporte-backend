import { Hono } from 'hono'
import { AuthController } from './auth.controller';

const authRoutes = new Hono();
const authController = new AuthController();

authRoutes.post('/login', (c) => authController.login(c));

export default authRoutes;