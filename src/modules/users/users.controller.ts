import { Context } from "hono";
import { UsersService } from "./users.services";
import { CreateUserDto } from "./dto/create-user.dto";

export class UsersController {
  private userService: UsersService;

  constructor() {
    this.userService = new UsersService();
  }

  async getAll(context: Context) {
    const users = await this.userService.getAll();
    return context.json({
      message: "Listado de usuarios",
      data: users,
    });
  }

  async createUser(context: Context) {
    try {
      console.log("Creando usuario...");
      const body: CreateUserDto = await context.req.json();

      //validar que vengan los datos necesarios
      if (!body.name || !body.email || !body.password || !body.role) {
        return context.json(
          {
            message: "Faltan datos necesarios para crear el usuario",
          },
          400,
        );
      }
      const userCreated = await this.userService.createUser(body);
      return context.json(
        {
          message: "Usuario creado exitosamente"
        },
        201,
      );
    } catch (error) {
      
      if (
        error instanceof Error &&
        (
            error.message === "Ya existe un usuario con el mismo email"
            || error.message === "El rol debe ser EMPLEADO o AGENTE"
            || error.message === "La contraseña debe tener al menos 6 caracteres"
            || error.message === "El email no tiene un formato válido"
        )
      ) {
        return context.json(
          {
            message: error.message,
            data: null,
          },
          400,
        );
      }
      console.error("Error al crear el usuario:", error);
      return context.json(
        {
          message: "Error al crear el usuario",
          error: error instanceof Error ? error.message : "Error desconocido",
        },
        500,
      );
    }
  }
}
