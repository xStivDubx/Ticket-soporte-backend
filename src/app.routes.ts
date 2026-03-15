import { Hono } from 'hono'
import userRoutes from './modules/users/users.routes'
import authRoutes from './modules/auth/auth.routes'
import ticketRoutes from './modules/tickets/tickets.routes'
import { authMiddleware } from './middleware/auth.middleware'

const routesApi = new Hono()

routesApi.route('/users', userRoutes)
routesApi.route('/auth', authRoutes)


// todo lo demás requiere token
routesApi.use('*', authMiddleware)
routesApi.route('/tickets', ticketRoutes)

export default routesApi