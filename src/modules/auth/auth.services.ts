import bcrypt from 'bcrypt';
import { UsersService } from "../users/users.services"
import { env } from '../../config/env';
import { sign } from 'hono/jwt';


export class AuthService {

    userService:UsersService;

    constructor() {
        this.userService = new UsersService();
    } 

    async login(email: string, password: string) {
        console.log("Iniciando sesión...");
        const user = await this.userService.getByEmail(email);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const isValid = await bcrypt.compare(password, user.password);
        console.log("Contraseña válida:", isValid);
        if (!isValid) {
            throw new Error("Usuario no encontrado");
        }

        const jwtSecret = env.JWT_SECRET;
        const expiresIn = Number(env.JWT_EXPIRES_IN) || 3600; // 1 hora por defecto
        const payload ={
            sub: user.id,
            email: user.email,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + expiresIn
        }

        const token = await sign(payload, jwtSecret!)
        return {
            token,
            email: user.email,
            role: user.role
        }
    }

}