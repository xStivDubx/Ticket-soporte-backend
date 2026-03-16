import { Hono } from 'hono'
import { DashboardController } from './dashboard.controller';


const dashboardRoutes = new Hono();
const dashboardController = new DashboardController();

dashboardRoutes.get('/', (c) => dashboardController.getAll(c));

export default dashboardRoutes