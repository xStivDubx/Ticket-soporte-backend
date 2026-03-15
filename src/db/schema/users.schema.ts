import { pgTable, unique, check, bigint, varchar, timestamp, index, foreignKey, text, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const users = pgTable("users", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    name: varchar({ length: 150 }).notNull(),
    email: varchar({ length: 150 }).notNull(),
    password: varchar({ length: 300 }).notNull(),
    role: varchar({ length: 20 }).notNull(),
    state: integer().default(1),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    unique("users_email_key").on(table.email),
    check("chk_users_role", sql`(role)::text = ANY ((ARRAY['EMPLEADO'::character varying, 'AGENTE'::character varying])::text[])`),
]);