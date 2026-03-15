import { Hono } from 'hono'
import routesApi from './app.routes'
//import apiRoutes from './routes'

const app = new Hono()

app.get('/', (c) => {
  return c.text('API funcionando')
})

app.route('/api', routesApi)

export default app