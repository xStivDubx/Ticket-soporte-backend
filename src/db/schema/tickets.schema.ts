import { pgTable, unique, check, bigint, varchar, timestamp, index, foreignKey, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { users } from "./users.schema";



export const tickets = pgTable("tickets", {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "tickets_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
    title: varchar({ length: 200 }).notNull(),
    description: text().notNull(),
    category: varchar({ length: 30 }).notNull(),
    priority: varchar({ length: 20 }).notNull(),
    status: varchar({ length: 20 }).default('ABIERTO').notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    createdBy: bigint("created_by", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    assignedTo: bigint("assigned_to", { mode: "number" }),
    createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
    resolvedAt: timestamp("resolved_at", { mode: 'string' }),
}, (table) => [
    index("idx_tickets_assigned_to").using("btree", table.assignedTo.asc().nullsLast().op("int8_ops")),
    index("idx_tickets_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
    index("idx_tickets_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
    index("idx_tickets_created_by").using("btree", table.createdBy.asc().nullsLast().op("int8_ops")),
    index("idx_tickets_priority").using("btree", table.priority.asc().nullsLast().op("text_ops")),
    index("idx_tickets_status").using("btree", table.status.asc().nullsLast().op("text_ops")),
    foreignKey({
            columns: [table.createdBy],
            foreignColumns: [users.id],
            name: "fk_tickets_created_by"
        }),
    foreignKey({
            columns: [table.assignedTo],
            foreignColumns: [users.id],
            name: "fk_tickets_assigned_to"
        }),
    check("chk_tickets_category", sql`(category)::text = ANY ((ARRAY['HARDWARE'::character varying, 'SOFTWARE'::character varying, 'RED'::character varying, 'ACCESOS'::character varying, 'OTRO'::character varying])::text[])`),
    check("chk_tickets_priority", sql`(priority)::text = ANY ((ARRAY['CRITICA'::character varying, 'ALTA'::character varying, 'MEDIA'::character varying, 'BAJA'::character varying])::text[])`),
    check("chk_tickets_status", sql`(status)::text = ANY ((ARRAY['ABIERTO'::character varying, 'EN_PROGRESO'::character varying, 'RESUELTO'::character varying, 'CERRADO'::character varying])::text[])`),
]);
