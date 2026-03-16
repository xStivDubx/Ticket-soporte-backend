import { Hono } from 'hono'
import routesApi from './app.routes'
import { cors } from 'hono/cors'

const app = new Hono();

app.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })
)

app.get('/', (c) => {
  return c.text('API funcionando')
})

app.route('/api', routesApi)

export default app