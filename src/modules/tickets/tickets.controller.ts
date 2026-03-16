import { Context } from "hono";
import { TicketService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  async getAll(context: Context) {
    try {
      const userLogin = context.get("user");
      console.log("Usuario en contexto:", userLogin);

      if (userLogin.role === "EMPLEADO") {
        console.log(
          "Usuario es empleado, filtrando tickets por usuario:",
          userLogin.sub,
        );
        const tickets = await this.ticketService.getByEmpleadoId(userLogin.sub);

        return context.json({
          message: "Listado de tus tickets",
          data: tickets,
        });
      } else if (userLogin.role === "AGENTE") {
        console.log("Usuario es agente, mostrando todos los tickets");
        const tickets = await this.ticketService.getAll();

        return context.json({
          message: "Listado de tickets",
          data: tickets,
        });
      }

      return context.json(
        {
          message: "No tienes permisos para ver los tickets",
        },
        403,
      );
    } catch (error) {
      console.error("Error en TicketController.getAll:", error);
      return context.json(
        {
          message: "Error al obtener los tickets",
          error: error instanceof Error ? error.message : String(error),
        },
        500,
      );
    }
  }

  async getById(context: Context) {
    try {
      const userLogin = context.get("user");
      console.log("Usuario en contexto:", userLogin);
      const ticketId = Number(context.req.param("ticketId"));
      if (isNaN(ticketId)) {
        return context.json(
          {
            message: "El parámetro ticketId debe ser un número",
          },
          400,
        );
      }
      return context.json(
        {
          message: "Detalle del ticket",
          data: await this.ticketService.getById(ticketId),
        },
        200,
      );
    } catch (error) {
      console.error("Error en TicketController.getById:", error);
      return context.json(
        {
          message: "Error al obtener el ticket",
          error: error instanceof Error ? error.message : String(error),
        },
        500,
      );
    }
  }



  async createTicket(context: Context) {
    try {
      const userLogin = context.get("user");
      console.log("Usuario en contexto:", userLogin);

      if (userLogin.role !== "EMPLEADO") {
        return context.json(
          {
            message: "No tienes permisos para crear tickets",
          },
          403,
        );
      }

      const body: CreateTicketDto = await context.req.json();
      console.log("Datos recibidos para crear ticket:", body);

      //validar body
      if (
        !body.title ||
        !body.description ||
        !body.priority ||
        !body.category
      ) {
        return context.json(
          {
            message:
              "Todos los campos son obligatorios: title, description, priority, category",
          },
          400,
        );
      }

      const message = await this.ticketService.createTicket(
        body,
        userLogin.sub,
      );

      return context.json(
        {
          message: message,
        },
        201,
      );
    } catch (error) {
      if (error instanceof Error) {
        return context.json(
          {
            message: error instanceof Error ? error.message : String(error),
            error: "Error controlado ",
          },
          400,
        );
      }

      console.error("Error en TicketController.createTicket:", error);
      return context.json(
        {
          message: "Error al crear el ticket",
          error: error instanceof Error ? error.message : String(error),
        },
        500,
      );
    }
  }

  async asignarTickert(context: Context) {
    try {
      const userLogin = context.get("user");
      console.log("Usuario en contexto:", userLogin);
      if (userLogin.role !== "AGENTE") {
        return context.json(
          {
            message: "No tienes permisos para asignar tickets",
          },
          403,
        );
      }
      const body: { ticketId: number } = await context.req.json();
      console.log("Datos recibidos para asignar ticket:", body);
      if (!body.ticketId) {
        return context.json(
          {
            message: "El campo ticketId es obligatorio",
          },
          400,
        );
      }

      const message = await this.ticketService.asignarTickert(
        body.ticketId,
        userLogin.sub,
      );

      return context.json(
        {
          message: message,
        },
        200,
      );
    } catch (error) {
      if (error instanceof Error) {
        return context.json(
          {
            message: error.message,
            error: "Error controlado ",
          },
          400,
        );
      }

      console.error("Error en TicketController.createTicket:", error);
      return context.json(
        {
          message: error instanceof Error ? error.message : String(error),
          error: error instanceof Error ? error.message : String(error),
        },
        500,
      );
    }
  }

  async cambiarEstadoTicket(context: Context) {
    try {
      const userLogin = context.get("user");
      console.log("Usuario en contexto:", userLogin);
      if (userLogin.role !== "AGENTE") {
        return context.json(
          {
            message: "No tienes permisos para cambiar el estado de los tickets",
          },
          403,
        );
      }
      const body: { ticketId: number } = await context.req.json();
      console.log("Datos recibidos para cambiar estado del ticket:", body);
      if (!body.ticketId) {
        return context.json(
          {
            message: "El campo ticketId es obligatorio",
          },
          400,
        );
      }

      const message = await this.ticketService.cambiarEstadoTicket(
        body.ticketId,
      );

      return context.json(
        {
          message: message,
        },
        200,
      );
    } catch (error) {
      if (error instanceof Error) {
        return context.json(
          {
            message: error.message,
            error: "Error controlado ",
          },
          400,
        );
      }

      console.error("Error en TicketController.cambiarEstadoTicket:", error);
      return context.json(
        {
          message: "Error al cambiar el estado del ticket",
          error: error instanceof Error ? error.message : String(error),
        },
        500,
      );
    }
  }

  async addComment(context: Context) {
    try {
      const userLogin = context.get("user");
      console.log("Usuario en contexto:", userLogin);

      const body: { ticketId: number; comment: string } = await context.req.json();
      console.log("Datos recibidos para agregar comentario:", body);
      if (!body.ticketId || !body.comment) {
        return context.json(
          {
            message: "Los campos ticketId y comment son obligatorios",
          },
          400,
        );
      }

      const message = await this.ticketService.addComment(body.ticketId, userLogin.sub, body.comment);

      return context.json(
        {
          message: message,
        },
        200,
      );



    } catch (error) {
      if (error instanceof Error) {
        return context.json(
          {
            message: error.message,
            error: "Error controlado ",
          },
          400,
        );
      }

      console.error("Error en TicketController.cambiarEstadoTicket:", error);
      return context.json(
        {
          message: "Error al cambiar el estado del ticket",
          error: error instanceof Error ? error.message : String(error),
        },
        500,
      );
    }
  }


  async getCommentsByTicketId(context: Context) {
    try {
      const userLogin = context.get("user");
      console.log("Usuario en contexto:", userLogin);
      const ticketId = Number(context.req.param("ticketId"));
      if (isNaN(ticketId)) {
        return context.json(
          {
            message: "El parámetro ticketId debe ser un número",
          },
          400,
        );
      }

      const comments = await this.ticketService.getCommentsByTicketId(ticketId);

      return context.json(
        {
          message: "Comentarios del ticket",
          data: comments,
        },
        200,
      );


    }catch (error) {
      if (error instanceof Error) {
        return context.json(
          {
            message: error.message,
            error: "Error controlado ",
          },
          400,
        );
      }

      console.error("Error en TicketController.cambiarEstadoTicket:", error);
      return context.json(
        {
          message: "Error al cambiar el estado del ticket",
          error: error instanceof Error ? error.message : String(error),
        },
        500,
      );
    }
  }


} //fin de la clase
