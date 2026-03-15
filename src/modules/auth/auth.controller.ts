import { Context } from "hono";
import { AuthService } from "./auth.services";
import { LoginDto } from "./dto/login.dto";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(context: Context) {
    try {
        const body: LoginDto = await context.req.json();

        //validar que vengan los datos necesarios
        if (!body.email || !body.password) {
            return context.json(
                {
                    message: "Faltan datos necesarios para iniciar sesión",
                },
                400,
            );
        }

        const loginResult = await this.authService.login(body.email, body.password);

        return context.json(
            {
                message: "Autenticación exitosa",
                data: loginResult
            },
            200,
        );
    } catch (error) {
        if (error instanceof Error) {
            return context.json(
                {
                    message: "Credenciales inválidas",
                },
                401,
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
