import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema/users.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt from "bcrypt";

export class UsersService {



  async getAll() {
    return await db.select().from(users);
  }
  

  async getByEmail(email: string) {
    const result= await db.select()
    .from(users)
    .where(
        and(
            eq(users.email, email),
            eq(users.state, 1) 
        ));

    return result.length > 0 ? result[0] : null;
  }


  async createUser(dataUser:CreateUserDto){
    console.log("Validando datos para crear usuario...");
    //validar que rol tenga los valores permitidos 'EMPLEADO', 'AGENTE'
    const allowedRoles = ['EMPLEADO', 'AGENTE'];
    if (!allowedRoles.includes(dataUser.role.toUpperCase())) {
        throw new Error("El rol debe ser EMPLEADO o AGENTE");
    }

    //validar longitud de contraseña
    if (dataUser.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    //validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dataUser.email)) {
        throw new Error("El email no tiene un formato válido");
    }


    //validar si ya existe un usuario con el mismo email
    const existingUser = await this.getByEmail(dataUser.email);

    if(existingUser){
        throw new Error("Ya existe un usuario con el mismo email");
    }

    // encriptar contraseña
    const hashedPassword = await bcrypt.hash(dataUser.password, 10);

    const result = await db.insert(users).values({
        name: dataUser.name,
        email: dataUser.email,
        password: hashedPassword,
        role: dataUser.role.toUpperCase(),
    }).returning();

    return result[0];

  } 



}
