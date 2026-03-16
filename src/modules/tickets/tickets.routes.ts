import { Hono } from 'hono'
import { TicketController } from './tickets.controller';

const ticketRoutes = new Hono();
const ticketController = new TicketController();

ticketRoutes.get('/', (c) => ticketController.getAll(c));
ticketRoutes.post('/', (c) => ticketController.createTicket(c));
ticketRoutes.get('/detail/:ticketId', (c) => ticketController.getById(c));
ticketRoutes.post('/asignar', (c) => ticketController.asignarTickert(c));
ticketRoutes.post('/cambiar-estado', (c) => ticketController.cambiarEstadoTicket(c));
ticketRoutes.post('/add-comment', (c) => ticketController.addComment(c));
ticketRoutes.get('/comments/:ticketId', (c) => ticketController.getCommentsByTicketId(c));

export default ticketRoutes