import { db } from "../../db";
import { tickets } from "../../db/schema/tickets.schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { title } from "node:process";
import { ticketStatusHistory } from "../../db/schema/ticket-status.schema";
import { users } from "../../db/schema/users.schema";
import { ticketComments } from "../../db/schema/ticket-comments.schema";

export class TicketService {
  async getAll() {
    return await db.select().from(tickets).orderBy(desc(tickets.updatedAt));
  }

  async getByEmpleadoId(empleadoId: number) {
    return await db
      .select()
      .from(tickets)
      .where(eq(tickets.createdBy, empleadoId))
      .orderBy(asc(tickets.updatedAt));
  }

  async getByTitle(title: string) {
    const ticketsList = await db
      .select()
      .from(tickets)
      .where(eq(tickets.title, title))
      .orderBy(asc(tickets.updatedAt));
    return ticketsList[0] || null;
  }

  async createTicket(body: CreateTicketDto, createdBy: number) {
    console.log("Creando ticket con datos:", body, "y createdBy:", createdBy);

    const { title, description, priority, category } = body;

    //validar si priority tiene los valores permitidos 'BAJA', 'MEDIA', 'ALTA'
    const allowedPriorities = ["BAJA", "MEDIA", "ALTA", "CRITICA"];

    if (!allowedPriorities.includes(priority.toUpperCase())) {
      throw new Error("La prioridad debe ser BAJA, MEDIA, ALTA o CRITICA");
    }

    //validar si category tiene los valores permitidos 'SOFTWARE', 'HARDWARE', 'REDES', 'OTROS'
    const allowedCategories = [
      "SOFTWARE",
      "HARDWARE",
      "RED",
      "ACCESOS",
      "OTRO",
    ];
    if (!allowedCategories.includes(category.toUpperCase())) {
      throw new Error(
        "La categoría debe ser SOFTWARE, HARDWARE, RED, ACCESOS o OTRO",
      );
    }

    //validar si ya existe un ticket con el mismo título
    const existingTicket = await this.getByTitle(title);
    if (existingTicket) {
      throw new Error("Ya existe un ticket con el mismo título");
    }

    console.log("Datos validados, insertando en la base de datos...");
    const result = await db
      .insert(tickets)
      .values({
        title,
        description,
        priority: priority.toUpperCase(),
        category: category.toUpperCase(),
        status: "ABIERTO",
        createdBy,
      })
      .returning();

    console.log("Ticket creado con ID:", result);

    await db.insert(ticketStatusHistory).values({
      ticketId: result[0].id,
      oldStatus: null,
      newStatus: "ABIERTO",
      changedBy: createdBy,
    });

    return "Ticket creado exitosamente";
  }

  async asignarTickert(ticketId: number, agenteId: number) {
    //NOTA: se dejo la logica para que solo un agente pueda asignar un ticket, pero lo ideal seria que se pueda reasignar un ticket
    const existingTicket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, ticketId));

    if (existingTicket.length === 0) {
      throw new Error("No existe un ticket con el ID proporcionado");
    }

    //validar si no esta cerrado el ticket
    if (existingTicket[0].status === "CERRADO") {
      throw new Error("No se puede asignar un ticket cerrado");
    }

    const existingAgente = await db
      .select()
      .from(users)
      .where(and(eq(users.id, agenteId), eq(users.role, "AGENTE")));

    if (existingAgente.length === 0) {
      throw new Error("No existe un agente con el ID proporcionado");
    }

    //validar si el ticket ya esta asignado a un agente
    if (existingTicket[0].assignedTo) {
      throw new Error("El ticket ya está asignado a un agente");
    }

    await db
      .update(tickets)
      .set({
        assignedTo: agenteId,
        status: "EN_PROGRESO",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tickets.id, ticketId));

    await db.insert(ticketStatusHistory).values({
      ticketId,
      oldStatus: existingTicket[0].status,
      newStatus: "EN_PROGRESO",
      changedBy: agenteId,
    });

    return "Ticket asignado exitosamente";
  }

  async cambiarEstadoTicket(ticketId: number) {
    //NOTA: El cambio de estado se hará de forma secuencial: ABIERTO -> EN_PROGRESO -> RESUELTO -> CERRADO, pero lo ideal seria que se pueda cambiar a cualquier estado sin importar el estado actual del ticket, siempre y cuando se respeten las reglas de negocio (por ejemplo, no se puede cerrar un ticket que no esté resuelto)

    const existingTicket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, ticketId));

    if (existingTicket.length === 0) {
      throw new Error("No existe un ticket con el ID proporcionado");
    }

    //validar si el ticket tiene asignado un agente
    if (!existingTicket[0].assignedTo) {
      throw new Error("No se puede cambiar el estado de un ticket sin asignar");
    }

    let newStatus: string;
    switch (existingTicket[0].status) {
      case "ABIERTO":
        newStatus = "EN_PROGRESO";
        break;
      case "EN_PROGRESO":
        newStatus = "RESUELTO";
        break;
      case "RESUELTO":
        newStatus = "CERRADO";
        break;
      case "CERRADO":
        throw new Error(
          "El ticket ya está cerrado, no se puede cambiar el estado",
        );
      default:
        throw new Error("Estado del ticket no válido");
    }

    await db
      .update(tickets)
      .set({
        status: newStatus,
        updatedAt: new Date().toISOString(),
        resolvedAt: newStatus === "CERRADO" ? new Date().toISOString() : null,
      })
      .where(eq(tickets.id, ticketId));

    await db.insert(ticketStatusHistory).values({
      ticketId,
      oldStatus: existingTicket[0].status,
      newStatus,
      changedBy: existingTicket[0].assignedTo || existingTicket[0].createdBy,
    });

    return "Estado del ticket se ha cambiado a " + newStatus + " exitosamente";
  } //fin del metodo

  async addComment(ticketId: number, userId: number, comment: string) {
    //validar que el ticket exista
    const existingTicket = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, ticketId));
    if (existingTicket.length === 0) {
      throw new Error("No existe un ticket con el ID proporcionado");
    }

    //validar que el usuario exista
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (existingUser.length === 0) {
      throw new Error("No existe un usuario con el ID proporcionado");
    }

    //validar que el el ticket no este cerrado
    if (existingTicket[0].status === "CERRADO") {
      throw new Error("No se puede agregar un comentario a un ticket cerrado");
    }

    await db.insert(ticketComments).values({
      ticketId,
      userId,
      comment,
    });

    return "Comentario agregado exitosamente";
  }

  async getCommentsByTicketId(ticketId: number) {
    const comments = await db
      .select({
        commentId: ticketComments.id,
        comment: ticketComments.comment,
        createdAt: ticketComments.createdAt,
        userId: users.id,
        userName: users.name,
        userEmail: users.email,
      })
      .from(ticketComments)
      .innerJoin(users, eq(ticketComments.userId, users.id))
      .where(eq(ticketComments.ticketId, ticketId))
      .orderBy(asc(ticketComments.createdAt));

    return comments;
  }
}
